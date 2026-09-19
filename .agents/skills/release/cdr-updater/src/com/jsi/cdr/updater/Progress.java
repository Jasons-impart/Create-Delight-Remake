package com.jsi.cdr.updater;

import java.util.Locale;
import java.util.Map;

final class Progress {
    static final class Snapshot {
        final boolean active;
        final String label;
        final long done;
        final long total;
        final int index;
        final int count;
        final long speedBps;

        Snapshot(boolean active, String label, long done, long total, int index, int count, long speedBps) {
            this.active = active;
            this.label = label == null ? "" : label;
            this.done = Math.max(0, done);
            this.total = total;
            this.index = Math.max(0, index);
            this.count = Math.max(0, count);
            this.speedBps = Math.max(0, speedBps);
        }

        int percent() {
            if (total <= 0) {
                return -1;
            }
            return (int) Math.min(100, Math.round(done * 100.0 / total));
        }

        String text() {
            StringBuilder out = new StringBuilder();
            if (count > 1 && index > 0) {
                out.append(index).append('/').append(count).append("  ");
            }
            if (!label.isBlank()) {
                out.append(label);
            }
            int pct = percent();
            if (pct >= 0) {
                out.append("  ").append(pct).append("%  ")
                        .append(formatSize(done)).append('/').append(formatSize(total));
            } else if (done > 0) {
                out.append("  ").append(formatSize(done));
            }
            if (speedBps > 0) {
                out.append("  ").append(formatSize(speedBps)).append("/s");
            } else if (total > 0 && done < total) {
                out.append("  连接中");
            }
            return out.toString().trim();
        }

        Map<String, Object> toMap() {
            Map<String, Object> row = Json.map();
            row.put("active", active);
            row.put("label", label);
            row.put("done", done);
            row.put("total", total);
            row.put("index", (long) index);
            row.put("count", (long) count);
            row.put("percent", (long) percent());
            row.put("speed", speedBps);
            row.put("text", text());
            return row;
        }
    }

    private static final Snapshot IDLE = new Snapshot(false, "", 0, -1, 0, 0, 0);
    private static volatile Snapshot current = IDLE;
    private static long speedAtNanos;
    private static long speedAtBytes;
    private static int liveWidth;
    private static long lastLiveNanos;

    private Progress() {}

    static Snapshot get() {
        return current;
    }

    static synchronized void begin(String label, int count) {
        speedAtNanos = System.nanoTime();
        speedAtBytes = 0;
        current = new Snapshot(true, label, 0, -1, 0, Math.max(1, count), 0);
    }

    static synchronized void ensure(String label, long total) {
        Snapshot prev = current;
        if (!prev.active) {
            speedAtNanos = System.nanoTime();
            speedAtBytes = 0;
            current = new Snapshot(true, label, 0, total, 1, 1, 0);
            return;
        }
        if (label != null && label.equals(prev.label)) {
            current = new Snapshot(true, label, prev.done, total > 0 ? total : prev.total, prev.index, prev.count, prev.speedBps);
            return;
        }
        speedAtNanos = System.nanoTime();
        speedAtBytes = 0;
        int index = prev.index + 1;
        int count = Math.max(prev.count, index);
        current = new Snapshot(true, label, 0, total, index, count, 0);
    }

    static synchronized void bytes(long done) {
        Snapshot prev = current;
        if (!prev.active) {
            return;
        }
        if (done <= prev.done) {
            return;
        }
        long now = System.nanoTime();
        long elapsed = now - speedAtNanos;
        long speed = prev.speedBps;
        if (elapsed >= 400_000_000L && done >= speedAtBytes) {
            speed = (done - speedAtBytes) * 1_000_000_000L / elapsed;
        }
        if (elapsed >= 2_000_000_000L) {
            speedAtNanos = now;
            speedAtBytes = done;
        }
        current = new Snapshot(true, prev.label, done, prev.total, prev.index, prev.count, speed);
    }

    static void live() {
        live(false);
    }

    static synchronized void live(boolean force) {
        Snapshot snap = current;
        if (!snap.active) {
            return;
        }
        long now = System.nanoTime();
        if (!force && now - lastLiveNanos < 200_000_000L) {
            return;
        }
        lastLiveNanos = now;
        String text = snap.text();
        if (text.isBlank()) {
            return;
        }
        int pad = Math.max(0, liveWidth - text.length());
        liveWidth = text.length();
        System.out.print("\r" + text + " ".repeat(pad));
        System.out.flush();
    }

    static synchronized void finishLive() {
        if (liveWidth <= 0) {
            return;
        }
        System.out.println();
        liveWidth = 0;
        lastLiveNanos = 0;
    }

    static synchronized void end() {
        finishLive();
        current = IDLE;
        speedAtNanos = 0;
        speedAtBytes = 0;
    }

    static String formatSize(long bytes) {
        if (bytes < 1024) {
            return bytes + " B";
        }
        if (bytes < 1024 * 1024) {
            return String.format(Locale.ROOT, "%.1f KB", bytes / 1024.0);
        }
        if (bytes < 1024L * 1024 * 1024) {
            return String.format(Locale.ROOT, "%.1f MB", bytes / 1048576.0);
        }
        return String.format(Locale.ROOT, "%.2f GB", bytes / 1073741824.0);
    }
}
