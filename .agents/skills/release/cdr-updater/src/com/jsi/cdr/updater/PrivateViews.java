package com.jsi.cdr.updater;

import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

final class PrivateViews {
    static final List<String> DEST_FOLDERS = List.of(
            "./",
            "mods/",
            "config/",
            "kubejs/",
            "kubejs/config/",
            "kubejs/server_scripts/",
            "kubejs/client_scripts/",
            "kubejs/startup_scripts/",
            "resourcepacks/",
            "shaderpacks/",
            "defaultconfigs/",
            "libraries/"
    );

    private PrivateViews() {}

    static String folderOf(String path) {
        String rel = Fs.posix(path == null ? "" : path);
        int slash = rel.lastIndexOf('/');
        if (slash <= 0) {
            return ".";
        }
        return rel.substring(0, slash);
    }

    static String resolveDest(String dest, String filename, int fileCount) {
        String name = filename == null || filename.isBlank()
                ? "upload.bin"
                : Path.of(filename).getFileName().toString();
        String raw = dest == null ? "" : dest.trim();
        if (isRootFolder(raw)) {
            return name;
        }
        String path = Fs.posix(raw);
        while (path.startsWith("/")) {
            path = path.substring(1);
        }
        if (path.isBlank()) {
            return fileCount > 1 ? folderOf(Privates.defaultDest(Path.of(name))) + "/" + name
                    : Privates.defaultDest(Path.of(name));
        }
        boolean folder = fileCount > 1 || raw.replace('\\', '/').endsWith("/") || path.endsWith("/");
        if (folder) {
            while (path.endsWith("/")) {
                path = path.substring(0, path.length() - 1);
            }
            while (path.startsWith("./")) {
                path = path.substring(2);
            }
            if (".".equals(path)) {
                path = "";
            }
            if (fileCount > 1 && looksLikeFile(path)) {
                path = folderOf(path);
                if (".".equals(path)) {
                    path = "";
                }
            }
            return path.isBlank() ? name : path + "/" + name;
        }
        return path;
    }

