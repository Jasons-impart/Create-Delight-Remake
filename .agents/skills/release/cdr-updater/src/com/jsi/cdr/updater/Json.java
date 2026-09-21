package com.jsi.cdr.updater;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

final class Json {
    private Json() {}

    @SuppressWarnings("unchecked")
    static Map<String, Object> object(Object value) {
        if (value instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        }
        return new LinkedHashMap<>();
    }

    @SuppressWarnings("unchecked")
    static List<Object> array(Object value) {
        if (value instanceof List<?> list) {
            return (List<Object>) list;
        }
        return new ArrayList<>();
    }

    static String str(Map<String, Object> object, String key) {
        Object value = object.get(key);
        return value == null ? "" : String.valueOf(value);
    }

    static boolean bool(Map<String, Object> object, String key) {
        Object value = object.get(key);
        if (value instanceof Boolean flag) {
            return flag;
        }
        return value != null && "true".equalsIgnoreCase(value.toString());
    }

    static long lng(Map<String, Object> object, String key) {
        Object value = object.get(key);
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value == null || value.toString().isBlank()) {
            return 0L;
        }
        return Long.parseLong(value.toString());
    }

    static Map<String, Object> map(Object... pairs) {
        Map<String, Object> map = new LinkedHashMap<>();
        if (pairs == null || pairs.length == 0) {
            return map;
        }
        if (pairs.length % 2 != 0) {
            throw new IllegalArgumentException("map 需要成对的键值");
        }
        for (int i = 0; i < pairs.length; i += 2) {
            map.put(String.valueOf(pairs[i]), pairs[i + 1]);
        }
        return map;
    }

    static List<Object> list() {
        return new ArrayList<>();
    }

    static String stringify(Object value) {
        StringBuilder out = new StringBuilder();
        write(out, value);
        return out.toString();
    }

    static Object parse(String text) {
        return new Parser(text).parseValue();
    }

    private static void write(StringBuilder out, Object value) {
        if (value == null) {
            out.append("null");
        } else if (value instanceof String string) {
            out.append('"').append(escape(string)).append('"');
        } else if (value instanceof Boolean || value instanceof Number) {
            out.append(value);
        } else if (value instanceof Map<?, ?> map) {
            out.append('{');
            boolean first = true;
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                if (!first) {
                    out.append(',');
                }
                first = false;
                out.append('"').append(escape(String.valueOf(entry.getKey()))).append('"').append(':');
                write(out, entry.getValue());
            }
            out.append('}');
        } else if (value instanceof List<?> list) {
            out.append('[');
            boolean first = true;
            for (Object item : list) {
                if (!first) {
                    out.append(',');
                }
                first = false;
                write(out, item);
            }
            out.append(']');
        } else {
            out.append('"').append(escape(String.valueOf(value))).append('"');
        }
    }

    private static String escape(String text) {
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            switch (ch) {
                case '"' -> out.append("\\\"");
                case '\\' -> out.append("\\\\");
                case '\n' -> out.append("\\n");
                case '\r' -> out.append("\\r");
                case '\t' -> out.append("\\t");
                default -> {
                    if (ch < 32) {
                        out.append(String.format("\\u%04x", (int) ch));
                    } else {
                        out.append(ch);
                    }
                }
            }
        }
        return out.toString();
    }

    private static final class Parser {
        private final String text;
        private int index;

        Parser(String text) {
            this.text = text;
        }

        Object parseValue() {
            skip();
            if (index >= text.length()) {
                throw new IllegalArgumentException("空 JSON");
            }
            char ch = text.charAt(index);
            if (ch == '{') {
                return parseObject();
            }
            if (ch == '[') {
                return parseArray();
            }
            if (ch == '"') {
                return parseString();
            }
            if (ch == 't' || ch == 'f') {
                return parseBoolean();
            }
            if (ch == 'n') {
                expect("null");
                return null;
            }
            return parseNumber();
        }

        private Map<String, Object> parseObject() {
            expect("{");
            Map<String, Object> object = map();
            skip();
            if (peek('}')) {
                index++;
                return object;
            }
            while (true) {
                skip();
                String key = parseString();
                skip();
                expect(":");
                object.put(key, parseValue());
                skip();
                if (peek('}')) {
                    index++;
                    return object;
                }
                expect(",");
            }
        }

        private List<Object> parseArray() {
            expect("[");
            List<Object> array = list();
            skip();
            if (peek(']')) {
                index++;
                return array;
            }
            while (true) {
                array.add(parseValue());
                skip();
                if (peek(']')) {
                    index++;
                    return array;
                }
                expect(",");
            }
        }

        private String parseString() {
            expect("\"");
            StringBuilder out = new StringBuilder();
            while (index < text.length()) {
                char ch = text.charAt(index++);
                if (ch == '"') {
                    return out.toString();
                }
                if (ch == '\\') {
                    char esc = text.charAt(index++);
                    out.append(switch (esc) {
                        case '"' -> '"';
                        case '\\' -> '\\';
                        case '/' -> '/';
                        case 'b' -> '\b';
                        case 'f' -> '\f';
                        case 'n' -> '\n';
                        case 'r' -> '\r';
                        case 't' -> '\t';
                        case 'u' -> (char) Integer.parseInt(text.substring(index, index += 4), 16);
                        default -> esc;
                    });
                } else {
                    out.append(ch);
                }
            }
            throw new IllegalArgumentException("未闭合字符串");
        }

        private Object parseBoolean() {
            if (text.startsWith("true", index)) {
                index += 4;
                return Boolean.TRUE;
            }
            expect("false");
            return Boolean.FALSE;
        }

        private Object parseNumber() {
            int start = index;
            if (peek('-')) {
                index++;
            }
            while (index < text.length() && (Character.isDigit(text.charAt(index)) || text.charAt(index) == '.' || text.charAt(index) == 'e' || text.charAt(index) == 'E' || text.charAt(index) == '+' || text.charAt(index) == '-')) {
                index++;
            }
            String raw = text.substring(start, index);
            if (raw.contains(".") || raw.contains("e") || raw.contains("E")) {
                return Double.parseDouble(raw);
            }
            return Long.parseLong(raw);
        }

        private void skip() {
            while (index < text.length() && Character.isWhitespace(text.charAt(index))) {
                index++;
            }
        }

        private boolean peek(char ch) {
            return index < text.length() && text.charAt(index) == ch;
        }

        private void expect(String token) {
            skip();
            if (!text.startsWith(token, index)) {
                throw new IllegalArgumentException("期望 " + token + " 实际 " + text.substring(index, Math.min(text.length(), index + 12)));
            }
            index += token.length();
        }
    }
}
