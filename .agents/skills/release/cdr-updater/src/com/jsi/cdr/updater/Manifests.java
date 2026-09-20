package com.jsi.cdr.updater;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

final class Manifests {
    static final class FileEntry {
        final String path;
        final String sha256;
        final long size;
        final String kind;

        FileEntry(String path, String sha256, long size, String kind) {
            this.path = Fs.posix(path);
            this.sha256 = sha256;
            this.size = size;
            this.kind = kind;
        }

        Map<String, Object> toMap() {
            Map<String, Object> map = Json.map();
            map.put("path", path);
            map.put("sha256", sha256);
            map.put("size", size);
            map.put("kind", kind);
            return map;
        }

        static FileEntry from(Map<String, Object> map) {
            String path = Fs.posix(Json.str(map, "path"));
            return new FileEntry(path, Json.str(map, "sha256"), Json.lng(map, "size"),
                    Json.str(map, "kind").isBlank() ? PackPaths.kind(path) : Json.str(map, "kind"));
        }
    }

    static final class Manifest {
        final String officialVersion;
        final String side;
        final String generatedAt;
        final List<FileEntry> files;

        Manifest(String officialVersion, String side, String generatedAt, List<FileEntry> files) {
            this.officialVersion = officialVersion;
            this.side = side;
            this.generatedAt = generatedAt;
            this.files = files;
        }

        Map<String, FileEntry> byPath() {
            Map<String, FileEntry> map = new LinkedHashMap<>();
            for (FileEntry entry : files) {
                map.put(entry.path, entry);
            }
            return map;
        }

        Map<String, Object> toMap() {
            Map<String, Object> map = Json.map();
            map.put("official_version", officialVersion);
            map.put("side", side);
            map.put("generated_at", generatedAt);
            List<Object> list = Json.list();
            for (FileEntry entry : files) {
                list.add(entry.toMap());
            }
            map.put("files", list);
            return map;
        }

        String fingerprint() throws Exception {
            List<String> parts = new ArrayList<>();
            files.stream().sorted(Comparator.comparing(entry -> entry.path))
                    .forEach(entry -> parts.add(entry.path + ":" + entry.sha256));
            return Fs.sha256(String.join("\n", parts).getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }

        static Manifest from(Map<String, Object> map) {
            List<FileEntry> files = new ArrayList<>();
            for (Object item : Json.array(map.get("files"))) {
                files.add(FileEntry.from(Json.object(item)));
            }
            return new Manifest(Json.str(map, "official_version"), Json.str(map, "side"),
                    Json.str(map, "generated_at"), files);
        }
    }

    static final class Change {
        final String path;
        final String action;
        final String kind;
        final String oldSha256;
        final String newSha256;
        final Long oldSize;
        final Long newSize;

        Change(String path, String action, String kind, String oldSha256, String newSha256, Long oldSize, Long newSize) {
            this.path = path;
            this.action = action;
            this.kind = kind;
            this.oldSha256 = oldSha256;
            this.newSha256 = newSha256;
            this.oldSize = oldSize;
            this.newSize = newSize;
        }

        Map<String, Object> toMap() {
            Map<String, Object> map = Json.map();
            map.put("path", path);
            map.put("action", action);
            map.put("kind", kind);
            map.put("old_sha256", oldSha256);
            map.put("new_sha256", newSha256);
            map.put("old_size", oldSize);
            map.put("new_size", newSize);
            return map;
        }
    }

    static Manifest patch(Manifest current, String officialVersion, Map<String, FileEntry> upserts, Set<String> removes) {
        Map<String, FileEntry> map = current.byPath();
        if (removes != null) {
            for (String path : removes) {
                map.remove(Fs.posix(path));
            }
        }
        if (upserts != null) {
            map.putAll(upserts);
        }
        List<FileEntry> files = new ArrayList<>(map.values());
        files.sort(Comparator.comparing(entry -> entry.path));
        String version = officialVersion == null || officialVersion.isBlank() ? current.officialVersion : officialVersion;
        return new Manifest(version, current.side, Instant.now().toString(), files);
    }

    static Manifest build(Path root, String officialVersion, String side) throws Exception {
        List<FileEntry> files = new ArrayList<>();
        for (Path path : Fs.files(root)) {
            String rel = Fs.posix(root, path);
            if (PackPaths.skipUnified(rel) || rel.endsWith(".pw.toml")) {
                continue;
            }
            files.add(new FileEntry(rel, Fs.sha256(path), Files.size(path), PackPaths.kind(rel)));
        }
        return new Manifest(officialVersion, side, Instant.now().toString(), files);
    }

    static List<Change> diff(Map<String, FileEntry> local, Manifest remote) {
        List<Change> changes = new ArrayList<>();
        Map<String, FileEntry> remoteMap = remote.byPath();
        for (FileEntry remoteEntry : remoteMap.values()) {
            FileEntry localEntry = local.get(remoteEntry.path);
            if (localEntry == null) {
                changes.add(new Change(remoteEntry.path, "add", remoteEntry.kind, null, remoteEntry.sha256, null, remoteEntry.size));
            } else if (!localEntry.sha256.equals(remoteEntry.sha256)) {
                changes.add(new Change(remoteEntry.path, "update", remoteEntry.kind, localEntry.sha256, remoteEntry.sha256, localEntry.size, remoteEntry.size));
            }
        }
        for (FileEntry localEntry : local.values()) {
            if (!remoteMap.containsKey(localEntry.path)) {
                changes.add(new Change(localEntry.path, "remove", localEntry.kind, localEntry.sha256, null, localEntry.size, null));
            }
        }
        changes.sort(Comparator.comparing((Change change) -> change.action).thenComparing(change -> change.path));
        return changes;
    }

    static Map<String, FileEntry> localMap(List<Object> files) {
        Map<String, FileEntry> map = new LinkedHashMap<>();
        for (Object item : files) {
            FileEntry entry = FileEntry.from(Json.object(item));
            map.put(entry.path, entry);
        }
        return map;
    }
}
