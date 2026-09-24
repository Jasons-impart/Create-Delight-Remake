package com.jsi.cdr.updater;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Consumer;
import javax.net.ssl.HttpsURLConnection;

final class Net {
    private static final String[] GITHUB_PROXIES = {
            "https://ghfast.top/",
            "https://gh.llkk.cc/",
            "https://github.moeyy.xyz/",
            "https://ghproxy.net/",
            "https://gh-proxy.com/"
    };
    private static final long IDLE_NS = 20_000_000_000L;
    private static final long PARALLEL_MIN = 256 * 1024;
    private static final int PARALLEL_PARTS = 16;
    private static HttpClient client;

    private Net() {}

    static void installJvmDefaults() {
        if (System.getProperty("java.net.useSystemProxies") == null) {
            System.setProperty("java.net.useSystemProxies", "true");
        }
        if (System.getProperty("http.maxConnections") == null) {
            System.setProperty("http.maxConnections", "32");
        }
        if (isWindows() && System.getProperty("javax.net.ssl.trustStoreType") == null) {
            System.setProperty("javax.net.ssl.trustStoreType", "Windows-ROOT");
        }
    }

    static long toFile(HttpClient http, HttpRequest.Builder request, Path destination, long expected,
                       String label, Consumer<String> log) throws Exception {
        return toFile(http, request, destination, expected, label, log, false);
    }

    static long toFile(HttpClient http, HttpRequest.Builder request, Path destination, long expected,
                       String label, Consumer<String> log, boolean resume) throws Exception {
        return toFile(http, request, destination, expected, label, log, resume, true);
    }

    static long toFile(HttpClient http, HttpRequest.Builder request, Path destination, long expected,
                       String label, Consumer<String> log, boolean resume, boolean parallel) throws Exception {
        HttpRequest built = request.build();
        String url = built.uri().toString();
        Map<String, String> headers = new LinkedHashMap<>();
        built.headers().map().forEach((name, values) -> {
            if (!values.isEmpty() && !"host".equalsIgnoreCase(name) && !"content-length".equalsIgnoreCase(name)) {
                headers.put(name, values.get(0));
            }
        });
        headers.putIfAbsent("User-Agent", "cdr-updater");
        Files.createDirectories(destination.getParent());
        long existing = Files.isRegularFile(destination) ? Files.size(destination) : 0;
        if (existing > 0 && (!resume || expected <= 0 || existing > expected)) {
            Files.deleteIfExists(destination);
            existing = 0;
        }
        deletePartFiles(destination);
        List<String> urls = downloadUrls(url);
        Exception last = null;
        boolean allowResume = resume && existing > 0;
        boolean githubBig = isGithubDownload(url) && (expected <= 0 || expected >= PARALLEL_MIN);
        if (githubBig) {
            List<String> ordered = new ArrayList<>();
            ordered.add(officialGithub(url));
            for (String candidate : urls) {
                if (!ordered.contains(candidate)) {
                    ordered.add(candidate);
                }
            }
            for (String candidate : ordered) {
                try {
                    return download(candidate, headers, destination, expected, label, log, allowResume, true, true, true);
                } catch (NoRange ignored) {
                    Progress.finishLive();
                    Files.deleteIfExists(destination);
                    allowResume = false;
                    if (log != null) {
                        log.accept("通道不支持分段 " + host(candidate) + "，跳过");
                    }
                } catch (SlowDownload error) {
                    Progress.finishLive();
                    Files.deleteIfExists(destination);
                    allowResume = false;
                    if (log != null) {
                        log.accept("多线程过慢 " + host(candidate) + "（"
                                + Progress.formatSize(error.speedBps) + "/s），换通道");
                    }
                } catch (Exception error) {
                    Progress.finishLive();
                    Files.deleteIfExists(destination);
                    allowResume = false;
                    last = error;
                    if (log != null) {
                        log.accept("通道失败 " + host(candidate) + "，换通道");
                    }
                }
            }
            for (int i = 0; i < ordered.size(); i++) {
                String candidate = ordered.get(i);
                boolean lastTry = i == ordered.size() - 1;
                try {
                    return download(candidate, headers, destination, expected, label, log, allowResume, !lastTry, false, parallel);
                } catch (SlowDownload error) {
                    Progress.finishLive();
                    Files.deleteIfExists(destination);
                    allowResume = false;
                    if (log != null) {
                        log.accept("下载过慢 " + host(candidate) + "（"
                                + Progress.formatSize(error.speedBps) + "/s），换加速源");
                    }
                } catch (Exception error) {
                    Progress.finishLive();
                    Files.deleteIfExists(destination);
                    allowResume = false;
                    last = error;
                    if (!lastTry && log != null) {
                        log.accept("通道失败 " + host(candidate) + "，换加速源");
                    }
                }
            }
        } else {
            for (int i = 0; i < urls.size(); i++) {
                String candidate = urls.get(i);
                boolean lastTry = i == urls.size() - 1;
                try {
                    return download(candidate, headers, destination, expected, label, log, allowResume, !lastTry, false, parallel);
                } catch (SlowDownload error) {
                    Progress.finishLive();
                    Files.deleteIfExists(destination);
                    allowResume = false;
                    if (log != null) {
                        log.accept("下载过慢 " + host(candidate) + "（"
                                + Progress.formatSize(error.speedBps) + "/s），换加速源");
                    }
                } catch (Exception error) {
                    Progress.finishLive();
                    Files.deleteIfExists(destination);
                    allowResume = false;
                    last = error;
                    if (!lastTry && log != null) {
                        log.accept("通道失败 " + host(candidate) + "，换加速源");
                    }
                }
            }
        }
        if (last != null) {
            throw last;
        }
        throw new IllegalStateException("下载失败 " + label);
    }

