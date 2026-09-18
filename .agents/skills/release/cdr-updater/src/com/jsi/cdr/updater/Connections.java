package com.jsi.cdr.updater;

import com.sun.net.httpserver.HttpExchange;

import java.net.InetAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

final class Connections {
    private Connections() {}

    static final class Record {
        final String id;
        final String hostname;
        final String instancePath;
        final String remote;
        final String firstSeen;
        final String lastSeen;
        final long syncCount;

        Record(String id, String hostname, String instancePath, String remote, String firstSeen, String lastSeen, long syncCount) {
            this.id = id;
            this.hostname = hostname;
            this.instancePath = instancePath;
            this.remote = remote;
            this.firstSeen = firstSeen;
            this.lastSeen = lastSeen;
            this.syncCount = syncCount;
        }

        Map<String, Object> toMap() {
            Map<String, Object> row = Json.map();
            row.put("id", id);
            row.put("hostname", hostname);
            row.put("instance_path", instancePath);
            row.put("remote", remote);
            row.put("first_seen", firstSeen);
            row.put("last_seen", lastSeen);
            row.put("sync_count", syncCount);
            return row;
        }

        static Record from(Map<String, Object> row) {
            return new Record(
                    Json.str(row, "id"),
                    Json.str(row, "hostname"),
                    Json.str(row, "instance_path"),
                    Json.str(row, "remote"),
                    Json.str(row, "first_seen"),
                    Json.str(row, "last_seen"),
                    Json.lng(row, "sync_count")
            );
        }
    }

    static Path store(Pack.Config config) {
        return config.dataDir.resolve("server-connections.json");
    }

    static synchronized List<Record> list(Pack.Config config) throws Exception {
        Path file = store(config);
        if (!Files.isRegularFile(file)) {
            return List.of();
        }
        Map<String, Object> data = Json.object(Json.parse(Files.readString(file)));
        List<Record> records = new ArrayList<>();
        for (Object item : Json.array(data.get("servers"))) {
            records.add(Record.from(Json.object(item)));
        }
        return records;
    }

    static synchronized void noteServer(Pack.Config config, HttpExchange exchange) throws Exception {
        String id = header(exchange, "X-CDR-Instance-Id");
        String hostname = header(exchange, "X-CDR-Hostname");
        String instancePath = decodePath(header(exchange, "X-CDR-Instance-Path"));
        String remote = remoteAddress(exchange);
        if (id.isBlank()) {
            id = "ip:" + remote + (instancePath.isBlank() ? "" : ":" + Integer.toHexString(instancePath.hashCode()));
        }
        String now = Instant.now().toString();
        List<Record> records = new ArrayList<>(list(config));
        boolean found = false;
        for (int i = 0; i < records.size(); i++) {
            Record existing = records.get(i);
            if (!id.equals(existing.id)) {
                continue;
            }
            records.set(i, new Record(
                    existing.id,
                    hostname.isBlank() ? existing.hostname : hostname,
                    instancePath.isBlank() ? existing.instancePath : instancePath,
                    remote.isBlank() ? existing.remote : remote,
                    existing.firstSeen.isBlank() ? now : existing.firstSeen,
                    now,
                    existing.syncCount + 1
            ));
            found = true;
            break;
        }
        if (!found) {
            records.add(new Record(id, hostname, instancePath, remote, now, now, 1));
        }
        Map<String, Object> data = Json.map();
        List<Object> rows = Json.list();
        for (Record record : records) {
            rows.add(record.toMap());
        }
        data.put("servers", rows);
        Files.createDirectories(config.dataDir);
        Files.writeString(store(config), Json.stringify(data));
    }

    static synchronized String ensureInstanceId(Path instance) throws Exception {
        Files.createDirectories(instance);
        Path statePath = instance.resolve("cdr-updater-state.json");
        Map<String, Object> state = Files.isRegularFile(statePath)
                ? Json.object(Json.parse(Files.readString(statePath)))
                : Json.map();
        String id = Json.str(state, "instance_id");
        if (id.isBlank()) {
            id = UUID.randomUUID().toString();
            state.put("instance_id", id);
            Files.writeString(statePath, Json.stringify(state));
        }
        return id;
    }

    static String localHostname() {
        try {
            return InetAddress.getLocalHost().getHostName().replaceAll("[^\\x20-\\x7E]", "");
        } catch (Exception ignored) {
            return "";
        }
    }

    static String encodePath(String path) {
        if (path == null || path.isBlank()) {
            return "";
        }
        return Base64.getEncoder().encodeToString(path.getBytes(StandardCharsets.UTF_8));
    }

    static String decodePath(String encoded) {
        if (encoded == null || encoded.isBlank()) {
            return "";
        }
        try {
            return new String(Base64.getDecoder().decode(encoded), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ignored) {
            return encoded;
        }
    }

    static boolean isServerRequest(HttpExchange exchange, String side) {
        return "server".equals(side) && "server".equals(header(exchange, "X-CDR-Side"));
    }

    private static String header(HttpExchange exchange, String name) {
        List<String> values = exchange.getRequestHeaders().get(name);
        if (values == null || values.isEmpty() || values.get(0) == null) {
            return "";
        }
        return values.get(0).trim();
    }

    private static String remoteAddress(HttpExchange exchange) {
        if (exchange.getRemoteAddress() == null || exchange.getRemoteAddress().getAddress() == null) {
            return "";
        }
        return exchange.getRemoteAddress().getAddress().getHostAddress();
    }
}