    static boolean isRootFolder(String dest) {
        if (dest == null) {
            return false;
        }
        String path = dest.trim().replace('\\', '/');
        if (path.isEmpty()) {
            return false;
        }
        if ("根目录".equals(path)) {
            return true;
        }
        while (path.startsWith("/")) {
            path = path.substring(1);
        }
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }
        while (path.startsWith("./")) {
            path = path.substring(2);
        }
        return path.isEmpty() || ".".equals(path);
    }

    static String folderLabel(String folder) {
        if (folder == null || folder.isBlank()) {
            return "";
        }
        if (isRootFolder(folder) || ".".equals(folder.trim())) {
            return "根目录";
        }
        return folder.endsWith("/") ? folder : folder + "/";
    }

    static String destFolderValue(String folder) {
        if (folder == null || folder.isBlank()) {
            return "";
        }
        if (isRootFolder(folder)) {
            return "./";
        }
        String path = folder.trim().replace('\\', '/');
        if (!path.endsWith("/")) {
            path += "/";
        }
        path = Fs.posix(path);
        if (path.isBlank() || isRootFolder(path)) {
            return "./";
        }
        return path.endsWith("/") ? path : path + "/";
    }

    static List<String> destFolders(List<Pack.PrivateFile> files) {
        return destFolders(null, files);
    }

    static List<String> destFolders(Path privateDir, List<Pack.PrivateFile> files) {
        Set<String> folders = new LinkedHashSet<>(DEST_FOLDERS);
        if (files != null) {
            for (Pack.PrivateFile file : files) {
                addFolder(folders, folderOf(file.path));
            }
        }
        Path filesRoot = privateDir == null ? null : privateDir.resolve("files");
        if (filesRoot != null && Files.isDirectory(filesRoot)) {
            try {
                Files.walkFileTree(filesRoot, new SimpleFileVisitor<>() {
                    @Override
                    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                        if (filesRoot.equals(dir)) {
                            return FileVisitResult.CONTINUE;
                        }
                        String rel = Fs.posix(filesRoot, dir);
                        String[] prefixed = Sides.splitPrivatePrefix(rel);
                        String path = prefixed[0] == null ? rel : prefixed[1];
                        addFolder(folders, path);
                        return FileVisitResult.CONTINUE;
                    }
                });
            } catch (Exception ignored) {
                // keep default folders
            }
        }
        List<String> list = new ArrayList<>(folders);
        list.sort(Comparator.naturalOrder());
        if (list.remove("./")) {
            list.add(0, "./");
        }
        return list;
    }

    static String normalizeFolder(String dest) {
        String path = dest == null ? "" : dest.trim();
        if ("根目录".equals(path) || isRootFolder(path)) {
            return ".";
        }
        path = Fs.posix(path);
        while (path.startsWith("/")) {
            path = path.substring(1);
        }
        while (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }
        if (path.isBlank() || path.contains("..") || Path.of(path).isAbsolute()) {
            throw new IllegalArgumentException("无效的目录");
        }
        String[] prefixed = Sides.splitPrivatePrefix(path);
        if (prefixed[0] != null) {
            path = prefixed[1] == null ? "" : prefixed[1];
        }
        if (path.isBlank() || ".".equals(path)) {
            throw new IllegalArgumentException("无效的目录");
        }
        return path;
    }

    private static void addFolder(Set<String> folders, String folder) {
        if (folder == null || folder.isBlank()) {
            return;
        }
        if (isRootFolder(folder) || ".".equals(folder.trim())) {
            folders.add("./");
            return;
        }
        folders.add(folder.endsWith("/") ? folder : folder + "/");
    }

    static boolean matches(Pack.PrivateFile file, String query) {
        if (query == null || query.isBlank()) {
            return true;
        }
        String needle = query.trim().toLowerCase(Locale.ROOT);
        String path = file.path == null ? "" : file.path.toLowerCase(Locale.ROOT);
        String side = sideLabel(file.side).toLowerCase(Locale.ROOT);
        String source = file.source == null ? "" : file.source.toString().toLowerCase(Locale.ROOT);
        return path.contains(needle) || side.contains(needle) || source.contains(needle)
                || folderOf(file.path).toLowerCase(Locale.ROOT).contains(needle);
    }

    static List<Row> grouped(List<Pack.PrivateFile> files, String query) {
        List<Pack.PrivateFile> matched = new ArrayList<>();
        if (files != null) {
            for (Pack.PrivateFile file : files) {
                if (matches(file, query)) {
                    matched.add(file);
                }
            }
        }
        matched.sort(Comparator.comparing((Pack.PrivateFile file) -> folderOf(file.path))
                .thenComparing(file -> file.path));
        List<Row> rows = new ArrayList<>();
        String current = null;
        int count = 0;
        int groupIndex = -1;
        for (Pack.PrivateFile file : matched) {
            String folder = folderOf(file.path);
            if (!folder.equals(current)) {
                current = folder;
                groupIndex = rows.size();
                count = 0;
                rows.add(new Row(true, folder, 0, null));
            }
            count++;
            rows.set(groupIndex, new Row(true, folder, count, null));
            rows.add(new Row(false, folder, 0, file));
        }
        return rows;
    }

    static String sideLabel(String side) {
        return switch (side == null ? "" : side) {
            case "client" -> "仅客户端";
            case "server" -> "仅服务端";
            case "auto" -> "自动判定";
            default -> "两端";
        };
    }

    static String groupLabel(String folder, int count) {
        String name = folder == null || folder.isBlank() || ".".equals(folder) ? "根目录" : folder + "/";
        return name + "  (" + count + ")";
    }

    private static boolean looksLikeFile(String path) {
        int slash = path.lastIndexOf('/');
        String name = slash < 0 ? path : path.substring(slash + 1);
        return name.contains(".");
    }

    static final class Row {
        final boolean group;
        final String folder;
        final int count;
        final Pack.PrivateFile file;

        Row(boolean group, String folder, int count, Pack.PrivateFile file) {
            this.group = group;
            this.folder = folder;
            this.count = count;
            this.file = file;
        }
    }
}