    static List<String> downloadUrls(String url) {
        List<String> urls = new ArrayList<>();
        if (url == null || url.isBlank()) {
            return urls;
        }
        if (isGithubDownload(url) && !alreadyProxied(url)) {
            for (String prefix : GITHUB_PROXIES) {
                urls.add(prefix + url);
            }
        }
        urls.add(url);
        return urls;
    }

    static String officialGithub(String url) {
        if (url == null || url.isBlank()) {
            return url;
        }
        for (String prefix : GITHUB_PROXIES) {
            if (url.regionMatches(true, 0, prefix, 0, prefix.length())) {
                String rest = url.substring(prefix.length());
                if (rest.startsWith("http://") || rest.startsWith("https://")) {
                    return rest;
                }
            }
        }
        return url;
    }

    static String keepProxied(String prefix, String location) {
        if (location == null || location.isBlank()) {
            return location;
        }
        if (alreadyProxied(location)) {
            return location;
        }
        if (prefix == null || prefix.isBlank()) {
            return location;
        }
        if (!prefix.endsWith("/")) {
            prefix = prefix + "/";
        }
        return prefix + location;
    }

    static boolean isGithubDownload(String url) {
        if (url == null) {
            return false;
        }
        String lower = url.toLowerCase(Locale.ROOT);
        return lower.contains("github.com/") || lower.contains("githubusercontent.com/");
    }

    static boolean alreadyProxied(String url) {
        if (url == null) {
            return false;
        }
        String lower = url.toLowerCase(Locale.ROOT);
        for (String prefix : GITHUB_PROXIES) {
            if (lower.startsWith(prefix)) {
                return true;
            }
        }
        return lower.contains("ghproxy.") || lower.contains("ghfast.") || lower.contains("gh-proxy.")
                || lower.contains("moeyy.") || lower.contains("llkk.");
    }

