package com.jsi.cdr.updater;

import com.sun.net.httpserver.HttpExchange;

import java.io.InputStream;
import java.net.InetAddress;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

final class AdminWeb {
    private static final String COOKIE = "cdr_admin";
    private static final String LOCAL_SESSION = "local";
    private static final int JSON_MAX = 32 * 1024 * 1024;
    private static final int UPLOAD_MAX = 80 * 1024 * 1024;
    private static volatile byte[] pageBytes;

    private AdminWeb() {}

    static void handle(ServerRuntime runtime, HttpExchange exchange) {
        try {
            String path = exchange.getRequestURI().getPath();
            if (path == null) {
                path = "";
            }
            if ("/admin".equals(path) || "/admin/".equals(path) || "/admin/index.html".equals(path)) {
                if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())
                        && !"HEAD".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendError(exchange, 405, "方法不允许");
                    return;
                }
                servePage(exchange);
                return;
            }
            if (!path.startsWith("/admin/api/")) {
                sendError(exchange, 404, "页面不存在");
                return;
            }
            String action = path.substring("/admin/api/".length());
            if (action.endsWith("/")) {
                action = action.substring(0, action.length() - 1);
            }
            if ("login".equals(action)) {
                if (!method(exchange, "POST")) {
                    return;
                }
                login(runtime, exchange);
                return;
            }
            if ("logout".equals(action)) {
                if (!method(exchange, "POST")) {
                    return;
                }
                clearCookie(exchange);
                sendJson(exchange, 200, Json.map("ok", true));
                return;
            }
            if (!authed(runtime.config(), exchange)) {
                sendError(exchange, 401, "请先登录管理网页");
                return;
            }
            switch (action) {
                case "state" -> {
                    if (!method(exchange, "GET")) {
                        return;
                    }
                    sendJson(exchange, 200, state(runtime));
                }
                case "rebuild" -> {
                    if (!method(exchange, "POST")) {
                        return;
                    }
                    requireIdle(runtime);
                    runtime.rebuild(runtime.logger());
                    sendJson(exchange, 200, Json.map("ok", true));
                }
                case "tags" -> {
                    if (!method(exchange, "GET")) {
                        return;
                    }
                    List<Object> tags = Json.list();
                    tags.addAll(Pack.listReleaseTags(runtime.config()));
                    Map<String, Object> result = Json.map();
                    result.put("tags", tags);
                    result.put("current", runtime.config().officialVersion);
                    sendJson(exchange, 200, result);
                }
                case "version" -> {
                    if (!method(exchange, "POST")) {
                        return;
                    }
                    requireIdle(runtime);
                    Map<String, Object> body = readJson(exchange);
                    runtime.setOfficialVersion(Json.str(body, "tag"), runtime.logger());
                    sendJson(exchange, 200, Json.map("ok", true, "official_version", runtime.config().officialVersion));
                }
                case "connection" -> {
                    if (!method(exchange, "POST")) {
                        return;
                    }
                    requireIdle(runtime);
                    Map<String, Object> body = readJson(exchange);
                    String listen = Json.str(body, "listen");
                    int port = (int) Json.lng(body, "port");
                    if (port <= 0) {
                        port = boundPort(runtime);
                    }
                    String publicUrl = Json.str(body, "public_url");
                    String token = body.containsKey("access_token") ? Json.str(body, "access_token") : runtime.config().accessToken;
                    runtime.setConnection(listen, port, publicUrl, token, runtime.config().adminToken, runtime.logger());
                    Map<String, Object> result = Json.map("ok", true);
                    result.put("listen", runtime.config().listen);
                    result.put("port", runtime.config().port);
                    result.put("public_url", runtime.config().updateServerUrl);
                    result.put("access_token", runtime.config().accessToken);
                    result.put("token_enabled", !runtime.config().adminToken.isBlank());
                    sendJson(exchange, 200, result);
                }
                case "detect-wan" -> {
                    if (!method(exchange, "POST")) {
                        return;
                    }
                    Wan.Report report = Wan.discover(runtime.config().port, runtime.logger());
                    sendJson(exchange, 200, wanMap(report));
                }
                case "open-wan" -> {
                    if (!method(exchange, "POST")) {
                        return;
                    }
                    requireIdle(runtime);
                    runtime.enableWan(runtime.logger());
                    Map<String, Object> result = Json.map("ok", true);
                    result.put("listen", runtime.config().listen);
                    result.put("port", runtime.config().port);
                    result.put("public_url", runtime.config().updateServerUrl);
                    sendJson(exchange, 200, result);
                }
                case "private" -> {
                    if (!method(exchange, "POST")) {
                        return;
                    }
                    requireIdle(runtime);
                    addPrivate(runtime, exchange);
                    sendJson(exchange, 200, Json.map("ok", true));
                }
                case "private/remove" -> {
                    if (!method(exchange, "POST")) {
                        return;
                    }
                    requireIdle(runtime);
                    Map<String, Object> body = readJson(exchange);
                    runtime.removePrivate(Json.str(body, "path"), runtime.logger());
                    sendJson(exchange, 200, Json.map("ok", true));
                }
                default -> sendError(exchange, 404, "接口不存在");
            }
        } catch (IllegalArgumentException error) {
            sendError(exchange, 400, error.getMessage());
        } catch (IllegalStateException error) {
            sendError(exchange, 409, error.getMessage());
        } catch (Exception error) {
            System.err.println("[CDR Updater] 管理网页失败: " + error.getMessage());
            sendError(exchange, 500, "服务器内部错误");
        } finally {
            exchange.close();
        }
    }

    private static void servePage(HttpExchange exchange) throws Exception {
        byte[] page = page();
        exchange.getResponseHeaders().set("Content-Type", "text/html; charset=utf-8");
        exchange.getResponseHeaders().set("Cache-Control", "no-store");
        exchange.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
        exchange.getResponseHeaders().set("Content-Security-Policy",
                "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'");
        if ("HEAD".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(200, -1);
            return;
        }
        exchange.sendResponseHeaders(200, page.length);
        exchange.getResponseBody().write(page);
    }

    private static byte[] page() throws Exception {
        byte[] cached = pageBytes;
        if (cached != null) {
            return cached;
        }
        try (InputStream in = AdminWeb.class.getResourceAsStream("/web/admin.html")) {
            if (in == null) {
                throw new IllegalStateException("缺少管理网页资源");
            }
            cached = in.readAllBytes();
        }
        pageBytes = cached;
        return cached;
    }

    private static void login(ServerRuntime runtime, HttpExchange exchange) throws Exception {
        Pack.Config config = runtime.config();
        Map<String, Object> body = readJson(exchange);
        String provided = Json.str(body, "token");
        String expected = config.adminToken == null ? "" : config.adminToken;
        if (expected.isBlank()) {
            if (!loopback(exchange)) {
                throw new IllegalArgumentException("尚未设置网页管理令牌，远程不能打开管理网页。请先在本机窗口「网页管理」里设置。");
            }
            setCookie(exchange, LOCAL_SESSION);
            sendJson(exchange, 200, Json.map("ok", true, "local", true));
            return;
        }
        if (!config.accessToken.isBlank() && tokenEquals(config.accessToken, provided) && !tokenEquals(expected, provided)) {
            throw new IllegalArgumentException("这是客户端同步令牌。网页请用本机窗口「网页管理」里的令牌。");
        }
        if (!tokenEquals(expected, provided)) {
            throw new IllegalArgumentException("网页管理令牌不正确");
        }
        setCookie(exchange, expected);
        sendJson(exchange, 200, Json.map("ok", true, "local", false));
    }

    static boolean authed(Pack.Config config, HttpExchange exchange) {
        String expected = config.adminToken == null ? "" : config.adminToken;
        String provided = providedToken(exchange);
        if (expected.isBlank()) {
            return loopback(exchange) && (provided.isBlank() || LOCAL_SESSION.equals(provided));
        }
        return tokenEquals(expected, provided);
    }

    private static String providedToken(HttpExchange exchange) {
        String header = header(exchange, "X-CDR-Admin-Token");
        if (!header.isBlank()) {
            return header;
        }
        return cookie(exchange, COOKIE);
    }

    private static boolean tokenEquals(String expected, String provided) {
        if (expected == null || provided == null) {
            return false;
        }
        return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), provided.getBytes(StandardCharsets.UTF_8));
    }

    private static boolean loopback(HttpExchange exchange) {
        InetAddress address = exchange.getRemoteAddress() == null ? null : exchange.getRemoteAddress().getAddress();
        return address != null && address.isLoopbackAddress();
    }

    private static int boundPort(ServerRuntime runtime) {
        if (runtime.http != null) {
            int bound = runtime.http.getAddress().getPort();
            if (bound > 0) {
                return bound;
            }
        }
        return runtime.config().port;
    }

    private static void requireIdle(ServerRuntime runtime) {
        if (runtime.busy()) {
            throw new IllegalStateException("正在处理上一项操作，请稍候。");
        }
    }

    private static Map<String, Object> state(ServerRuntime runtime) throws Exception {
        Pack.Config config = runtime.config();
        Map<String, Object> result = Json.map();
        result.put("official_version", config.officialVersion);
        result.put("github_repo", config.githubRepo);
        int port = boundPort(runtime);
        result.put("listen", config.listen);
        result.put("port", port);
        result.put("public_url", config.updateServerUrl);
        result.put("access_token", config.accessToken);
        result.put("token_enabled", !config.adminToken.isBlank());
        result.put("sync_token_enabled", !config.accessToken.isBlank());
        result.put("busy", runtime.busy());
        result.put("progress", Progress.get().toMap());
        String adminHost = "0.0.0.0".equals(config.listen) || "::".equals(config.listen) ? "127.0.0.1" : config.listen;
        result.put("admin_url", "http://" + adminHost + ":" + port + "/admin");
        try {
            Map<String, Object> meta = Pack.loadMeta(config);
            result.put("client_fingerprint", Json.str(meta, "client_fingerprint"));
            result.put("server_fingerprint", Json.str(meta, "server_fingerprint"));
        } catch (Exception ignored) {
            result.put("client_fingerprint", "");
            result.put("server_fingerprint", "");
        }
        List<Object> servers = Json.list();
        for (Connections.Record record : Connections.list(config)) {
            servers.add(record.toMap());
        }
        result.put("servers", servers);
        List<Object> privates = Json.list();
        for (Pack.PrivateFile file : Privates.list(config)) {
            Map<String, Object> row = Json.map();
            row.put("path", file.path);
            row.put("side", file.side);
            row.put("side_label", sideLabel(file.side));
            row.put("source", file.source.toString());
            privates.add(row);
        }
        result.put("privates", privates);
        List<Object> logs = Json.list();
        logs.addAll(runtime.logs());
        result.put("logs", logs);
        return result;
    }

    private static Map<String, Object> wanMap(Wan.Report report) {
        Map<String, Object> result = Json.map();
        result.put("public_ip", report.publicIp == null ? "" : report.publicIp);
        result.put("suggested_url", report.suggestedUrl == null ? "" : report.suggestedUrl);
        List<Object> addresses = Json.list();
        for (Wan.Address address : report.addresses) {
            Map<String, Object> row = Json.map();
            row.put("iface", address.iface);
            row.put("ip", address.ip);
            row.put("kind", address.kind);
            addresses.add(row);
        }
        result.put("addresses", addresses);
        return result;
    }

    private static void addPrivate(ServerRuntime runtime, HttpExchange exchange) throws Exception {
        String contentType = header(exchange, "Content-Type").toLowerCase(Locale.ROOT);
        Files.createDirectories(runtime.config().dataDir);
        Path temp = Files.createTempFile(runtime.config().dataDir, "admin-private-", ".bin");
        String dest;
        String side;
        try {
            if (contentType.startsWith("multipart/form-data")) {
                byte[] raw = readBytes(exchange, UPLOAD_MAX);
                Map<String, Part> parts = parseMultipart(raw, header(exchange, "Content-Type"));
                Part file = parts.get("file");
                if (file == null || file.data == null || file.data.length == 0) {
                    throw new IllegalArgumentException("请选择要上传的私货文件");
                }
                Files.write(temp, file.data);
                String filename = file.filename == null || file.filename.isBlank() ? "upload.bin" : Path.of(file.filename).getFileName().toString();
                dest = textPart(parts, "dest");
                if (dest.isBlank()) {
                    dest = Privates.defaultDest(Path.of(filename));
                }
                side = textPart(parts, "side");
            } else {
                Map<String, Object> body = Json.object(Json.parse(new String(readBytes(exchange, UPLOAD_MAX), StandardCharsets.UTF_8)));
                String filename = Json.str(body, "filename");
                String encoded = Json.str(body, "data_base64");
                if (encoded.isBlank()) {
                    throw new IllegalArgumentException("请选择要上传的私货文件");
                }
                byte[] data = Base64.getDecoder().decode(encoded);
                Files.write(temp, data);
                dest = Json.str(body, "dest");
                if (dest.isBlank()) {
                    dest = Privates.defaultDest(Path.of(filename.isBlank() ? "upload.bin" : filename));
                }
                side = Json.str(body, "side");
            }
            if (side == null || side.isBlank()) {
                side = "auto";
            }
            runtime.addPrivate(temp, dest, side, runtime.logger());
        } finally {
            Files.deleteIfExists(temp);
        }
    }

    private static String textPart(Map<String, Part> parts, String name) {
        Part part = parts.get(name);
        if (part == null || part.data == null) {
            return "";
        }
        return new String(part.data, StandardCharsets.UTF_8).trim();
    }

    private static String sideLabel(String side) {
        return switch (side) {
            case "client" -> "仅客户端";
            case "server" -> "仅服务端";
            default -> "两端";
        };
    }

    private static boolean method(HttpExchange exchange, String allowed) throws Exception {
        String method = exchange.getRequestMethod() == null ? "" : exchange.getRequestMethod().toUpperCase(Locale.ROOT);
        if (allowed.equals(method)) {
            return true;
        }
        sendError(exchange, 405, "方法不允许");
        return false;
    }

    private static Map<String, Object> readJson(HttpExchange exchange) throws Exception {
        String raw = new String(readBytes(exchange, JSON_MAX), StandardCharsets.UTF_8).trim();
        if (raw.isBlank()) {
            return Json.map();
        }
        return Json.object(Json.parse(raw));
    }

    private static byte[] readBytes(HttpExchange exchange, int max) throws Exception {
        try (InputStream in = exchange.getRequestBody()) {
            byte[] data = in.readNBytes(max + 1);
            if (data.length > max) {
                throw new IllegalArgumentException("请求过大");
            }
            return data;
        }
    }

    private static void sendJson(HttpExchange exchange, int code, Object body) throws Exception {
        byte[] bytes = Json.stringify(body).getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.getResponseHeaders().set("Cache-Control", "no-store");
        exchange.sendResponseHeaders(code, bytes.length);
        exchange.getResponseBody().write(bytes);
    }

    private static void sendError(HttpExchange exchange, int code, String message) {
        try {
            Map<String, Object> body = Json.map();
            body.put("detail", message == null ? "error" : message);
            sendJson(exchange, code, body);
        } catch (Exception ignored) {
            // ignore
        }
    }

    private static String header(HttpExchange exchange, String name) {
        List<String> values = exchange.getRequestHeaders().get(name);
        if (values == null || values.isEmpty() || values.get(0) == null) {
            return "";
        }
        return values.get(0).trim();
    }

    private static String cookie(HttpExchange exchange, String name) {
        List<String> headers = exchange.getRequestHeaders().get("Cookie");
        if (headers == null) {
            return "";
        }
        for (String header : headers) {
            if (header == null) {
                continue;
            }
            for (String part : header.split(";")) {
                String[] pair = part.trim().split("=", 2);
                if (pair.length == 2 && name.equals(pair[0].trim())) {
                    return URLDecoder.decode(pair[1].trim(), StandardCharsets.UTF_8);
                }
            }
        }
        return "";
    }

    private static void setCookie(HttpExchange exchange, String value) {
        exchange.getResponseHeaders().add("Set-Cookie",
                COOKIE + "=" + URLEncoder.encode(value, StandardCharsets.UTF_8)
                        + "; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=2592000");
    }

    private static void clearCookie(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Set-Cookie", COOKIE + "=; Path=/admin; HttpOnly; Max-Age=0");
    }

    private static final class Part {
        final String filename;
        final byte[] data;

        Part(String filename, byte[] data) {
            this.filename = filename;
            this.data = data;
        }
    }

    private static Map<String, Part> parseMultipart(byte[] body, String contentType) {
        String boundary = boundaryOf(contentType);
        if (boundary == null || boundary.isBlank()) {
            throw new IllegalArgumentException("缺少上传边界");
        }
        byte[] marker = ("--" + boundary).getBytes(StandardCharsets.ISO_8859_1);
        List<Integer> starts = new ArrayList<>();
        int index = indexOf(body, marker, 0);
        while (index >= 0) {
            starts.add(index);
            index = indexOf(body, marker, index + marker.length);
        }
        Map<String, Part> parts = new LinkedHashMap<>();
        for (int i = 0; i + 1 < starts.size(); i++) {
            int from = starts.get(i) + marker.length;
            if (from + 1 < body.length && body[from] == '\r' && body[from + 1] == '\n') {
                from += 2;
            }
            int to = starts.get(i + 1);
            if (to >= 2 && body[to - 2] == '\r' && body[to - 1] == '\n') {
                to -= 2;
            }
            int headerEnd = indexOf(body, new byte[]{'\r', '\n', '\r', '\n'}, from);
            if (headerEnd < 0 || headerEnd > to) {
                continue;
            }
            String headers = new String(body, from, headerEnd - from, StandardCharsets.ISO_8859_1);
            String name = disposition(headers, "name");
            if (name.isBlank()) {
                continue;
            }
            byte[] data = Arrays.copyOfRange(body, headerEnd + 4, Math.max(headerEnd + 4, to));
            parts.put(name, new Part(disposition(headers, "filename"), data));
        }
        return parts;
    }

    private static String boundaryOf(String contentType) {
        if (contentType == null) {
            return null;
        }
        for (String part : contentType.split(";")) {
            String trimmed = part.trim();
            if (trimmed.regionMatches(true, 0, "boundary=", 0, 9)) {
                String value = trimmed.substring(9).trim();
                if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
                    return value.substring(1, value.length() - 1);
                }
                return value;
            }
        }
        return null;
    }

    private static String disposition(String headers, String key) {
        for (String line : headers.split("\r\n")) {
            if (!line.toLowerCase(Locale.ROOT).startsWith("content-disposition:")) {
                continue;
            }
            for (String part : line.split(";")) {
                String trimmed = part.trim();
                if (trimmed.regionMatches(true, 0, key + "=", 0, key.length() + 1)) {
                    String value = trimmed.substring(key.length() + 1).trim();
                    if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
                        return value.substring(1, value.length() - 1);
                    }
                    return value;
                }
            }
        }
        return "";
    }

    private static int indexOf(byte[] data, byte[] needle, int from) {
        outer:
        for (int i = from; i + needle.length <= data.length; i++) {
            for (int j = 0; j < needle.length; j++) {
                if (data[i + j] != needle[j]) {
                    continue outer;
                }
            }
            return i;
        }
        return -1;
    }
}
