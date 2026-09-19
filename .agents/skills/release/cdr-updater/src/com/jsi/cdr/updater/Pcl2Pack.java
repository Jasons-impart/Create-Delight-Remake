package com.jsi.cdr.updater;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

final class Pcl2Pack {
    static Path export(Pack.Config config, Path updaterJar, Path output) throws Exception {
        if (!Files.isRegularFile(config.manifestsDir().resolve("client.json"))) {
            Pack.buildRepos(config, System.out::println);
        }
        Files.createDirectories(output.getParent());
        List<Object> curseFiles = curseForgeMods(config);
        try (ZipOutputStream zip = new ZipOutputStream(Files.newOutputStream(output))) {
            putText(zip, "manifest.json", Json.stringify(curseForge(config, curseFiles)));
            putText(zip, "mcbbs.packmeta", Json.stringify(mcbbs(config)));
            Path clientRoot = config.clientDir;
            if (Files.exists(clientRoot)) {
                for (Path file : Fs.files(clientRoot)) {
                    String rel = Fs.posix(clientRoot, file);
                    if (!includeOverride(rel)) {
                        continue;
                    }
                    putFile(zip, "overrides/" + rel, file);
                }
            }
            putFile(zip, "overrides/mods/cdr-updater.jar", updaterJar);
            putText(zip, "overrides/cdr-updater.toml", Pack.instanceToml(config, "client"));
        }
        System.out.println("PCL2 整合包不内置模组 jar，CurseForge 清单 " + curseFiles.size()
                + " 个；配置等写入 overrides。没有 CurseForge 编号的模组由更新器在第一次开游戏时补齐。");
        return output;
    }

    static boolean includeOverride(String rel) {
        String path = Fs.posix(rel);
        if ("mods/cdr-updater.jar".equals(path) || "cdr-updater.toml".equals(path)) {
            return false;
        }
        return !PackPaths.isModPayload(path);
    }

    private static Map<String, Object> curseForge(Pack.Config config, List<Object> files) {
        Map<String, Object> minecraft = Json.map();
        minecraft.put("version", config.minecraft);
        Map<String, Object> loader = Json.map();
        loader.put("id", "forge-" + config.forge);
        loader.put("primary", true);
        minecraft.put("modLoaders", List.of(loader));
        Map<String, Object> manifest = Json.map();
        manifest.put("minecraft", minecraft);
        manifest.put("manifestType", "minecraftModpack");
        manifest.put("manifestVersion", 1);
        manifest.put("name", config.packName);
        manifest.put("version", config.officialVersion);
        manifest.put("author", "JSI");
        manifest.put("overrides", "overrides");
        manifest.put("files", files);
        return manifest;
    }

    static List<Object> curseForgeMods(Pack.Config config) throws Exception {
        Map<String, Map<String, Object>> unique = new LinkedHashMap<>();
        for (Path root : metadataRoots(config)) {
            collectCurseForgeMods(unique, Packwiz.readAssets(root));
            collectCurseForgeMods(unique, Packwiz.readCurseForgeManifest(root));
        }
        return new ArrayList<>(unique.values());
    }

    private static void collectCurseForgeMods(Map<String, Map<String, Object>> unique, List<Packwiz.Asset> assets) {
        if (assets == null) {
            return;
        }
        for (Packwiz.Asset asset : assets) {
            if (asset == null || asset.projectId <= 0 || asset.fileId <= 0) {
                continue;
            }
            if (!Pack.allowed(asset.side, "client")) {
                continue;
            }
            if (!PackPaths.isModPayload(asset.path)) {
                continue;
            }
            String key = asset.projectId + ":" + asset.fileId;
            if (unique.containsKey(key)) {
                continue;
            }
            Map<String, Object> row = Json.map();
            row.put("projectID", asset.projectId);
            row.put("fileID", asset.fileId);
            row.put("required", true);
            unique.put(key, row);
        }
    }

    private static List<Path> metadataRoots(Pack.Config config) throws Exception {
        List<Path> roots = new ArrayList<>();
        addDir(roots, config.officialDir);
        Path cache = config.dataDir.resolve("cache").resolve(config.officialVersion);
        addExtract(roots, cache.resolve("client-raw"));
        addExtract(roots, cache.resolve("server-raw"));
        addDir(roots, config.unifiedDir);
        addDir(roots, config.clientDir);
        return roots;
    }

    private static void addDir(List<Path> roots, Path dir) {
        if (dir != null && Files.isDirectory(dir)) {
            roots.add(dir);
        }
    }

    private static void addExtract(List<Path> roots, Path extract) throws Exception {
        if (extract != null && Files.isDirectory(extract)) {
            roots.add(Fs.packRoot(extract));
        }
    }

    private static Map<String, Object> mcbbs(Pack.Config config) {
        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("manifestType", "minecraftModpack");
        meta.put("manifestVersion", 2);
        meta.put("name", config.packName);
        meta.put("version", config.officialVersion);
        meta.put("author", "JSI");
        meta.put("description", "Create Delight Remake 客户端。点 PCL2 开启游戏时会自动检查文件更新。");
        meta.put("fileApi", "");
        meta.put("url", "");
        meta.put("forceUpdate", false);
        Map<String, Object> game = Json.map();
        game.put("id", "game");
        game.put("version", config.minecraft);
        Map<String, Object> forge = Json.map();
        forge.put("id", "forge");
        forge.put("version", config.forge);
        meta.put("addons", List.of(game, forge));
        meta.put("files", Json.list());
        meta.put("libraries", Json.list());
        meta.put("origin", Json.list());
        return meta;
    }

    private static void putText(ZipOutputStream zip, String name, String text) throws Exception {
        zip.putNextEntry(new ZipEntry(name));
        zip.write(text.getBytes(StandardCharsets.UTF_8));
        zip.closeEntry();
    }

    private static void putFile(ZipOutputStream zip, String name, Path file) throws Exception {
        zip.putNextEntry(new ZipEntry(name.replace('\\', '/')));
        try (var in = Files.newInputStream(file)) {
            in.transferTo(zip);
        }
        zip.closeEntry();
    }
}