    private static long download(String url, Map<String, String> headers, Path destination, long expected,
                                 String label, Consumer<String> log, boolean resume, boolean maySwitch,
                                 boolean rangeOnly, boolean parallel) throws Exception {
        long size = expected;
        boolean ranged = false;
        String resolved = url;
        HttpURLConnection probe = connect(url, headers, 0, 1);
        try {
            int code = probe.getResponseCode();
            if (code >= 400) {
                throw new IllegalStateException("下载失败: " + code);
            }
            ranged = code == 206;
            if (size <= 0) {
                size = parseTotal(probe, code);
            }
            resolved = probe.getURL().toString();
        } finally {
            probe.disconnect();
        }
        if (parallel && ranged && size >= PARALLEL_MIN) {
            int lanes = 0;
            String laneHeader = null;
            for (Map.Entry<String, String> entry : headers.entrySet()) {
                if ("x-cdr-lanes".equalsIgnoreCase(entry.getKey())) {
                    laneHeader = entry.getValue();
                }
            }
            if (laneHeader != null) {
                try {
                    lanes = Integer.parseInt(laneHeader.trim());
                } catch (NumberFormatException ignored) {
                    lanes = 0;
                }
            }
            if (log != null) {
                int shown = lanes >= 2 ? lanes : PARALLEL_PARTS;
                log.accept("多线程下载 " + label + " · " + shown + " 线程 · " + host(resolved));
            }
            try {
                return pullParallel(resolved, headers, destination, size, label, log, maySwitch, lanes);
            } catch (NoRange ignored) {
                Files.deleteIfExists(destination);
                if (rangeOnly) {
                    throw new NoRange();
                }
                if (log != null) {
                    log.accept("通道不支持分段，改单线程 " + host(resolved));
                }
            }
        } else if (rangeOnly) {
            throw new NoRange();
        }
        return pull(url, headers, destination, size, label, log, resume, maySwitch);
    }

    private static long parseTotal(HttpURLConnection conn, int code) {
        String range = conn.getHeaderField("Content-Range");
        if (range != null) {
            int slash = range.lastIndexOf('/');
            if (slash >= 0 && slash + 1 < range.length()) {
                try {
                    return Long.parseLong(range.substring(slash + 1).trim());
                } catch (NumberFormatException ignored) {
                    // fall through
                }
            }
        }
        if (code == 200) {
            return conn.getContentLengthLong();
        }
        return -1;
    }

    private static long pull(String url, Map<String, String> headers, Path destination, long expected,
                             String label, Consumer<String> log, boolean resume, boolean maySwitch) throws Exception {
        long existing = resume && Files.isRegularFile(destination) ? Files.size(destination) : 0;
        HttpURLConnection conn = connect(url, headers, existing, -1);
        try {
            int code = conn.getResponseCode();
            if (code >= 400) {
                throw new IllegalStateException("下载失败: " + code);
            }
            boolean append = resume && existing > 0 && code == 206;
            if (resume && existing > 0 && code == 200) {
                Files.deleteIfExists(destination);
                existing = 0;
                append = false;
            }
            long total = expected;
            if (total <= 0) {
                long length = conn.getContentLengthLong();
                if (length > 0) {
                    total = existing + length;
                }
            }
            Progress.ensure(label, total);
            Progress.bytes(existing);
            Progress.flight(label, existing);
            Progress.live(true);
            if (log != null && existing > 0) {
                log.accept("继续下载 " + label + "（" + Progress.formatSize(existing)
                        + (total > 0 ? "/" + Progress.formatSize(total) : "") + "）");
            }
            StandardOpenOption[] options = append
                    ? new StandardOpenOption[]{StandardOpenOption.WRITE, StandardOpenOption.APPEND}
                    : new StandardOpenOption[]{StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE};
            long done = existing;
            StallWatch watch = new StallWatch(maySwitch && (total <= 0 || total >= PARALLEL_MIN));
            try (InputStream in = new BufferedInputStream(conn.getInputStream(), 1024 * 1024);
                 OutputStream out = new BufferedOutputStream(Files.newOutputStream(destination, options), 1024 * 1024)) {
                byte[] buf = new byte[1024 * 1024];
                int n;
                while ((n = in.read(buf)) >= 0) {
                    out.write(buf, 0, n);
                    done += n;
                    Progress.bytes(done);
                    Progress.flight(label, done);
                    Progress.live();
                    watch.note(done);
                }
            }
            Progress.bytes(done);
            Progress.flight(label, done);
            Progress.live(true);
            Progress.finishLive();
            if (expected > 0 && done != expected) {
                throw new IllegalStateException("下载不完整 " + label + "（" + done + "/" + expected + " 字节）");
            }
            if (log != null) {
                String via = host(url);
                log.accept("下载完成 " + label + " (" + Progress.formatSize(done) + (via.isBlank() ? "" : " · " + via) + ")");
            }
            return done;
        } finally {
            conn.disconnect();
        }
    }

