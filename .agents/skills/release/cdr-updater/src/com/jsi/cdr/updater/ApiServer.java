package com.jsi.cdr.updater;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Executors;

final class ApiServer {
    static HttpServer start(Pack.Config config) throws Exception {
        return start(new ServerRuntime(null, config));
    }

    static HttpServer start(ServerRuntime runtime) throws Exception {
        Pack.Config config = runtime.config();
        HttpServer server = HttpServer.create(new InetSocketAddress(config.listen, config.port), 0);
        server.createContext("/api/status", exchange -> {
            if (!allow(exchange, runtime.config(), "GET")) {
                return;
            }
            handle(exchange, () -> status(runtime.config()));
        });
        server.createContext("/api/manifest", exchange -> {
            if (!allow(exchange, runtime.config(), "GET")) {
                return;
            }
            handle(exchange, () -> manifest(runtime.config(), query(exchange, "side")));
        });
        server.createContext("/api/diff", exchange -> {
            if (!allow(exchange, runtime.config(), "POST")) {
                return;
            }
            handle(exchange, () -> diff(runtime, exchange, readBody(exchange)));
        });
        server.createContext("/api/file/", exchange -> file(runtime.config(), exchange));
        server.createContext("/admin", exchange -> AdminWeb.handle(runtime, exchange));
        server.setExecutor(Executors.newCachedThreadPool(runnable -> {
            Thread thread = new Thread(runnable, "cdr-update-http");
            thread.setDaemon(true);
            return thread;
        }));
        server.start();
        runtime.http = server;
        return server;
    }

    private interface Action {
        Object run() throws Exception;
    }

    private static void handle(HttpExchange exchange, Action action) {
        try {
            Object result = action.run();
            byte[] body = Json.stringify(result).getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(200, body.length);
            exchange.getResponseBody().write(body);
        } catch (IllegalArgumentException error) {
            sendError(exchange, 400, error.getMessage());
        } catch (IllegalStateException error) {
            sendError(exchange, 409, error.getMessage());
        } catch (Exception error) {
            System.err.println("[CDR Updater] HTTP 500: " + error.getMessage());
            sendError(exchange, 500, "服务器内部错误");
        } finally {
            exchange.close();
        }
    }

    private static boolean allow(HttpExchange exchange, Pack.Config config, String... methods) {
        try {
            String method = exchange.getRequestMethod() == null ? "" : exchange.getRequestMethod().toUpperCase();
            boolean ok = false;
            for (String allowed : methods) {
                if (allowed.equals(method)) {
                    ok = true;
                    break;
                }
            }
            if (!ok) {
                sendError(exchange, 405, "方法不允许");
                exchange.close();
                return false;
            }
            if (!tokenOk(config, exchange)) {
                sendError(exchange, 401, "需要访问令牌");
                exchange.close();
                return false;
            }
            return true;
        } catch (Exception error) {
            sendError(exchange, 500, "服务器内部错误");
            exchange.close();
            return false;
        }
    }

