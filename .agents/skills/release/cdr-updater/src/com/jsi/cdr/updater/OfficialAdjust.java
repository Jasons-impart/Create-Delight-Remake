package com.jsi.cdr.updater;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;

/**
 * 官方包调整：从构建结果中排除指定官方文件（不会被私货覆盖规则替代）。
 * 规则文件：private/official-adjust.toml
 */
final class OfficialAdjust {
    private OfficialAdjust() {}

    static final class Rule {
        final String path;
        final String side;

        Rule(String path, String side) {
            this.path = Fs.posix(path);
            this.side = normalizeSide(side);
        }
    }

    static Path rulesFile(Pack.Config config) {
        return config.privateDir.resolve("official-adjust.toml");
    }

    static List<Rule> load(Pack.Config config) {
        Path file = rulesFile(config);
        if (!Files.isRegularFile(file)) {
            return List.of();
        }
        try {
            Map<String, Object> root = Toml.load(file);
            Object raw = root.get("exclude");
            if (!(raw instanceof List<?> list)) {
                return List.of();
            }
            List<Rule> out = new ArrayList<>();
            Set<String> seen = new LinkedHashSet<>();
            for (Object item : list) {
                if (!(item instanceof Map<?, ?> map)) {
                    continue;
                }
                @SuppressWarnings("unchecked")
                Map<String, Object> row = (Map<String, Object>) map;
                String path = Toml.str(row, "path", "").trim();
                if (path.isBlank() || path.contains("..") || Path.of(path).isAbsolute()) {
                    continue;
                }
                path = Fs.posix(path);
                String key = path + "|" + normalizeSide(Toml.str(row, "side", "both"));
                if (!seen.add(key)) {
                    continue;
                }
                out.add(new Rule(path, Toml.str(row, "side", "both")));
            }
            return out;
        } catch (Exception error) {
            return List.of();
        }
    }

    static void save(Pack.Config config, List<Rule> rules) throws Exception {
        Path file = rulesFile(config);
        Files.createDirectories(file.getParent());
        StringBuilder sb = new StringBuilder();
        sb.append("# 官方包调整：排除的文件不会进入客户端/服务端仓库与清单。\n");
        sb.append("# side: both / client / server\n\n");
        for (Rule rule : rules) {
            if (rule.path.isBlank()) {
                continue;
            }
            sb.append("[[exclude]]\n");
            sb.append("path = ").append(Toml.quote(rule.path)).append('\n');
            sb.append("side = ").append(Toml.quote(rule.side)).append("\n\n");
        }
        Files.writeString(file, sb.toString());
    }

    static Set<String> excludedPaths(List<Rule> rules, String targetSide) {
        Set<String> out = new LinkedHashSet<>();
        for (Rule rule : rules) {
            if (Pack.allowed(rule.side, targetSide)) {
                out.add(rule.path);
            }
        }
        return out;
    }

    static int apply(Pack.Config config, List<Rule> rules, Set<String> privatePaths, Consumer<String> log)
            throws Exception {
        if (rules.isEmpty()) {
            writeIndex(config, rules);
            return 0;
        }
        Set<String> keep = privatePaths == null ? Set.of() : privatePaths;
        int removed = 0;
        removed += applySide(config.clientDir, excludedPaths(rules, "client"), keep);
        removed += applySide(config.serverDir, excludedPaths(rules, "server"), keep);
        writeIndex(config, rules);
        if (removed > 0 && log != null) {
            log.accept("官方包调整：已排除 " + removed + " 个文件");
        }
        return removed;
    }