    private static int pieceCount(long total) {
        long bySize = Math.max(1, (total + 512 * 1024 - 1) / (512 * 1024));
        return (int) Math.min(1024, Math.max(PARALLEL_PARTS, bySize));
    }

    private static long pullParallel(String url, Map<String, String> headers, Path destination, long total,
                                     String label, Consumer<String> log, boolean maySwitch) throws Exception {
        return pullParallel(url, headers, destination, total, label, log, maySwitch, 0);
    }

    private static long pullParallel(String url, Map<String, String> headers, Path destination, long total,
                                     String label, Consumer<String> log, boolean maySwitch, int lanes) throws Exception {
        int pieces = lanes >= 2 ? lanes : pieceCount(total);
        long pieceSize = (total + pieces - 1) / pieces;
        if (pieceSize <= 0) {
            return pull(url, headers, destination, total, label, log, false, maySwitch);
        }
        Files.deleteIfExists(destination);
        Progress.ensure(label, total);
        Progress.bytes(0);
        Progress.flight(label, 0);
        Progress.live(true);
        ConcurrentLinkedQueue<long[]> queue = new ConcurrentLinkedQueue<>();
        for (int i = 0; i < pieces; i++) {
            long start = i * pieceSize;
            if (start >= total) {
                break;
            }
            queue.add(new long[]{start, Math.min(total, start + pieceSize) - 1});
        }
        int workers = lanes >= 2 ? Math.min(lanes, queue.size()) : Math.min(PARALLEL_PARTS, queue.size());
        AtomicLong done = new AtomicLong();
        StallWatch watch = new StallWatch(maySwitch);
        ExecutorService pool = Executors.newFixedThreadPool(workers);
        List<Future<?>> jobs = new ArrayList<>();
        try (RandomAccessFile raf = new RandomAccessFile(destination.toFile(), "rw")) {
            raf.setLength(total);
            FileChannel channel = raf.getChannel();
            for (int i = 0; i < workers; i++) {
                jobs.add(pool.submit(() -> {
                    long[] piece;
                    while ((piece = queue.poll()) != null) {
                        if (Thread.currentThread().isInterrupted()) {
                            throw new InterruptedException();
                        }
                        watch.check();
                        copyRange(url, headers, channel, piece[0], piece[1], done, watch, label);
                    }
                    return null;
                }));
            }
            for (Future<?> job : jobs) {
                try {
                    job.get();
                } catch (ExecutionException error) {
                    queue.clear();
                    Throwable cause = error.getCause() == null ? error : error.getCause();
                    if (cause instanceof SlowDownload) {
                        throw (SlowDownload) cause;
                    }
                    if (cause instanceof NoRange) {
                        throw (NoRange) cause;
                    }
                    if (cause instanceof Exception) {
                        throw (Exception) cause;
                    }
                    throw error;
                }
            }
            channel.force(false);
            Progress.bytes(total);
            Progress.flight(label, total);
            Progress.live(true);
            Progress.finishLive();
            if (log != null) {
                log.accept("下载完成 " + label + " (" + Progress.formatSize(total) + " · " + host(url) + ")");
            }
            return total;
        } finally {
            pool.shutdownNow();
        }
    }

    private static void copyRange(String url, Map<String, String> headers, FileChannel channel, long start, long end,
                                  AtomicLong done, StallWatch watch, String label) throws Exception {
        Exception last = null;
        for (int attempt = 1; attempt <= 4; attempt++) {
            watch.check();
            try {
                copyRangeOnce(url, headers, channel, start, end, done, watch, label);
                return;
            } catch (NoRange | SlowDownload | InterruptedException error) {
                throw error;
            } catch (Exception error) {
                last = error;
                if (attempt == 4) {
                    break;
                }
                Thread.sleep(400L * attempt);
            }
        }
        if (last != null) {
            throw last;
        }
        throw new IOException("分段失败");
    }

