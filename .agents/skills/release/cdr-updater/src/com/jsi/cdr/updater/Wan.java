package com.jsi.cdr.updater;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;
import java.util.function.Consumer;

final class Wan {
    private Wan() {}

    static final class Address {
        final String iface;
        final String ip;
        final String kind;

        Address(String iface, String ip, String kind) {
            this.iface = iface;
            this.ip = ip;
            this.kind = kind;
        }
    }

    static final class Report {
        final List<Address> addresses;
        final String publicIp;
        final String suggestedUrl;

        Report(List<Address> addresses, String publicIp, String suggestedUrl) {
            this.addresses = addresses;
            this.publicIp = publicIp;
            this.suggestedUrl = suggestedUrl;
        }
    }

    static Report discover(int port, Consumer<String> log) {
        List<Address> addresses = localAddresses();
        for (Address address : addresses) {
            log.accept("网卡 " + address.iface + "  " + address.ip + "  (" + kindLabel(address.kind) + ")");
        }
        String nicPublic = firstKind(addresses, "public");
        String queried = queryPublicIp(log);
        String publicIp = queried != null && !queried.isBlank() ? queried : nicPublic;
        if (publicIp != null && !publicIp.isBlank()) {
            log.accept("外网 IP " + publicIp);
        } else {
            log.accept("没有检测到公网 IP。如果这台机器在路由器后面，需要做端口映射或内网穿透。");
        }
        String url = null;
        if (publicIp != null && !publicIp.isBlank()) {
            url = "http://" + publicIp + ":" + port;
        } else {
            String overlay = overlayIp(addresses);
            if (overlay != null) {
                url = "http://" + overlay + ":" + port;
                log.accept("暂用 VPN/Tailscale 地址 " + url);
            } else {
                String lan = firstKind(addresses, "lan");
                if (lan != null) {
                    url = "http://" + lan + ":" + port;
                    log.accept("暂用局域网地址 " + url);
                }
            }
        }
        return new Report(addresses, publicIp == null ? "" : publicIp, url == null ? "" : url);
    }

    static String overlayIp(List<Address> addresses) {
        String tailscale = firstKind(addresses, "tailscale");
        if (tailscale != null) {
            return tailscale;
        }
        return firstKind(addresses, "vpn");
    }

    static List<Address> localAddresses() {
        List<Address> addresses = new ArrayList<>();
        try {
            Enumeration<NetworkInterface> ifaces = NetworkInterface.getNetworkInterfaces();
            while (ifaces != null && ifaces.hasMoreElements()) {
                NetworkInterface iface = ifaces.nextElement();
                if (!iface.isUp() || iface.isLoopback()) {
                    continue;
                }
                Enumeration<InetAddress> ips = iface.getInetAddresses();
                while (ips.hasMoreElements()) {
                    InetAddress ip = ips.nextElement();
                    if (!(ip instanceof Inet4Address) || ip.isLoopbackAddress() || ip.isLinkLocalAddress()) {
                        continue;
                    }
                    String host = ip.getHostAddress();
                    addresses.add(new Address(iface.getDisplayName(), host, classify(iface.getDisplayName(), host)));
                }
            }
        } catch (Exception ignored) {
            // keep empty
        }
        return addresses;
    }

    static String classify(String ifaceName, String ip) {
        String name = ifaceName == null ? "" : ifaceName.toLowerCase(Locale.ROOT);
        if (name.contains("tailscale")) {
            return "tailscale";
        }
        if (name.contains("radmin") || name.contains("hamachi") || name.contains("zerotier") || name.contains("vpn")) {
            return "vpn";
        }
        if (isPublicIpv4(ip)) {
            return "public";
        }
        return "lan";
    }

    static boolean isPublicIpv4(String ip) {
        int[] parts = octets(ip);
        if (parts == null) {
            return false;
        }
        int a = parts[0];
        int b = parts[1];
        if (a == 10 || a == 127 || a == 0 || a == 255) {
            return false;
        }
        if (a == 169 && b == 254) {
            return false;
        }
        if (a == 192 && b == 168) {
            return false;
        }
        if (a == 172 && b >= 16 && b <= 31) {
            return false;
        }
        if (a == 100 && b >= 64 && b <= 127) {
            return false;
        }
        return true;
    }

    static boolean openFirewall(int port, Consumer<String> log) {
        if (!System.getProperty("os.name", "").toLowerCase(Locale.ROOT).contains("win")) {
            log.accept("当前不是 Windows，请自行在防火墙放行 TCP " + port);
            return false;
        }
        String name = "CDR Updater " + port;
        try {
            Process delete = new ProcessBuilder("netsh", "advfirewall", "firewall", "delete", "rule",
                    "name=" + name).redirectErrorStream(true).start();
            delete.waitFor();
            Process add = new ProcessBuilder("netsh", "advfirewall", "firewall", "add", "rule",
                    "name=" + name, "dir=in", "action=allow", "protocol=TCP", "localport=" + port, "profile=any")
                    .redirectErrorStream(true).start();
            String output = new String(add.getInputStream().readAllBytes());
            int code = add.waitFor();
            if (code == 0) {
                log.accept("已放行 Windows 防火墙入站 TCP " + port);
                return true;
            }
            log.accept("防火墙放行失败（可能需要以管理员运行更新服务器）: " + output.trim());
        } catch (Exception error) {
            log.accept("防火墙放行失败: " + error.getMessage());
        }
        return false;
    }

    private static String firstKind(List<Address> addresses, String kind) {
        for (Address address : addresses) {
            if (kind.equals(address.kind)) {
                return address.ip;
            }
        }
        return null;
    }

    private static String kindLabel(String kind) {
        return switch (kind) {
            case "public" -> "公网";
            case "lan" -> "局域网";
            case "tailscale" -> "Tailscale";
            case "vpn" -> "VPN";
            default -> kind;
        };
    }

    private static String queryPublicIp(Consumer<String> log) {
        for (String endpoint : new String[]{"https://api.ipify.org", "https://ifconfig.me/ip"}) {
            try {
                HttpRequest request = HttpRequest.newBuilder(URI.create(endpoint))
                        .header("User-Agent", "cdr-updater")
                        .timeout(Duration.ofSeconds(8))
                        .build();
                HttpResponse<String> response = Net.http().send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() < 400) {
                    String ip = response.body() == null ? "" : response.body().trim();
                    if (octets(ip) != null) {
                        return ip;
                    }
                }
            } catch (Exception error) {
                log.accept("查询 " + endpoint + " 失败: " + error.getMessage());
            }
        }
        return "";
    }

    private static int[] octets(String ip) {
        if (ip == null) {
            return null;
        }
        String[] parts = ip.trim().split("\\.");
        if (parts.length != 4) {
            return null;
        }
        int[] values = new int[4];
        try {
            for (int i = 0; i < 4; i++) {
                values[i] = Integer.parseInt(parts[i]);
                if (values[i] < 0 || values[i] > 255) {
                    return null;
                }
            }
        } catch (NumberFormatException ignored) {
            return null;
        }
        return values;
    }
}