    static boolean tokenOk(Pack.Config config, HttpExchange exchange) {
        String expected = config.accessToken;
        if (expected == null || expected.isBlank()) {
            return true;
        }
        String provided = header(exchange, "X-CDR-Token");
        if (provided.isBlank()) {
            String auth = header(exchange, "Authorization");
            if (auth.regionMatches(true, 0, "Bearer ", 0, 7)) {
                provided = auth.substring(7).trim();
            }
        }
        return java.security.MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                provided.getBytes(StandardCharsets.UTF_8));
    }

    private static String header(HttpExchange exchange, String name) {
        java.util.List<String> values = exchange.getRequestHeaders().get(name);
        if (values == null || values.isEmpty() || values.get(0) == null) {
            return "";
        }
        return values.get(0).trim();
    }

    private static void sendError(HttpExchange exchange, int code, String message) {
        try {
            Map<String, Object> body = Json.map();
            body.put("detail", message == null ? "error" : message);
            byte[] bytes = Json.stringify(body).getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            exchange.sendResponseHeaders(code, bytes.length);
            exchange.getResponseBody().write(bytes);
        } catch (Exception ignored) {
            // ignore
        }
    }

    private static Map<String, Object> status(Pack.Config config) throws Exception {
        Map<String, Object> meta = Pack.loadMeta(config);
        if (meta.isEmpty()) {
            throw new IllegalStateException("更新仓库尚未构建");
        }
        Map<String, Object> result = Json.map();
        result.put("official_version", meta.get("official_version"));
        result.put("client_fingerprint", meta.get("client_fingerprint"));
        result.put("server_fingerprint", meta.get("server_fingerprint"));
        return result;
    }

    private static Map<String, Object> manifest(Pack.Config config, String side) throws Exception {
        side = requireSide(side);
        return Pack.loadManifest(config, side).toMap();
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> diff(ServerRuntime runtime, HttpExchange exchange, String raw) throws Exception {
        Pack.Config config = runtime.config();
        Map<String, Object> request = Json.object(Json.parse(raw.isBlank() ? "{}" : raw));
        String side = requireSide(Json.str(request, "side"));
        recordServer(runtime, exchange, side);
        Manifests.Manifest remote = Pack.loadManifest(config, side);
        List<Object> localFiles = Json.array(request.get("files"));
        Map<String, Manifests.FileEntry> localMap = Manifests.localMap(localFiles);
        Set<String> managed = new java.util.LinkedHashSet<>();
        for (Object item : Json.array(request.get("managed_paths"))) {
            managed.add(Fs.posix(String.valueOf(item)));
        }
        Map<String, String> synced = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : Json.object(request.get("synced_hashes")).entrySet()) {
            synced.put(Fs.posix(entry.getKey()), String.valueOf(entry.getValue()));
        }
        List<Manifests.Change> changes = new ArrayList<>();
        List<Object> kept = Json.list();
        for (Manifests.Change change : Manifests.diff(localMap, remote)) {
            if ("remove".equals(change.action) && !Policy.shouldDeleteLocal(change.path, managed)) {
                continue;
            }
            if ("update".equals(change.action)) {
                Manifests.FileEntry local = localMap.get(change.path);
                String localSha = local == null ? null : local.sha256;
                if (!Policy.shouldOverwriteLocal(change.path, side, localSha, change.newSha256, synced)) {
                    kept.add(change.path);
                    continue;
                }
            }
            changes.add(change);
        }
        Map<String, Object> meta = Pack.loadMeta(config);
        Map<String, Object> changelog = Changelog.build(
                changes,
                Json.str(request, "previous_version"),
                Json.str(meta, "official_version"),
                Json.str(meta, "release_body")
        );
        List<Object> download = Json.list();
        for (Manifests.Change change : changes) {
            if (("add".equals(change.action) || "update".equals(change.action)) && change.newSha256 != null) {
                Map<String, Object> item = Json.map();
                item.put("path", change.path);
                item.put("sha256", change.newSha256);
                item.put("size", change.newSize);
                download.add(item);
            }
        }
        Map<String, Object> result = Json.map();
        result.put("official_version", remote.officialVersion);
        result.put("side", remote.side);
        List<Object> changeMaps = Json.list();
        for (Manifests.Change change : changes) {
            changeMaps.add(change.toMap());
        }
        result.put("changes", changeMaps);
        result.put("changelog", changelog);
        result.put("download", download);
        result.put("kept_local", kept);
        return result;
    }

    private static void file(Pack.Config config, HttpExchange exchange) {
        try {
            if (!allow(exchange, config, "GET")) {
                return;
            }
            String path = exchange.getRequestURI().getPath();
            String digest = path.substring("/api/file/".length());
            Path object = Pack.objectPath(config, digest);
            if (!Files.isRegularFile(object)) {
                sendError(exchange, 404, "文件对象不存在");
                return;
            }
            long size = Files.size(object);
            exchange.getResponseHeaders().set("Content-Type", "application/octet-stream");
            exchange.sendResponseHeaders(200, size);
            try (java.io.InputStream in = Files.newInputStream(object)) {
                in.transferTo(exchange.getResponseBody());
            }
        } catch (IllegalArgumentException error) {
            sendError(exchange, 400, error.getMessage());
        } catch (Exception error) {
            System.err.println("[CDR Updater] 文件接口失败: " + error.getMessage());
            sendError(exchange, 500, "服务器内部错误");
        } finally {
            exchange.close();
        }
    }

    private static String requireSide(String side) {
        if (!"client".equals(side) && !"server".equals(side)) {
            throw new IllegalArgumentException("side 只能是 client 或 server");
        }
        return side;
    }

    private static void recordServer(ServerRuntime runtime, HttpExchange exchange, String side) {
        try {
            if (Connections.isServerRequest(exchange, side)) {
                Connections.noteServer(runtime.config(), exchange);
            }
        } catch (Exception ignored) {
            // 连接记录失败不影响同步
        }
    }

    private static String query(HttpExchange exchange, String key) {
        String raw = exchange.getRequestURI().getRawQuery();
        if (raw == null) {
            return "";
        }
        for (String part : raw.split("&")) {
            String[] pair = part.split("=", 2);
            if (pair.length == 2 && key.equals(pair[0])) {
                return java.net.URLDecoder.decode(pair[1], StandardCharsets.UTF_8);
            }
        }
        return "";
    }

    private static final int MAX_BODY = 32 * 1024 * 1024;

    private static String readBody(HttpExchange exchange) throws Exception {
        try (InputStream in = exchange.getRequestBody()) {
            byte[] data = in.readNBytes(MAX_BODY + 1);
            if (data.length > MAX_BODY) {
                throw new IllegalArgumentException("请求过大");
            }
            return new String(data, StandardCharsets.UTF_8);
        }
    }
}