    /**
     * 增量构建：按规则从仓库删除文件，并恢复此前被排除、现已取消排除的官方文件。
     * 私货覆盖的路径不会被排除删除。
     */
    static int applyIncremental(Pack.Config config, List<Rule> rules, Set<String> privatePaths,
                                Map<String, Manifests.FileEntry> clientUpsert,
                                Map<String, Manifests.FileEntry> serverUpsert,
                                Set<String> clientRemove, Set<String> serverRemove,
                                Map<String, String> officialSides,
                                Consumer<String> log) throws Exception {
        Map<String, String> previous = loadIndex(config);
        Set<String> prevClient = excludedPaths(rulesFromIndex(previous), "client");
        Set<String> prevServer = excludedPaths(rulesFromIndex(previous), "server");
        Set<String> keep = privatePaths == null ? Set.of() : privatePaths;
        int changed = 0;
        Set<String> clientExclude = excludedPaths(rules, "client");
        Set<String> serverExclude = excludedPaths(rules, "server");

        for (String rel : clientExclude) {
            if (keep.contains(rel)) {
                continue;
            }
            changed += removeFromRepo(config.clientDir, rel, prevClient.contains(rel), clientUpsert, clientRemove);
        }
        for (String rel : serverExclude) {
            if (keep.contains(rel)) {
                continue;
            }
            changed += removeFromRepo(config.serverDir, rel, prevServer.contains(rel), serverUpsert, serverRemove);
        }

        Map<String, String> current = indexMap(rules);
        for (Map.Entry<String, String> entry : previous.entrySet()) {
            String path = entry.getKey();
            String oldSide = entry.getValue();
            String newSide = current.get(path);
            if (newSide != null && newSide.equals(oldSide)) {
                continue;
            }
            // 完全取消排除，或端侧收窄后恢复另一端
            if (newSide == null || (!"both".equals(newSide) && "both".equals(oldSide))) {
                if (newSide == null || "server".equals(newSide)) {
                    if (!clientExclude.contains(path)) {
                        changed += Pack.restoreOfficialFile(config, path, "client", officialSides,
                                clientUpsert, clientRemove);
                    }
                }
                if (newSide == null || "client".equals(newSide)) {
                    if (!serverExclude.contains(path)) {
                        changed += Pack.restoreOfficialFile(config, path, "server", officialSides,
                                serverUpsert, serverRemove);
                    }
                }
            }
        }

        writeIndex(config, rules);
        if (changed > 0 && log != null) {
            log.accept("官方包调整：增量处理 " + changed + " 处");
        }
        return changed;
    }

    private static int applySide(Path root, Set<String> paths, Set<String> keepPrivate) throws Exception {
        int n = 0;
        Path absRoot = root.toAbsolutePath().normalize();
        for (String rel : paths) {
            if (keepPrivate.contains(rel)) {
                continue;
            }
            Path target = root.resolve(rel).normalize();
            if (!target.toAbsolutePath().normalize().startsWith(absRoot)) {
                continue;
            }
            if (Files.isRegularFile(target)) {
                Files.delete(target);
                n++;
            }
        }
        return n;
    }

    static List<Rule> parseRules(Object raw) {
        if (!(raw instanceof List<?> list)) {
            return List.of();
        }
        List<Rule> out = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();
        for (Object item : list) {
            if (!(item instanceof Map<?, ?> map)) {
                continue;
            }
            @SuppressWarnings("unchecked")
            Map<String, Object> row = (Map<String, Object>) map;
            String path = Toml.str(row, "path", "").trim();
            if (path.isBlank() || path.contains("..") || Path.of(path).isAbsolute()) {
                continue;
            }
            path = Fs.posix(path);
            String side = normalizeSide(Toml.str(row, "side", "both"));
            String key = path + "|" + side;
            if (!seen.add(key)) {
                continue;
            }
            out.add(new Rule(path, side));
        }
        return out;
    }

    private static int removeFromRepo(Path root, String rel, boolean alreadyExcluded,
                                     Map<String, Manifests.FileEntry> upsert, Set<String> remove) throws Exception {
        Path target = root.resolve(rel);
        boolean deleted = Files.deleteIfExists(target);
        if (deleted) {
            remove.add(rel);
            upsert.remove(rel);
            return 1;
        }
        if (!alreadyExcluded) {
            // 首次排除：即使磁盘上已不存在，也要从清单去掉
            remove.add(rel);
            upsert.remove(rel);
            return 1;
        }
        return 0;
    }

    private static List<Rule> rulesFromIndex(Map<String, String> index) {
        List<Rule> out = new ArrayList<>();
        for (Map.Entry<String, String> entry : index.entrySet()) {
            out.add(new Rule(entry.getKey(), entry.getValue()));
        }
        return out;
    }

    static Path indexFile(Pack.Config config) {
        return config.manifestsDir().resolve("official-adjust-index.json");
    }

    static Map<String, String> loadIndex(Pack.Config config) {
        Path file = indexFile(config);
        Map<String, String> out = new LinkedHashMap<>();
        if (!Files.isRegularFile(file)) {
            return out;
        }
        try {
            Object parsed = Json.parse(Files.readString(file));
            if (parsed instanceof Map<?, ?> map) {
                for (Map.Entry<?, ?> entry : map.entrySet()) {
                    out.put(Fs.posix(String.valueOf(entry.getKey())),
                            normalizeSide(String.valueOf(entry.getValue())));
                }
            }
        } catch (Exception ignored) {
            return out;
        }
        return out;
    }

