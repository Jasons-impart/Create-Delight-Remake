package com.jsi.cdr.updater;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class Changelog {
    private static final Pattern VERSION = Pattern.compile(
            "^(?<name>.+?)[-_](?<version>\\d+(?:\\.\\d+)*(?:[-.][A-Za-z0-9]+)*)(?:\\.jar)?$",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern TAG = Pattern.compile("^v(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)(?:-test)?$");

    private Changelog() {}

    static Map<String, Object> build(List<Manifests.Change> changes, String previous, String current, String body) {
        String kind = classify(changes);
        String text;
        if ("none".equals(kind)) {
            text = "没有检测到文件改动。";
        } else if ("mods".equals(kind)) {
            text = formatMods(changes);
        } else if (majorJump(previous, current) && body != null && !body.isBlank()) {
            text = "【大版本更新】" + (previous.isBlank() ? "未知" : previous) + " → " + current + "\n\n" + summary(body);
        } else {
            text = formatFiles(changes);
        }
        Map<String, Object> map = Json.map();
        map.put("kind", kind);
        map.put("text", text);
        return map;
    }

    static String classify(List<Manifests.Change> changes) {
        if (changes.isEmpty()) {
            return "none";
        }
        for (Manifests.Change change : changes) {
            if (!PackPaths.isModPayload(change.path)) {
                return "major";
            }
        }
        return "mods";
    }

    private static boolean majorJump(String previous, String current) {
        Matcher prev = TAG.matcher(previous == null ? "" : previous);
        Matcher curr = TAG.matcher(current == null ? "" : current);
        if (!prev.matches() || !curr.matches()) {
            return previous != null && current != null && !previous.isBlank() && !current.isBlank() && !previous.equals(current);
        }
        return !(prev.group(1).equals(curr.group(1)) && prev.group(2).equals(curr.group(2)) && prev.group(3).equals(curr.group(3)));
    }

    static String summary(String body) {
        int marker = body.indexOf("## 精简版");
        String section = marker >= 0 ? body.substring(marker + "## 精简版".length()) : body;
        for (String stop : List.of("**增量更新**", "**详细更新**")) {
            int index = section.indexOf(stop);
            if (index >= 0) {
                section = section.substring(0, index);
            }
        }
        return section.trim();
    }

    private static String[] parseMod(String filename) {
        String stem = Fs.stem(filename);
        Matcher matcher = VERSION.matcher(stem);
        if (!matcher.matches()) {
            return new String[]{stem, ""};
        }
        return new String[]{matcher.group("name"), matcher.group("version")};
    }

    private static String formatMods(List<Manifests.Change> changes) {
        Map<String, Manifests.Change> removed = new LinkedHashMap<>();
        Map<String, Manifests.Change> added = new LinkedHashMap<>();
        for (Manifests.Change change : changes) {
            if ("remove".equals(change.action)) {
                removed.put(parseMod(change.path)[0], change);
            } else if ("add".equals(change.action)) {
                added.put(parseMod(change.path)[0], change);
            }
        }
        List<String> lines = new ArrayList<>();
        lines.add("【模组改动】");
        List<String> consumed = new ArrayList<>();
        for (Map.Entry<String, Manifests.Change> entry : added.entrySet()) {
            Manifests.Change gone = removed.get(entry.getKey());
            if (gone != null) {
                String oldVer = parseMod(gone.path)[1];
                String newVer = parseMod(entry.getValue().path)[1];
                lines.add("- 更新模组：" + parseMod(gone.path)[0] + " "
                        + (oldVer.isBlank() ? Fs.fileName(gone.path) : oldVer) + " → "
                        + (newVer.isBlank() ? Fs.fileName(entry.getValue().path) : newVer));
                consumed.add(entry.getKey());
            } else {
                lines.add("- 新增模组：" + Fs.fileName(entry.getValue().path));
            }
        }
        for (Map.Entry<String, Manifests.Change> entry : removed.entrySet()) {
            if (!consumed.contains(entry.getKey())) {
                lines.add("- 移除模组：" + Fs.fileName(entry.getValue().path));
            }
        }
        for (Manifests.Change change : changes) {
            if ("update".equals(change.action)) {
                lines.add("- 更新模组：" + Fs.fileName(change.path));
            }
        }
        if (lines.size() == 1) {
            lines.add("- 模组文件有改动。");
        }
        return String.join("\n", lines);
    }

    private static String formatFiles(List<Manifests.Change> changes) {
        Map<String, String> titles = new LinkedHashMap<>();
        titles.put("mod", "模组");
        titles.put("config", "配置");
        titles.put("kubejs", "KubeJS");
        titles.put("resourcepack", "资源包");
        titles.put("shaderpack", "光影");
        titles.put("tacz", "枪包");
        titles.put("other", "其他文件");
        Map<String, List<Manifests.Change>> grouped = new LinkedHashMap<>();
        for (Manifests.Change change : changes) {
            grouped.computeIfAbsent(change.kind, key -> new ArrayList<>()).add(change);
        }
        List<String> lines = new ArrayList<>();
        lines.add("【内容改动】");
        for (Map.Entry<String, String> title : titles.entrySet()) {
            List<Manifests.Change> items = grouped.get(title.getKey());
            if (items == null || items.isEmpty()) {
                continue;
            }
            lines.add(title.getValue() + "：");
            for (Manifests.Change change : items) {
                String action = switch (change.action) {
                    case "add" -> "新增";
                    case "update" -> "更新";
                    case "remove" -> "删除";
                    default -> change.action;
                };
                lines.add("- " + action + " " + change.path);
            }
        }
        return String.join("\n", lines);
    }
}
