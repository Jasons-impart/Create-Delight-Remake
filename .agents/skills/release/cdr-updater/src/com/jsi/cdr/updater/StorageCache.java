package com.jsi.cdr.updater;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/** Shared-store GC: caller holds Pack.class (also held throughout repository builds). */
final class StorageCache {
    static final long TTL = 2 * 60 * 60 * 1000L;

    private static String hash(Map<String, Object> doc) throws IOException {
        Object raw = doc.get("sha256");
        if (!(raw instanceof String value) || !value.matches("[0-9a-fA-F]{64}")) {
            throw new IOException("无效的对象哈希，停止回收");
        }
        return value.toLowerCase(Locale.ROOT);
    }

    private static long modified(Path path) throws IOException {
        return Files.getLastModifiedTime(path, LinkOption.NOFOLLOW_LINKS).toMillis();
    }

    private static List<Path> entries(Path dir) throws IOException {
        if (!Files.exists(dir, LinkOption.NOFOLLOW_LINKS)) return List.of();
        try (var stream = Files.list(dir)) { return stream.toList(); }
    }

    private static boolean regular(Path path) {
        return Files.isRegularFile(path, LinkOption.NOFOLLOW_LINKS);
    }

    static long[] collect(Pack.Config config, long now) throws Exception {
        Set<String> live = new HashSet<>();
        for (String side : List.of("client", "server")) {
            var doc = Json.object(Json.parse(Files.readString(config.manifestsDir().resolve(side + ".json"))));
            if (!(doc.get("files") instanceof List<?> rows)) throw new IOException("清单缺少 files，停止回收");
            for (Object row : rows) live.add(hash(Json.object(row)));
        }
        if (live.isEmpty()) throw new IOException("清单为空，停止回收");

        Map<String, Long> used = new HashMap<>();
        Map<String, List<Path>> metadata = new HashMap<>();
        List<Path> leftovers = new ArrayList<>();
        // Validate every manifest and pack record before planning any deletion.
        for (Path path : entries(config.dataDir.resolve("packs"))) {
            if (!regular(path)) continue;
            String name = path.getFileName().toString();
            if (name.endsWith(".json")) {
                String sha = hash(Json.object(Json.parse(Files.readString(path))));
                metadata.computeIfAbsent(sha, ignored -> new ArrayList<>()).add(path);
                used.merge(sha, modified(path), Math::max);
            } else if (name.startsWith("build-") || name.endsWith(".tmp")) {
                leftovers.add(path);
            }
        }
        for (String sha : metadata.keySet()) {
            Path object = config.objectsDir.resolve(sha.substring(0, 2)).resolve(sha);
            if (regular(object)) used.merge(sha, modified(object), Math::max);
        }
        List<Path> drops = new ArrayList<>();
        for (Path shard : entries(config.objectsDir)) {
            if (!Files.isDirectory(shard, LinkOption.NOFOLLOW_LINKS)) continue;
            for (Path object : entries(shard)) {
                String sha = object.getFileName().toString().toLowerCase(Locale.ROOT);
                if (!regular(object) || !sha.matches("[0-9a-f]{64}") || live.contains(sha)) continue;
                long lastUsed = Math.max(modified(object), used.getOrDefault(sha, 0L));
                if (now - lastUsed >= TTL) drops.add(object);
            }
        }
        for (var record : metadata.entrySet()) {
            if (now - used.get(record.getKey()) >= TTL) drops.addAll(record.getValue());
        }
        for (Path path : leftovers) if (now - modified(path) >= TTL) drops.add(path);
        long bytes = 0;
        for (Path path : drops) {
            long size = Files.size(path);
            Files.delete(path);
            bytes += size;
        }
        return new long[]{drops.size(), bytes};
    }
}