    static void writeIndex(Pack.Config config, List<Rule> rules) throws Exception {
        Files.createDirectories(config.manifestsDir());
        Files.writeString(indexFile(config), Json.stringify(indexMap(rules)));
    }

    private static Map<String, String> indexMap(List<Rule> rules) {
        Map<String, String> out = new LinkedHashMap<>();
        for (Rule rule : rules) {
            out.put(rule.path, rule.side);
        }
        return out;
    }

    static List<Map<String, Object>> listOfficialRows(Pack.Config config) throws Exception {
        Map<String, String> sides = loadOfficialSideMap(config);
        Set<String> excluded = new LinkedHashSet<>();
        Map<String, String> excludeSide = new LinkedHashMap<>();
        for (Rule rule : load(config)) {
            excluded.add(rule.path);
            excludeSide.put(rule.path, rule.side);
        }
        List<Map<String, Object>> rows = new ArrayList<>();
        for (Map.Entry<String, String> entry : sides.entrySet()) {
            String path = entry.getKey();
            if (PackPaths.skipUnified(path) || path.endsWith(".pw.toml")) {
                continue;
            }
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("path", path);
            row.put("side", entry.getValue());
            row.put("category", categoryOf(path));
            row.put("kind", kindOf(path));
            boolean isExcluded = excluded.contains(path);
            row.put("excluded", isExcluded);
            row.put("exclude_side", isExcluded ? excludeSide.getOrDefault(path, "both") : "");
            rows.add(row);
        }
        rows.sort((a, b) -> {
            String ca = String.valueOf(a.get("category"));
            String cb = String.valueOf(b.get("category"));
            int c = ca.compareToIgnoreCase(cb);
            if (c != 0) {
                return c;
            }
            return String.valueOf(a.get("path")).compareToIgnoreCase(String.valueOf(b.get("path")));
        });
        return rows;
    }

    static List<String> categories(List<Map<String, Object>> rows) {
        LinkedHashSet<String> out = new LinkedHashSet<>();
        for (Map<String, Object> row : rows) {
            out.add(String.valueOf(row.get("category")));
        }
        return new ArrayList<>(out);
    }

    static String categoryOf(String path) {
        String rel = Fs.posix(path);
        int slash = rel.indexOf('/');
        if (slash <= 0) {
            return "根目录";
        }
        return rel.substring(0, slash);
    }

    static String kindOf(String path) {
        String rel = Fs.posix(path).toLowerCase(Locale.ROOT);
        if (rel.startsWith("mods/") && rel.endsWith(".jar")) {
            return "mod";
        }
        if (rel.startsWith("config/") || rel.startsWith("defaultconfigs/")) {
            return "config";
        }
        if (rel.startsWith("kubejs/")) {
            return "kubejs";
        }
        if (rel.startsWith("resourcepacks/") || rel.startsWith("shaderpacks/")) {
            return "resource";
        }
        if (rel.startsWith("libraries/")) {
            return "library";
        }
        return "other";
    }

    @SuppressWarnings("unchecked")
    private static Map<String, String> loadOfficialSideMap(Pack.Config config) throws Exception {
        Path mapFile = config.dataDir.resolve("manifests/official-side-map.json");
        Map<String, String> out = new LinkedHashMap<>();
        if (Files.isRegularFile(mapFile)) {
            Object parsed = Json.parse(Files.readString(mapFile));
            if (parsed instanceof Map<?, ?> map) {
                for (Map.Entry<?, ?> entry : map.entrySet()) {
                    out.put(Fs.posix(String.valueOf(entry.getKey())), String.valueOf(entry.getValue()));
                }
            }
            return out;
        }
        // fallback: union of current repo trees marked as official-ish
        if (Files.isDirectory(config.clientDir)) {
            for (Path file : Fs.files(config.clientDir)) {
                String rel = Fs.posix(config.clientDir, file);
                out.putIfAbsent(rel, PackPaths.defaultSide(rel));
            }
        }
        if (Files.isDirectory(config.serverDir)) {
            for (Path file : Fs.files(config.serverDir)) {
                String rel = Fs.posix(config.serverDir, file);
                out.putIfAbsent(rel, PackPaths.defaultSide(rel));
            }
        }
        return out;
    }

    private static String normalizeSide(String side) {
        String value = side == null ? "both" : side.trim().toLowerCase(Locale.ROOT);
        return switch (value) {
            case "client", "server", "both" -> value;
            default -> "both";
        };
    }
}
