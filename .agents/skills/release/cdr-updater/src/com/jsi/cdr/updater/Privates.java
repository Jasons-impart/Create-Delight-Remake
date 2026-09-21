package com.jsi.cdr.updater;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
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

    static Path setSide(Pack.Config config, String dest, String side) throws Exception {
        String wanted = Fs.posix(dest);
        if (wanted.isBlank() || wanted.contains("..") || Path.of(wanted).isAbsolute()) {
            throw new IllegalArgumentException("请选择要修改的私货");
        }
        Pack.PrivateFile found = null;
        for (Pack.PrivateFile file : list(config)) {
            if (wanted.equals(file.path)) {
                found = file;
                break;
            }
        }
        if (found == null) {
            throw new IllegalArgumentException("找不到私货: " + wanted);
        }
        String normalized = side == null ? "" : side.trim().toLowerCase(Locale.ROOT);
        if (!"auto".equals(normalized) && !normalized.isBlank()) {
            normalized = Sides.normalize(normalized);
        } else {
            normalized = "auto";
        }
        Path filesRoot = config.privateDir.resolve("files").toAbsolutePath().normalize();
        Path source = found.source.toAbsolutePath().normalize();
        Path target = filesRoot.resolve(wanted).normalize();
        if (!target.startsWith(filesRoot)) {
            throw new IllegalArgumentException("私货路径不能跳出 files 目录");
        }
        if (!source.equals(target)) {
            Files.createDirectories(target.getParent());
            Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
            moveSidecar(source, target, ".side");
            moveSidecar(source, target, ".pw.toml");
        }
        Path sideFile = target.resolveSibling(target.getFileName() + ".side");
        if ("auto".equals(normalized)) {
            Files.deleteIfExists(sideFile);
        } else {
            Files.writeString(sideFile, normalized);
        }
        return target;
    }

    private static void moveSidecar(Path source, Path target, String suffix) throws Exception {
        Path old = source.resolveSibling(source.getFileName() + suffix);
        Path next = target.resolveSibling(target.getFileName() + suffix);
        if (Files.isRegularFile(old)) {
            Files.createDirectories(next.getParent());
            Files.move(old, next, StandardCopyOption.REPLACE_EXISTING);
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

    static String resolveDest(String dest, String filename, int fileCount) {
        return PrivateViews.resolveDest(dest, filename, fileCount);
    }

    static String normalizeDest(String dest, Path source) {
        String rel = dest == null || dest.isBlank() ? defaultDest(source) : Fs.posix(dest);
        if (rel.isBlank() || rel.contains("..") || Path.of(rel).isAbsolute()) {
            throw new IllegalArgumentException("无效的游戏内路径");
        }
        return rel;
    }

    static String createFolder(Pack.Config config, String dest) throws Exception {
        String rel = PrivateViews.normalizeFolder(dest);
        Path filesRoot = config.privateDir.resolve("files").toAbsolutePath().normalize();
        Path target = ".".equals(rel) ? filesRoot : filesRoot.resolve(rel).normalize();
        if (!target.startsWith(filesRoot)) {
            throw new IllegalArgumentException("目录不能跳出 files");
        }
        Files.createDirectories(target);
        return ".".equals(rel) ? "./" : (rel.endsWith("/") ? rel : rel + "/");
    }
}
