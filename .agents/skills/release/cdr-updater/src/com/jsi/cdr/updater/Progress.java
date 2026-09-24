package com.jsi.cdr.updater;

import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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
    private static final ConcurrentHashMap<String, Long> inflight = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, Long> settled = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, long[]> scaled = new ConcurrentHashMap<>();
    private static volatile long planTotal;
    private static long overallMarkNanos;
    private static long overallMarkBytes;
    private static long overallSpeed;

    private Progress() {}

    static Snapshot get() {
        return current;
    }

    static synchronized void plan(long totalBytes) {
        inflight.clear();
        settled.clear();
        scaled.clear();
        planTotal = Math.max(0, totalBytes);
        overallMarkNanos = System.nanoTime();
        overallMarkBytes = 0;
        overallSpeed = 0;
    }

    static void weigh(String key, long transferTotal, long budget) {
        if (key == null || key.isBlank() || transferTotal <= 0 || budget < 0) {
            return;
        }
        scaled.put(key, new long[]{transferTotal, budget});
    }

    static void flight(String key, long transferred) {
        if (key == null || key.isBlank() || settled.containsKey(key)) {
            return;
        }
        long shown = Math.max(0, transferred);
        long[] factor = scaled.get(key);
        if (factor != null && factor[0] > 0) {
            shown = Math.min(factor[1], shown * factor[1] / factor[0]);
        }
        inflight.put(key, shown);
        noteOverallSpeed();
    }

    static void settle(String key, long budget) {
        if (key == null || key.isBlank()) {
            return;
        }
        inflight.remove(key);
        scaled.remove(key);
        settled.put(key, Math.max(0, budget));
        noteOverallSpeed();
    }

    static Snapshot overall() {
        if (planTotal <= 0) {
            return IDLE;
        }
        long done = 0;
        for (Long value : settled.values()) {
            done += value;
        }
        for (Long value : inflight.values()) {
            done += value;
        }
        if (done > planTotal) {
            done = planTotal;
        }
        return new Snapshot(true, "总进度", done, planTotal, 0, 0, overallSpeed);
    }

    private static void noteOverallSpeed() {
        long done = 0;
        for (Long value : settled.values()) {
            done += value;
        }
        for (Long value : inflight.values()) {
            done += value;
        }
        long now = System.nanoTime();
        long elapsed = now - overallMarkNanos;
        if (overallMarkNanos == 0) {
            overallMarkNanos = now;
            overallMarkBytes = done;
            return;
        }
        if (elapsed >= 400_000_000L && done >= overallMarkBytes) {
            overallSpeed = (done - overallMarkBytes) * 1_000_000_000L / elapsed;
        }
        if (elapsed >= 2_000_000_000L) {
            overallMarkNanos = now;
            overallMarkBytes = done;
        }
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

    static synchronized void note(String label) {
        current = new Snapshot(true, label == null ? "" : label, 0, -1, 0, 0, 0);
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
