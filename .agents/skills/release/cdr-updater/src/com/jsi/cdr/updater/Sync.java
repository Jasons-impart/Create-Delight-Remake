package com.jsi.cdr.updater;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;

final class Sync {
    static final class Result {
        final String officialVersion;
        final String changelogKind;
        final String changelogText;
        final boolean changed;
        final List<Map<String, String>> applied;
        final List<String> keptLocal;

        Result(String officialVersion, String changelogKind, String changelogText, boolean changed,
               List<Map<String, String>> applied, List<String> keptLocal) {
            this.officialVersion = officialVersion;
            this.changelogKind = changelogKind;
            this.changelogText = changelogText;
            this.changed = changed;
            this.applied = applied;
            this.keptLocal = keptLocal;
        }
    }

    static final class Client {
        private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(20)).build();
        private final String base;
        private final String side;
        private final String token;
        private final String instanceId;
        private final String instancePath;
        private final String hostname;

        Client(String base) {
            this(base, "client", null, "");
        }

        Client(String base, String side, Path instance) {
            this(base, side, instance, "");
        }

        Client(String base, String side, Path instance, String token) {
            this.base = base.endsWith("/") ? base : base + "/";
            this.side = side == null || side.isBlank() ? "client" : side;
            this.token = token == null ? "" : token.trim();
            if ("server".equals(this.side) && instance != null) {
                try {
                    this.instanceId = Connections.ensureInstanceId(instance);
                } catch (Exception error) {
                    throw new IllegalStateException("无法写入服务端实例 ID", error);
                }
                this.instancePath = instance.toAbsolutePath().normalize().toString();
                this.hostname = Connections.localHostname();
            } else {
                this.instanceId = "";
                this.instancePath = "";
                this.hostname = "";
            }
        }

        private void identity(HttpRequest.Builder builder) {
            builder.header("X-CDR-Side", side);
            if (!token.isBlank()) {
                builder.header("X-CDR-Token", token);
            }
            if ("server".equals(side)) {
                if (!instanceId.isBlank()) {
                    builder.header("X-CDR-Instance-Id", instanceId);
                }
                if (!instancePath.isBlank()) {
                    builder.header("X-CDR-Instance-Path", Connections.encodePath(instancePath));
                }
                if (!hostname.isBlank()) {
                    builder.header("X-CDR-Hostname", hostname);
                }
            }
        }

