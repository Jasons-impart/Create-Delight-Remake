package com.jsi.cdr.updater;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Locale;

final class Privates {
    private Privates() {}

    static List<Pack.PrivateFile> list(Pack.Config config) throws Exception {
        return Pack.loadPrivate(config.privateDir);
    }

    static Path add(Pack.Config config, Path source, String dest, String side) throws Exception {
        if (source == null || !Files.isRegularFile(source)) {
            throw new IllegalArgumentException("请选择要添加的私货文件");
        }
        String rel = normalizeDest(dest, source);
        String normalizedSide = side == null ? "auto" : side.trim().toLowerCase(Locale.ROOT);
        Path filesRoot = config.privateDir.resolve("files");
        Path target = filesRoot.resolve(rel).normalize();
        if (!target.startsWith(filesRoot.toAbsolutePath().normalize())) {
            throw new IllegalArgumentException("私货路径不能跳出 files 目录");
        }
        Fs.copyFile(source, target);
        Path sideFile = target.resolveSibling(target.getFileName() + ".side");
        if ("auto".equals(normalizedSide) || normalizedSide.isBlank()) {
            Files.deleteIfExists(sideFile);
        } else {
            Files.writeString(sideFile, Sides.normalize(normalizedSide));
        }
        return target;
    }

    static void remove(Pack.Config config, String dest) throws Exception {
        String wanted = Fs.posix(dest);
        if (wanted.isBlank()) {
            throw new IllegalArgumentException("请选择要删除的私货");
        }
        boolean found = false;
        for (Pack.PrivateFile file : list(config)) {
            if (!wanted.equals(file.path)) {
                continue;
            }
            found = true;
            Files.deleteIfExists(file.source);
            Files.deleteIfExists(file.source.resolveSibling(file.source.getFileName() + ".side"));
            Files.deleteIfExists(file.source.resolveSibling(file.source.getFileName() + ".pw.toml"));
        }
        if (!found) {
            Path fallback = config.privateDir.resolve("files").resolve(wanted);
            if (Files.isRegularFile(fallback)) {
                Files.delete(fallback);
                Files.deleteIfExists(fallback.resolveSibling(fallback.getFileName() + ".side"));
                return;
            }
            throw new IllegalArgumentException("找不到私货: " + wanted);
        }
    }

    static String defaultDest(Path source) {
        String name = source.getFileName().toString();
        String lower = name.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".jar")) {
            return "mods/" + name;
        }
        if (lower.endsWith(".zip")) {
            return "resourcepacks/" + name;
        }
        if (lower.endsWith(".js")) {
            return "kubejs/server_scripts/" + name;
        }
        if (lower.endsWith(".toml") || lower.endsWith(".cfg") || lower.endsWith(".json")) {
            return "config/" + name;
        }
        return name;
    }

    static String normalizeDest(String dest, Path source) {
        String rel = dest == null || dest.isBlank() ? defaultDest(source) : Fs.posix(dest);
        if (rel.isBlank() || rel.contains("..") || Path.of(rel).isAbsolute()) {
            throw new IllegalArgumentException("无效的游戏内路径");
        }
        return rel;
    }
}