    private static void copyRangeOnce(String url, Map<String, String> headers, FileChannel channel, long start, long end,
                                      AtomicLong done, StallWatch watch, String label) throws Exception {
        HttpURLConnection conn = connect(url, headers, start, end);
        long want = end - start + 1;
        long got = 0;
        try {
            int code = conn.getResponseCode();
            if (code != 206) {
                throw new NoRange();
            }
            long pos = start;
            try (InputStream in = new BufferedInputStream(conn.getInputStream(), 64 * 1024)) {
                byte[] buf = new byte[64 * 1024];
                int n;
                while ((n = in.read(buf)) >= 0) {
                    int take = n;
                    if (got + take > want) {
                        take = (int) (want - got);
                    }
                    if (take <= 0) {
                        break;
                    }
                    ByteBuffer buffer = ByteBuffer.wrap(buf, 0, take);
                    while (buffer.hasRemaining()) {
                        int written = channel.write(buffer, pos);
                        if (written <= 0) {
                            throw new IOException("磁盘写入失败");
                        }
                        pos += written;
                    }
                    got += take;
                    long now = done.addAndGet(take);
                    Progress.bytes(now);
                    Progress.flight(label, now);
                    Progress.live();
                    watch.note(now);
                    if (got >= want) {
                        break;
                    }
                }
            }
            if (got != want) {
                throw new IllegalStateException("分段不完整 " + got + "/" + want);
            }
        } catch (NoRange | SlowDownload error) {
            throw error;
        } catch (Exception error) {
            if (got > 0) {
                done.addAndGet(-got);
            }
            throw error;
        } finally {
            conn.disconnect();
        }
    }

    private static HttpURLConnection connect(String url, Map<String, String> headers, long start, long endInclusive)
            throws IOException {
        String current = url;
        String prefix = proxyPrefix(current);
        for (int hop = 0; hop < 10; hop++) {
            HttpURLConnection conn = openRaw(current, headers, start, endInclusive, useDirect(current));
            int code = conn.getResponseCode();
            if (code != 301 && code != 302 && code != 303 && code != 307 && code != 308) {
                return conn;
            }
            String location = conn.getHeaderField("Location");
            conn.disconnect();
            if (location == null || location.isBlank()) {
                throw new IOException("重定向没有 Location");
            }
            location = URI.create(current).resolve(location).toString();
            if (prefix != null && isGithubDownload(location)) {
                location = keepProxied(prefix, location);
            }
            current = location;
            if (prefix == null) {
                prefix = proxyPrefix(current);
            }
        }
        throw new IOException("重定向过多");
    }

    private static HttpURLConnection openRaw(String url, Map<String, String> headers, long start, long endInclusive,
                                             boolean direct) throws IOException {
        URI uri = URI.create(url);
        Proxy proxy = Proxy.NO_PROXY;
        if (!direct) {
            try {
                List<Proxy> proxies = proxySelector().select(uri);
                if (proxies != null && !proxies.isEmpty() && proxies.get(0).type() != Proxy.Type.DIRECT) {
                    proxy = proxies.get(0);
                }
            } catch (Exception ignored) {
                // use direct
            }
        }
        HttpURLConnection conn = (HttpURLConnection) uri.toURL().openConnection(proxy);
        conn.setInstanceFollowRedirects(false);
        conn.setConnectTimeout(8_000);
        conn.setReadTimeout(20_000);
        conn.setUseCaches(false);
        conn.setRequestMethod("GET");
        headers.forEach(conn::setRequestProperty);
        conn.setRequestProperty("Accept-Encoding", "identity");
        if (endInclusive >= start && endInclusive >= 0) {
            conn.setRequestProperty("Range", "bytes=" + start + "-" + endInclusive);
            conn.setRequestProperty("Connection", "close");
        } else if (start > 0) {
            conn.setRequestProperty("Range", "bytes=" + start + "-");
            conn.setRequestProperty("Connection", "close");
        }
        if (conn instanceof HttpsURLConnection https) {
            SSLContext ssl = sslContext();
            if (ssl != null) {
                https.setSSLSocketFactory(ssl.getSocketFactory());
            }
            if (insecureSsl()) {
                https.setHostnameVerifier((host, session) -> true);
            }
        }
        return conn;
    }

    private static boolean useDirect(String url) {
        return alreadyProxied(url);
    }

    static String proxyPrefix(String url) {
        if (url == null) {
            return null;
        }
        String lower = url.toLowerCase(Locale.ROOT);
        for (String prefix : GITHUB_PROXIES) {
            if (lower.startsWith(prefix)) {
                return prefix;
            }
        }
        return null;
    }

