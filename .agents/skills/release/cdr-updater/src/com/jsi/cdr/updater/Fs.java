package com.jsi.cdr.updater;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

final class Fs {
    private Fs() {}

    static String posix(Path root, Path file) {
        return posix(root.relativize(file).toString());
    }

    static String posix(String path) {
        String normalized = path.replace('\\', '/');
        while (normalized.startsWith("./")) {
            normalized = normalized.substring(2);
        }
        if (normalized.startsWith("/")) {
            normalized = normalized.substring(1);
        }
        return normalized;
    }

    static boolean unsafePath(String path) {
        if (path == null || path.isBlank() || path.indexOf('\0') >= 0) {
            return true;
        }
        String normalized = posix(path);
        if (normalized.isBlank()) {
            return true;
        }
        for (String part : normalized.split("/")) {
            if ("..".equals(part) || part.contains(":")) {
                return true;
            }
        }
        return false;
    }

    static String sha256Hex(String digest) {
        String hex = digest == null ? "" : digest.trim().toLowerCase(Locale.ROOT);
        if (hex.length() != 64) {
            throw new IllegalArgumentException("无效文件哈希");
        }
        for (int i = 0; i < hex.length(); i++) {
            char ch = hex.charAt(i);
            if ((ch < '0' || ch > '9') && (ch < 'a' || ch > 'f')) {
                throw new IllegalArgumentException("无效文件哈希");
            }
        }
        return hex;
    }

    static String sha256(Path path) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        try (InputStream in = Files.newInputStream(path)) {
            byte[] buffer = new byte[1024 * 1024];
            int read;
            while ((read = in.read(buffer)) >= 0) {
                digest.update(buffer, 0, read);
            }
        }
        return HexFormat.of().formatHex(digest.digest());
    }

    static String digest(Path path, String algorithm) throws Exception {
        MessageDigest digest = MessageDigest.getInstance(algorithm);
        try (InputStream in = Files.newInputStream(path)) {
            byte[] buffer = new byte[1024 * 1024];
            int read;
            while ((read = in.read(buffer)) >= 0) {
                digest.update(buffer, 0, read);
            }
        }
        return HexFormat.of().formatHex(digest.digest());
    }

    static boolean zipMagic(Path path) throws IOException {
        if (!Files.isRegularFile(path) || Files.size(path) < 4) {
            return false;
        }
        try (InputStream in = Files.newInputStream(path)) {
            byte[] header = in.readNBytes(4);
            return header.length >= 4 && header[0] == 0x50 && header[1] == 0x4b
                    && (header[2] == 0x03 || header[2] == 0x05 || header[2] == 0x07);
        }
    }

    static String sha256(byte[] data) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(data));
    }

    static List<Path> files(Path root) throws IOException {
        List<Path> files = new ArrayList<>();
        if (!Files.exists(root)) {
            return files;
        }
        Files.walkFileTree(root, new SimpleFileVisitor<>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                files.add(file);
                return FileVisitResult.CONTINUE;
            }
        });
        files.sort(Comparator.comparing(path -> posix(root, path)));
        return files;
    }

    static void deleteTree(Path root) throws IOException {
        if (!Files.exists(root)) {
            return;
        }
        Files.walkFileTree(root, new SimpleFileVisitor<>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                Files.delete(file);
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                Files.delete(dir);
                return FileVisitResult.CONTINUE;
            }
        });
    }

    static void copyFile(Path source, Path target) throws IOException {
        Files.createDirectories(target.getParent());
        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.COPY_ATTRIBUTES);
    }

    static void write(Path path, byte[] data) throws IOException {
        Files.createDirectories(path.getParent());
        Path tmp = path.resolveSibling(path.getFileName() + ".cdrtmp");
        Files.write(tmp, data);
        try {
            Files.move(tmp, path, StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (IOException ignored) {
            Files.move(tmp, path, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    static void extractZip(Path archive, Path destination) throws IOException {
        extractZip(archive, destination, null);
    }

    static void extractZip(Path archive, Path destination, java.util.function.Consumer<String> log) throws IOException {
        Path dest = destination.toAbsolutePath().normalize();
        Files.createDirectories(dest);
        long total = Files.size(archive);
        String name = archive.getFileName() == null ? "zip" : archive.getFileName().toString();
        Progress.ensure("解压 " + name, total);
        if (log != null) {
            log.accept("解压 " + name + (total > 0 ? " (" + Progress.formatSize(total) + ")" : ""));
        }
        class CountIn extends java.io.FilterInputStream {
            private long read;
            private long lastLog = System.nanoTime();

            CountIn(InputStream in) {
                super(in);
            }

            private void note(int n) {
                if (n > 0) {
                    read += n;
                    long now = System.nanoTime();
                    if (now - lastLog >= 200_000_000L) {
                        lastLog = now;
                        Progress.bytes(Math.min(read, total));
                        Progress.live();
                    }
                }
            }

            @Override
            public int read() throws IOException {
                int n = super.read();
                if (n >= 0) {
                    note(1);
                }
                return n;
            }

            @Override
            public int read(byte[] b, int off, int len) throws IOException {
                int n = super.read(b, off, len);
                note(n);
                return n;
            }
        }
        try (CountIn counted = new CountIn(Files.newInputStream(archive));
             ZipInputStream zip = new ZipInputStream(counted)) {
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                String nameEntry = entry.getName();
                if (unsafePath(nameEntry)) {
                    throw new IOException("非法压缩路径: " + nameEntry);
                }
                Path target = dest.resolve(nameEntry).normalize();
                if (!target.startsWith(dest)) {
                    throw new IOException("非法压缩路径: " + nameEntry);
                }
                if (entry.isDirectory()) {
                    Files.createDirectories(target);
                    continue;
                }
                Files.createDirectories(target.getParent());
                try (OutputStream out = Files.newOutputStream(target)) {
                    zip.transferTo(out);
                }
            }
        }
        Progress.bytes(total);
        Progress.live(true);
        Progress.finishLive();
        if (log != null) {
            log.accept("解压完成 " + name);
        }
    }

    static Path packRoot(Path extract) throws IOException {
        Path current = unwrapSingleDir(extract, 3);
        if (Files.isDirectory(current.resolve("overrides"))
                && (Files.isRegularFile(current.resolve("manifest.json"))
                || Files.isRegularFile(current.resolve("mcbbs.packmeta")))) {
            return current.resolve("overrides");
        }
        return current;
    }

    static Path unwrapSingleDir(Path extract, int depth) throws IOException {
        if (depth <= 0 || !Files.isDirectory(extract)) {
            return extract;
        }
        List<Path> meaningful = new ArrayList<>();
        try (var stream = Files.newDirectoryStream(extract)) {
            for (Path child : stream) {
                String name = child.getFileName().toString();
                if ("__MACOSX".equals(name) || ".DS_Store".equals(name) || name.startsWith(".")) {
                    continue;
                }
                meaningful.add(child);
            }
        }
        if (meaningful.size() == 1 && Files.isDirectory(meaningful.get(0))) {
            return unwrapSingleDir(meaningful.get(0), depth - 1);
        }
        return extract;
    }

    static String fileName(String path) {
        String posix = posix(path);
        int slash = posix.lastIndexOf('/');
        return slash < 0 ? posix : posix.substring(slash + 1);
    }

    static String stem(String filename) {
        String name = fileName(filename);
        int dot = name.toLowerCase(Locale.ROOT).lastIndexOf('.');
        return dot < 0 ? name : name.substring(0, dot);
    }
}