        Map<String, Object> json(String method, String path, Object payload) throws Exception {
            HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(base + path))
                    .header("Accept", "application/json")
                    .header("User-Agent", "cdr-updater-client");
            identity(builder);
            if (payload == null) {
                builder.method(method, HttpRequest.BodyPublishers.noBody());
            } else {
                builder.header("Content-Type", "application/json")
                        .method(method, HttpRequest.BodyPublishers.ofString(Json.stringify(payload), StandardCharsets.UTF_8));
            }
            HttpResponse<String> response = http.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new IllegalStateException("更新服务器返回 " + response.statusCode() + ": " + response.body());
            }
            return Json.object(Json.parse(response.body()));
        }

        byte[] download(String sha256) throws Exception {
            String digest = Fs.sha256Hex(sha256);
            HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(base + "api/file/" + digest))
                    .header("User-Agent", "cdr-updater-client");
            identity(builder);
            HttpRequest request = builder.build();
            HttpResponse<byte[]> response = http.send(request, HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() >= 400) {
                throw new IllegalStateException("下载失败 " + response.statusCode());
            }
            return response.body();
        }
    }

    static Map<String, Object> loadState(Path instanceDir) throws Exception {
        Path statePath = instanceDir.resolve("cdr-updater-state.json");
        if (!Files.isRegularFile(statePath)) {
            return Json.map();
        }
        return Json.object(Json.parse(Files.readString(statePath)));
    }

    static List<Object> scan(Path instanceDir, List<Object> remoteFiles, List<String> managedPaths) throws Exception {
        List<Object> local = Json.list();
        java.util.LinkedHashSet<String> seen = new java.util.LinkedHashSet<>();
        List<String> candidates = new ArrayList<>();
        for (Object item : remoteFiles) {
            candidates.add(Json.str(Json.object(item), "path"));
        }
        candidates.addAll(managedPaths);
        for (String relRaw : candidates) {
            String rel = Fs.posix(relRaw);
            if (!seen.add(rel)) {
                continue;
            }
            Path path = instanceDir.resolve(rel);
            if (!Files.isRegularFile(path)) {
                continue;
            }
            Map<String, Object> row = Json.map();
            row.put("path", rel);
            row.put("sha256", Fs.sha256(path));
            row.put("size", Files.size(path));
            local.add(row);
        }
        return local;
    }

    static Result apply(Path instanceDir, String side, Client client, Consumer<String> progress) throws Exception {
        Files.createDirectories(instanceDir);
        Map<String, Object> state = loadState(instanceDir);
        String previousVersion = Json.str(state, "official_version");
        List<String> managedPaths = new ArrayList<>();
        for (Object item : Json.array(state.get("managed_paths"))) {
            managedPaths.add(Fs.posix(String.valueOf(item)));
        }
        Map<String, String> syncedHashes = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : Json.object(state.get("synced_hashes")).entrySet()) {
            syncedHashes.put(Fs.posix(entry.getKey()), String.valueOf(entry.getValue()));
        }
        progress.accept("正在拉取远程清单");
        Map<String, Object> remote = client.json("GET", "api/manifest?side=" + side, null);
        List<Object> remoteFiles = Json.array(remote.get("files"));
        List<Object> localFiles = scan(instanceDir, remoteFiles, managedPaths);
        Map<String, Map<String, Object>> localByPath = new LinkedHashMap<>();
        for (Object item : localFiles) {
            Map<String, Object> row = Json.object(item);
            localByPath.put(Json.str(row, "path"), row);
        }
        progress.accept("正在比对文件哈希");
        Map<String, Object> request = Json.map();
        request.put("side", side);
        request.put("files", localFiles);
        request.put("previous_version", previousVersion);
        request.put("managed_paths", managedPaths);
        request.put("synced_hashes", syncedHashes);
        Map<String, Object> diff = client.json("POST", "api/diff", request);
        List<Map<String, String>> applied = new ArrayList<>();
        for (Object item : Json.array(diff.get("download"))) {
            Map<String, Object> row = Json.object(item);
            String rel = Fs.posix(Json.str(row, "path"));
            if (Fs.unsafePath(rel)) {
                progress.accept("忽略非法路径 " + rel);
                continue;
            }
            Map<String, Object> local = localByPath.get(rel);
            String localSha = local == null ? null : Json.str(local, "sha256");
            if (!Policy.shouldOverwriteLocal(rel, side, localSha, Json.str(row, "sha256"), syncedHashes)) {
                progress.accept(("server".equals(side) ? "保留管理员改动 " : "保留本地文件 ") + rel);
                continue;
            }
            progress.accept("下载 " + rel);
            byte[] payload = client.download(Json.str(row, "sha256"));
            Fs.write(instanceDir.resolve(rel), payload);
            syncedHashes.put(rel, Json.str(row, "sha256"));
            applied.add(Map.of("path", rel, "action", "write"));
        }
        Set<String> managed = Set.copyOf(managedPaths);
        for (Object item : Json.array(diff.get("changes"))) {
            Map<String, Object> change = Json.object(item);
            if (!"remove".equals(Json.str(change, "action"))) {
                continue;
            }
            String rel = Fs.posix(Json.str(change, "path"));
            if (Fs.unsafePath(rel) || !Policy.shouldDeleteLocal(rel, managed)) {
                progress.accept("保留未纳入更新清单的本地文件 " + rel);
                continue;
            }
            Path target = instanceDir.resolve(rel);
            if (Files.isRegularFile(target)) {
                progress.accept("更新器服务器已删除，正在移除 " + rel);
                Files.delete(target);
                applied.add(Map.of("path", rel, "action", "delete"));
            }
            syncedHashes.remove(rel);
        }
        List<String> remotePaths = new ArrayList<>();
        Map<String, String> remoteHashes = new LinkedHashMap<>();
        for (Object item : remoteFiles) {
            Map<String, Object> row = Json.object(item);
            String rel = Fs.posix(Json.str(row, "path"));
            remotePaths.add(rel);
            remoteHashes.put(rel, Json.str(row, "sha256"));
        }
        java.util.Set<String> remotePathSet = Set.copyOf(remotePaths);
        syncedHashes.entrySet().removeIf(entry -> !remotePathSet.contains(entry.getKey()));
        for (Map.Entry<String, String> entry : remoteHashes.entrySet()) {
            Map<String, Object> local = localByPath.get(entry.getKey());
            if (local != null && entry.getValue().equals(Json.str(local, "sha256"))) {
                syncedHashes.put(entry.getKey(), entry.getValue());
            }
        }
        List<String> keptLocal = new ArrayList<>();
        for (Object item : Json.array(diff.get("kept_local"))) {
            keptLocal.add(Fs.posix(String.valueOf(item)));
        }
        Map<String, Object> changelog = Json.object(diff.get("changelog"));
        String text = Json.str(changelog, "text");
        if (!keptLocal.isEmpty()) {
            StringBuilder extra = new StringBuilder(text).append("\n\n【保留的本地改动】\n");
            for (String path : keptLocal) {
                extra.append("- 保留本地改动 ").append(path).append('\n');
            }
            text = extra.toString().trim();
        }
        Map<String, Object> next = Json.map();
        next.put("official_version", diff.get("official_version"));
        next.put("side", side);
        next.put("managed_paths", remotePaths);
        next.put("synced_hashes", syncedHashes);
        next.put("last_changelog", changelog);
        next.put("kept_local", keptLocal);
        String instanceId = Json.str(state, "instance_id");
        if ("server".equals(side)) {
            if (instanceId.isBlank()) {
                instanceId = Connections.ensureInstanceId(instanceDir);
            }
            next.put("instance_id", instanceId);
        } else if (!instanceId.isBlank()) {
            next.put("instance_id", instanceId);
        }
        Files.writeString(instanceDir.resolve("cdr-updater-state.json"), Json.stringify(next));
        return new Result(Json.str(diff, "official_version"), Json.str(changelog, "kind"), text, !applied.isEmpty(), applied, keptLocal);
    }

    static final class Check {
        final boolean needed;
        final boolean modsChanged;
        final String changelogText;
        final String officialVersion;

        Check(boolean needed, boolean modsChanged, String changelogText, String officialVersion) {
            this.needed = needed;
            this.modsChanged = modsChanged;
            this.changelogText = changelogText;
            this.officialVersion = officialVersion;
        }
    }

    static Check inspect(Path instanceDir, String side, Client client) throws Exception {
        Map<String, Object> state = loadState(instanceDir);
        List<String> managedPaths = new ArrayList<>();
        for (Object item : Json.array(state.get("managed_paths"))) {
            managedPaths.add(Fs.posix(String.valueOf(item)));
        }
        Map<String, String> syncedHashes = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : Json.object(state.get("synced_hashes")).entrySet()) {
            syncedHashes.put(Fs.posix(entry.getKey()), String.valueOf(entry.getValue()));
        }
        Map<String, Object> remote = client.json("GET", "api/manifest?side=" + side, null);
        List<Object> localFiles = scan(instanceDir, Json.array(remote.get("files")), managedPaths);
        Map<String, Object> request = Json.map();
        request.put("side", side);
        request.put("files", localFiles);
        request.put("previous_version", Json.str(state, "official_version"));
        request.put("managed_paths", managedPaths);
        request.put("synced_hashes", syncedHashes);
        Map<String, Object> diff = client.json("POST", "api/diff", request);
        boolean needed = false;
        boolean modsChanged = false;
        Map<String, Map<String, Object>> localByPath = new LinkedHashMap<>();
        for (Object item : localFiles) {
            Map<String, Object> row = Json.object(item);
            localByPath.put(Json.str(row, "path"), row);
        }
        for (Object item : Json.array(diff.get("download"))) {
            Map<String, Object> row = Json.object(item);
            String rel = Fs.posix(Json.str(row, "path"));
            Map<String, Object> local = localByPath.get(rel);
            String localSha = local == null ? null : Json.str(local, "sha256");
            if (Policy.shouldOverwriteLocal(rel, side, localSha, Json.str(row, "sha256"), syncedHashes)) {
                needed = true;
                if (PackPaths.isModPayload(rel)) {
                    modsChanged = true;
                }
            }
        }
        Set<String> managed = Set.copyOf(managedPaths);
        for (Object item : Json.array(diff.get("changes"))) {
            Map<String, Object> change = Json.object(item);
            if (!"remove".equals(Json.str(change, "action"))) {
                continue;
            }
            String rel = Fs.posix(Json.str(change, "path"));
            if (Policy.shouldDeleteLocal(rel, managed)) {
                needed = true;
                if (PackPaths.isModPayload(rel)) {
                    modsChanged = true;
                }
            }
        }
        Map<String, Object> changelog = Json.object(diff.get("changelog"));
        return new Check(needed, modsChanged, Json.str(changelog, "text"), Json.str(diff, "official_version"));
    }
}
