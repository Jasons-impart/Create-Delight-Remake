package com.jsi.cdr.updater;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

final class Toml {
    private Toml() {}

    static Map<String, Object> load(Path path) throws Exception {
        return parse(Files.readString(path));
    }

    static Map<String, Object> parse(String text) {
        Map<String, Object> root = new LinkedHashMap<>();
        Map<String, Object> current = root;
        for (String raw : text.split("\n")) {
            String line = stripComment(raw).trim();
            if (line.isEmpty()) {
                continue;
            }
            if (line.startsWith("[[") && line.endsWith("]]")) {
                String name = line.substring(2, line.length() - 2).trim();
                Map<String, Object> item = new LinkedHashMap<>();
                list(root, name).add(item);
                current = item;
                continue;
            }
            if (line.startsWith("[") && line.endsWith("]")) {
                String name = line.substring(1, line.length() - 1).trim();
                current = table(root, name);
                continue;
            }
            int eq = line.indexOf('=');
            if (eq < 0) {
                continue;
            }
            current.put(line.substring(0, eq).trim(), scalar(line.substring(eq + 1).trim()));
        }
        return root;
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> table(Map<String, Object> root, String name) {
        Map<String, Object> cursor = root;
        for (String part : name.split("\\.")) {
            Object existing = cursor.get(part);
            if (!(existing instanceof Map<?, ?>)) {
                Map<String, Object> next = new LinkedHashMap<>();
                cursor.put(part, next);
                cursor = next;
            } else {
                cursor = (Map<String, Object>) existing;
            }
        }
        return cursor;
    }

    @SuppressWarnings("unchecked")
    static List<Object> list(Map<String, Object> root, String name) {
        Object existing = root.get(name);
        if (existing instanceof List<?> list) {
            return (List<Object>) list;
        }
        List<Object> created = new ArrayList<>();
        root.put(name, created);
        return created;
    }

    static String str(Map<String, Object> object, String key, String fallback) {
        Object value = object.get(key);
        return value == null ? fallback : String.valueOf(value);
    }

    static int num(Map<String, Object> object, String key, int fallback) {
        Object value = object.get(key);
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value == null || value.toString().isBlank()) {
            return fallback;
        }
        return Integer.parseInt(value.toString());
    }

    static void setTableString(Path file, String table, String key, String value) throws Exception {
        String text = Files.readString(file);
        String[] lines = text.split("\n", -1);
        String section = "";
        boolean replaced = false;
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            String stripped = stripComment(line).trim();
            if (stripped.startsWith("[") && stripped.endsWith("]") && !stripped.startsWith("[[")) {
                section = stripped.substring(1, stripped.length() - 1).trim();
            }
            boolean isKey = table.equals(section) && stripped.startsWith(key)
                    && stripped.substring(key.length()).trim().startsWith("=");
            if (isKey && !replaced) {
                int start = 0;
                while (start < line.length() && Character.isWhitespace(line.charAt(start))) {
                    start++;
                }
                out.append(line, 0, start).append(key).append(" = \"").append(escape(value)).append('"');
                replaced = true;
            } else {
                out.append(line);
            }
            if (i < lines.length - 1) {
                out.append('\n');
            }
        }
        if (!replaced) {
            insertTableAssignment(file, text, table, key + " = \"" + escape(value) + "\"");
            return;
        }
        Files.writeString(file, out.toString());
    }

    static void setTableInt(Path file, String table, String key, int value) throws Exception {
        setTableLiteral(file, table, key, Integer.toString(value));
    }

    static void setTableLiteral(Path file, String table, String key, String literal) throws Exception {
        String text = Files.readString(file);
        String[] lines = text.split("\n", -1);
        String section = "";
        boolean replaced = false;
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i];
            String stripped = stripComment(line).trim();
            if (stripped.startsWith("[") && stripped.endsWith("]") && !stripped.startsWith("[[")) {
                section = stripped.substring(1, stripped.length() - 1).trim();
            }
            boolean isKey = table.equals(section) && stripped.startsWith(key)
                    && stripped.substring(key.length()).trim().startsWith("=");
            if (isKey && !replaced) {
                int start = 0;
                while (start < line.length() && Character.isWhitespace(line.charAt(start))) {
                    start++;
                }
                out.append(line, 0, start).append(key).append(" = ").append(literal);
                replaced = true;
            } else {
                out.append(line);
            }
            if (i < lines.length - 1) {
                out.append('\n');
            }
        }
        if (!replaced) {
            throw new IllegalStateException("配置里没有 [" + table + "] " + key);
        }
        Files.writeString(file, out.toString());
    }

    private static void insertTableAssignment(Path file, String text, String table, String assignment) throws Exception {
        String[] lines = text.split("\n", -1);
        String section = "";
        int insertAt = -1;
        for (int i = 0; i < lines.length; i++) {
            String stripped = stripComment(lines[i]).trim();
            if (stripped.startsWith("[") && stripped.endsWith("]") && !stripped.startsWith("[[")) {
                String next = stripped.substring(1, stripped.length() - 1).trim();
                if (table.equals(section)) {
                    insertAt = i;
                    break;
                }
                section = next;
                if (table.equals(section)) {
                    insertAt = i + 1;
                }
            } else if (table.equals(section)) {
                insertAt = i + 1;
            }
        }
        if (insertAt < 0) {
            throw new IllegalStateException("配置里没有 [" + table + "]");
        }
        List<String> all = new ArrayList<>(List.of(lines));
        all.add(insertAt, assignment);
        Files.writeString(file, String.join("\n", all));
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String stripComment(String line) {
        boolean quoted = false;
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < line.length(); i++) {
            char ch = line.charAt(i);
            if (ch == '"' && (i == 0 || line.charAt(i - 1) != '\\')) {
                quoted = !quoted;
            }
            if (ch == '#' && !quoted) {
                break;
            }
            out.append(ch);
        }
        return out.toString();
    }

    private static Object scalar(String raw) {
        if (raw.equals("true") || raw.equals("false")) {
            return Boolean.parseBoolean(raw);
        }
        if (raw.startsWith("\"") && raw.endsWith("\"") && raw.length() >= 2) {
            return raw.substring(1, raw.length() - 1).replace("\\\"", "\"").replace("\\\\", "\\");
        }
        if (raw.matches("-?\\d+")) {
            return Long.parseLong(raw);
        }
        return raw;
    }
}
