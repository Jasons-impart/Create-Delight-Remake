package com.jsi.cdr.updater;

import java.util.Locale;
import java.util.Set;

final class PackPaths {
    static final String[] ASSET_DIRS = {"mods", "resourcepacks", "shaderpacks", "tacz"};

    private static final Set<String> CLIENT_ONLY_FILES = Set.of(
            "options.txt", ".options.txt", "hmclversion.cfg", ".hmclversion.cfg",
            "client_jvm_args.example.txt", "kubejs/config/client.properties");
    private static final String[] CLIENT_ONLY_PREFIXES = {
            "resourcepacks/", "shaderpacks/", "config/fancymenu/", "config/iris/",
            "config/oculus/", "config/sodium/", "config/embeddium/", "config/jei/",
            "kubejs/client_scripts/", "kubejs/client_resources/"
    };
    private static final Set<String> SERVER_ONLY_FILES = Set.of(
            "start.bat", "start.sh", "user_jvm_args.txt", "server.properties",
            "forge.jar", "run.bat", "run.sh", "unix_args.txt", "win_args.txt", "eula.txt");
    private static final String[] SERVER_ONLY_PREFIXES = {
            "libraries/", "kubejs/server_scripts/"
    };
    private static final String[] SKIP_PREFIXES = {
            ".git/", ".agents/", ".codex/", ".github/", ".cache/", "CDC-mod-src/",
            "docs/", "scripts/", "logs/", "crash-reports/", "saves/",
            "world/", "world_nether/", "world_the_end/", "repos/", "data/", "private/"
    };
    private static final Set<String> SKIP_FILES = Set.of(
            ".gitignore", ".gitmodules", "packwiz", "packwiz.exe", "packwiz.json",
            "packwiz-installer.jar", "index.toml", "README.md", "GettingStarted.md",
            "DevGuide.md", "AGENTS.md", "TODOlist.md", "KubeJSStyleGuide.md",
            "ModList0.4a.md", "index.html", "cdr-updater-state.json");
    private static final Set<String> PROTECTED_FILES = Set.of(
            "server.properties", "banned-ips.json", "banned-players.json", "ops.json",
            "whitelist.json", "usercache.json", "cdr-updater-state.json", "cdr-updater.toml",
            "options.txt", "optionsof.txt", "optionsshaders.txt", "servers.dat", "usernamecache.json",
            "eula.txt", "user_jvm_args.txt");
    private static final String[] PROTECTED_PREFIXES = {
            "saves/", "world/", "world_nether/", "world_the_end/", "logs/",
            "crash-reports/", "libraries/", "versions/", "screenshots/",
            "replay_recordings/", "journeymap/", "XaeroWorldMap/", "XaeroWaypoints/", "local/",
            "config/", "defaultconfigs/"
    };

    private PackPaths() {}

    static boolean isModPayload(String rel) {
        String path = Fs.posix(rel);
        return path.startsWith("mods/") && path.toLowerCase(Locale.ROOT).endsWith(".jar");
    }

    static String kind(String rel) {
        String path = Fs.posix(rel);
        if (isModPayload(path)) {
            return "mod";
        }
        if (path.startsWith("resourcepacks/")) {
            return "resourcepack";
        }
        if (path.startsWith("shaderpacks/")) {
            return "shaderpack";
        }
        if (path.startsWith("tacz/")) {
            return "tacz";
        }
        if (path.startsWith("config/") || path.startsWith("defaultconfigs/")) {
            return "config";
        }
        if (path.startsWith("kubejs/")) {
            return "kubejs";
        }
        return "other";
    }

    static boolean skipUnified(String rel) {
        String path = Fs.posix(rel);
        if (SKIP_FILES.contains(Fs.fileName(path))) {
            return true;
        }
        for (String prefix : SKIP_PREFIXES) {
            if (path.startsWith(prefix)) {
                return true;
            }
        }
        return path.endsWith(".log");
    }

    static String defaultSide(String rel) {
        String path = Fs.posix(rel);
        if (CLIENT_ONLY_FILES.contains(path) || startsWithAny(path, CLIENT_ONLY_PREFIXES)) {
            return "client";
        }
        if (SERVER_ONLY_FILES.contains(path) || startsWithAny(path, SERVER_ONLY_PREFIXES)) {
            return "server";
        }
        return "both";
    }

    static boolean protectedLocal(String rel) {
        String path = Fs.posix(rel);
        return PROTECTED_FILES.contains(path) || startsWithAny(path, PROTECTED_PREFIXES);
    }

    private static boolean startsWithAny(String path, String[] prefixes) {
        for (String prefix : prefixes) {
            if (path.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }
}
