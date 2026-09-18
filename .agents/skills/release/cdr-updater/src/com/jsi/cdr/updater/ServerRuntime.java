package com.jsi.cdr.updater;

import com.sun.net.httpserver.HttpServer;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

final class ServerRuntime {
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
            .withZone(ZoneId.systemDefault());
    private static final int LOG_CAP = 500;

    final Path configPath;
    private volatile Pack.Config config;
    volatile HttpServer http;
    private final Object lock = new Object();
    private volatile boolean busy;
    private final List<String> logLines = new ArrayList<>();

    ServerRuntime(Path configPath, Pack.Config config) {
        this.configPath = configPath;
        this.config = config;
    }

    Pack.Config config() {
        return config;
    }

    boolean busy() {
        return busy;
    }

    void note(String line) {
        if (line == null || line.isBlank()) {
            return;
        }
        String stamped = TIME.format(Instant.now()) + "  " + line;
        synchronized (logLines) {
            logLines.add(stamped);
            if (logLines.size() > LOG_CAP) {
                logLines.subList(0, logLines.size() - 400).clear();
            }
        }
    }

    Consumer<String> logger() {
        return line -> {
            note(line);
            System.out.println(line);
        };
    }

    List<String> logs() {
        synchronized (logLines) {
            return List.copyOf(logLines);
        }
    }

    void rebuild(Consumer<String> log) throws Exception {
        synchronized (lock) {
            busy = true;
            try {
                Pack.purgeIncomplete(config, log);
                Pack.buildRepos(config, log);
            } finally {
                busy = false;
            }
        }
    }

    void setOfficialVersion(String version, Consumer<String> log) throws Exception {
        String tag = version == null ? "" : version.trim();
        if (tag.isBlank()) {
            throw new IllegalArgumentException("版本不能为空");
        }
        synchronized (lock) {
            busy = true;
            try {
                if (configPath != null && Files.isRegularFile(configPath)) {
                    Toml.setTableString(configPath, "official", "version", tag);
                    config = Pack.Config.load(configPath);
                } else {
                    config = config.withOfficialVersion(tag);
                }
                log.accept("已切换官方版本为 " + tag);
                Pack.purgeIncomplete(config, log);
                Pack.buildRepos(config, log);
            } finally {
                busy = false;
            }
        }
    }

    void addPrivate(Path source, String dest, String side, Consumer<String> log) throws Exception {
        synchronized (lock) {
            busy = true;
            try {
                Path stored = Privates.add(config, source, dest, side);
                log.accept("已添加私货 " + config.privateDir.relativize(stored));
                Pack.buildRepos(config, log);
            } finally {
                busy = false;
            }
        }
    }

    void removePrivate(String dest, Consumer<String> log) throws Exception {
        synchronized (lock) {
            busy = true;
            try {
                Privates.remove(config, dest);
                log.accept("已删除私货 " + dest);
                Pack.buildRepos(config, log);
            } finally {
                busy = false;
            }
        }
    }

    Path exportPcl2(Path output, Consumer<String> log) throws Exception {
        synchronized (lock) {
            busy = true;
            try {
                log.accept("正在导出 PCL2 整合包");
                Path zip = Pcl2Pack.export(config, Env.updaterJar(), output);
                log.accept("已导出 PCL2 客户端整合包: " + zip.toAbsolutePath());
                return zip;
            } finally {
                busy = false;
            }
        }
    }

    Path exportServer(Path output, Consumer<String> log) throws Exception {
        synchronized (lock) {
            busy = true;
            try {
                return ServerPack.export(config, Env.updaterJar(), output, log);
            } finally {
                busy = false;
            }
        }
    }

    void enableWan(Consumer<String> log) throws Exception {
        int port = Pack.Config.normalizePort(config.port);
        Wan.Report report = Wan.discover(port, log);
        boolean reachable = Wan.isPublicIpv4(report.publicIp) || Wan.overlayIp(report.addresses) != null;
        if (report.suggestedUrl == null || report.suggestedUrl.isBlank() || !reachable) {
            throw new IllegalArgumentException("没有检测到公网 IP 或 Tailscale/VPN。请手动填写对外地址（公网 IP 或域名），并在路由器把 TCP "
                    + port + " 映射到这台电脑。也可以用 Tailscale / 内网穿透。");
        }
        Wan.openFirewall(port, log);
        setConnection("0.0.0.0", port, report.suggestedUrl, config.accessToken, log);
        log.accept("外网客户端/服务端请使用 " + report.suggestedUrl);
        log.accept("若这台电脑在路由器后面，还要在路由器做端口映射：外网 TCP " + port + " → 这台电脑的局域网 IP:" + port);
    }

    void setConnection(String listen, int port, String publicUrl, Consumer<String> log) throws Exception {
        setConnection(listen, port, publicUrl, config.accessToken, log);
    }

    void setConnection(String listen, int port, String publicUrl, String accessToken, Consumer<String> log) throws Exception {
        String bind = Pack.Config.normalizeListen(listen);
        int bindPort = Pack.Config.normalizePort(port);
        String url = Pack.Config.normalizePublicUrl(publicUrl, bind, bindPort);
        String token = Pack.Config.normalizeAccessToken(accessToken);
        synchronized (lock) {
            busy = true;
            Pack.Config previous = config;
            HttpServer previousHttp = http;
            int currentPort = previous.port;
            if (previousHttp != null && currentPort <= 0) {
                currentPort = previousHttp.getAddress().getPort();
            }
            boolean rebind = !bind.equals(previous.listen) || bindPort != currentPort;
            try {
                if (configPath != null && Files.isRegularFile(configPath)) {
                    Toml.setTableString(configPath, "server", "listen", bind);
                    Toml.setTableInt(configPath, "server", "port", bindPort);
                    Toml.setTableString(configPath, "server", "public_url", url);
                    Toml.setTableString(configPath, "server", "access_token", token);
                    config = Pack.Config.load(configPath);
                } else {
                    config = previous.withConnection(bind, bindPort, url).withAccessToken(token);
                }
                if (rebind && previousHttp != null) {
                    previousHttp.stop(0);
                    http = null;
                    http = ApiServer.start(this);
                    log.accept("更新服务已改到 " + config.listen + ":" + config.port);
                }
                log.accept("客户端/服务端连接地址: " + config.updateServerUrl);
                if (config.accessToken.isBlank()) {
                    log.accept("未设置访问令牌，能访问端口的人都可以拉整合包。");
                } else {
                    log.accept("已启用访问令牌。重新导出后，新客户端/服务端会带上令牌。");
                }
                log.accept("已写入 config.toml。重新导出 PCL2/服务端后，新包会带上这个地址和令牌。");
                log.accept("已经装好的实例请改 cdr-updater.toml 里的 update_server / update_token，服务端还要改 user_jvm_args.txt 里 javaagent 后面的地址。");
            } catch (Exception error) {
                config = previous;
                if (configPath != null && Files.isRegularFile(configPath)) {
                    try {
                        Toml.setTableString(configPath, "server", "listen", previous.listen);
                        Toml.setTableInt(configPath, "server", "port", previous.port);
                        Toml.setTableString(configPath, "server", "public_url", previous.updateServerUrl);
                        Toml.setTableString(configPath, "server", "access_token", previous.accessToken);
                    } catch (Exception ignored) {
                        // keep original error
                    }
                }
                if (rebind && http == null) {
                    try {
                        http = ApiServer.start(this);
                    } catch (Exception ignored) {
                        // keep original error
                    }
                }
                throw error;
            } finally {
                busy = false;
            }
        }
    }
}
