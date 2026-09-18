package com.jsi.cdr.updater;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;
import java.net.InetSocketAddress;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.security.KeyStore;
import java.security.cert.X509Certificate;
import java.time.Duration;

final class Net {
    private static HttpClient client;

    private Net() {}

    static void installJvmDefaults() {
        if (System.getProperty("java.net.useSystemProxies") == null) {
            System.setProperty("java.net.useSystemProxies", "true");
        }
        if (isWindows() && System.getProperty("javax.net.ssl.trustStoreType") == null) {
            System.setProperty("javax.net.ssl.trustStoreType", "Windows-ROOT");
        }
    }

    static synchronized HttpClient http() {
        if (client == null) {
            HttpClient.Builder builder = HttpClient.newBuilder()
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