    private static String host(String url) {
        try {
            String host = URI.create(url).getHost();
            return host == null ? "" : host;
        } catch (Exception ignored) {
            return "";
        }
    }

    private static boolean insecureSsl() {
        return "true".equalsIgnoreCase(System.getProperty("cdr.ssl.insecure"))
                || "1".equals(System.getenv("CDR_SSL_INSECURE"));
    }

    private static void deletePartFiles(Path destination) {
        if (destination == null || destination.getParent() == null || destination.getFileName() == null) {
            return;
        }
        String name = destination.getFileName().toString();
        try (java.nio.file.DirectoryStream<Path> stream = Files.newDirectoryStream(destination.getParent(), name + ".p*")) {
            for (Path part : stream) {
                Files.deleteIfExists(part);
            }
        } catch (Exception ignored) {
            // leftover parts are optional
        }
    }

    private static final class StallWatch {
        private final boolean enabled;
        private boolean armed;
        private long lastNs;
        private long lastBytes;

        StallWatch(boolean enabled) {
            this.enabled = enabled;
        }

        synchronized void note(long done) {
            if (!enabled || done <= lastBytes) {
                return;
            }
            lastBytes = done;
            lastNs = System.nanoTime();
            armed = true;
        }

        synchronized void check() throws SlowDownload {
            if (!enabled || !armed) {
                return;
            }
            if (System.nanoTime() - lastNs < IDLE_NS) {
                return;
            }
            throw new SlowDownload(0);
        }
    }

    private static final class NoRange extends IOException {
        NoRange() {
            super("no range");
        }
    }

    private static final class SlowDownload extends IOException {
        final long speedBps;

        SlowDownload(long speedBps) {
            super("too slow");
            this.speedBps = Math.max(0, speedBps);
        }
    }

    static synchronized HttpClient http() {
        if (client == null) {
            HttpClient.Builder builder = HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_1_1)
                    .followRedirects(HttpClient.Redirect.NORMAL)
                    .connectTimeout(Duration.ofSeconds(30))
                    .proxy(proxySelector());
            SSLContext ssl = sslContext();
            if (ssl != null) {
                builder.sslContext(ssl);
            }
            client = builder.build();
        }
        return client;
    }

    static ProxySelector proxySelector() {
        String proxy = firstEnv("HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy", "ALL_PROXY", "all_proxy");
        if (proxy != null && !proxy.isBlank()) {
            URI uri = URI.create(proxy.contains("://") ? proxy : "http://" + proxy);
            int port = uri.getPort() > 0 ? uri.getPort() : 80;
            return ProxySelector.of(new InetSocketAddress(uri.getHost(), port));
        }
        return ProxySelector.getDefault();
    }

    private static SSLContext sslContext() {
        try {
            SSLContext context = SSLContext.getInstance("TLS");
            context.init(null, trustManagers(), null);
            return context;
        } catch (Exception error) {
            System.err.println("[CDR Updater] 无法加载系统证书: " + error.getMessage());
            return null;
        }
    }

    private static TrustManager[] trustManagers() throws Exception {
        if ("true".equalsIgnoreCase(System.getProperty("cdr.ssl.insecure"))
                || "1".equals(System.getenv("CDR_SSL_INSECURE"))) {
            System.err.println("[CDR Updater] 已关闭 HTTPS 证书校验（cdr.ssl.insecure）。");
            return new TrustManager[]{new InsecureTrust()};
        }
        TrustManagerFactory factory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
        if (isWindows()) {
            KeyStore windows = KeyStore.getInstance("Windows-ROOT");
            windows.load(null, null);
            factory.init(windows);
        } else {
            factory.init((KeyStore) null);
        }
        return factory.getTrustManagers();
    }

    private static boolean isWindows() {
        return System.getProperty("os.name", "").toLowerCase().contains("win");
    }

    private static String firstEnv(String... names) {
        for (String name : names) {
            String value = System.getenv(name);
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private static final class InsecureTrust implements X509TrustManager {
        @Override
        public void checkClientTrusted(X509Certificate[] chain, String authType) {
        }

        @Override
        public void checkServerTrusted(X509Certificate[] chain, String authType) {
        }

        @Override
        public X509Certificate[] getAcceptedIssuers() {
            return new X509Certificate[0];
        }
    }
}
