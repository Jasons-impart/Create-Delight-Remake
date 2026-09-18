package com.jsi.cdr.updater;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Map;
import java.util.zip.ZipFile;

final class Sides {
    private Sides() {}

    static String normalize(String side) {
        if (side == null) {
            return "both";
        }
        String value = side.trim().toLowerCase(Locale.ROOT);
        if ("client".equals(value) || "server".equals(value) || "both".equals(value)) {
            return value;
        }
        if ("all".equals(value)) {
            return "both";
        }
        throw new IllegalArgumentException("无效端侧: " + side);
    }

    static String official(String rel, boolean inClient, boolean inServer, String packwizSide) {
        if (packwizSide != null && !packwizSide.isBlank()) {
            return normalize(packwizSide);
        }
        if (inClient && !inServer) {
            return "client";
        }
        if (inClient && inServer) {
            return "both";
        }
        return PackPaths.defaultSide(rel);
    }

    static String overlay(String rel, Path source, Map<String, String> officialSides) {
        String known = officialSides.get(Fs.posix(rel));
        if (known != null) {
            return known;
        }
        String fromJar = detectJar(source);
        if (fromJar != null) {
            return fromJar;
        }
        return PackPaths.defaultSide(rel);
    }

    static String detectJar(Path file) {
        if (file == null || !Files.isRegularFile(file)) {
            return null;
        }
        String name = file.getFileName().toString().toLowerCase(Locale.ROOT);
        if (!name.endsWith(".jar")) {
            return null;
        }
        try (ZipFile zip = new ZipFile(file.toFile())) {
            var fabric = zip.getEntry("fabric.mod.json");
            if (fabric != null) {
                String json = new String(zip.getInputStream(fabric).readAllBytes(), StandardCharsets.UTF_8)
                        .toLowerCase(Locale.ROOT);
                if (json.contains("\"environment\"") && json.contains("\"client\"")) {
                    return "client";
                }
                if (json.contains("\"environment\"") && json.contains("\"server\"")) {
                    return "server";
                }
            }
            var mods = zip.getEntry("META-INF/mods.toml");
            if (mods != null) {
                String text = new String(zip.getInputStream(mods).readAllBytes(), StandardCharsets.UTF_8);
                String declared = modsTableSide(text);
                if (declared != null) {
                    return declared;
                }
            }
        } catch (Exception ignored) {
            return null;
        }
        return null;
    }

    static String modsTableSide(String text) {
        int mods = text.indexOf("[[mods]]");
        if (mods < 0) {
            return null;
        }
        int next = text.indexOf("[[", mods + 8);
        String block = next < 0 ? text.substring(mods) : text.substring(mods, next);
        for (String raw : block.split("\n")) {
            String line = raw.trim().toLowerCase(Locale.ROOT).replace(" ", "");
            if (line.startsWith("side=")) {
                if (line.contains("client")) {
                    return "client";
                }
                if (line.contains("server")) {
                    return "server";
                }
                if (line.contains("both") || line.contains("all")) {
                    return "both";
                }
            }
        }
        return null;
    }

    static String[] splitPrivatePrefix(String rel) {
        String path = Fs.posix(rel);
        for (String side : new String[]{"client", "server", "both"}) {
            if (path.equals(side)) {
                return new String[]{side, ""};
            }
            if (path.startsWith(side + "/")) {
                return new String[]{side, path.substring(side.length() + 1)};
            }
        }
        return new String[]{null, path};
    }
}
