package com.jsi.cdr.updater;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Forge / javaagent 在游戏启动时调用。找到随整合包带上的本机程序并执行同步，
 * 玩家不需要自己打开更新器。
 */
final class LoadedUpdater {
    private LoadedUpdater() {}

    static Sync.Result update(Path instance, String server, String side) throws Exception {
        String token = LaunchHook.updateToken(instance);
        return Sync.apply(instance, side, new Sync.Client(server, side, instance, token), System.out::println);
    }

    static Path binary(Path instance, String side) throws Exception {
        boolean headless = "server".equals(side);
        String resource;
        String fileName;
        if (isWindows()) {
            resource = headless ? "native/windows/cdr-updater-server.exe" : "native/windows/cdr-updater.exe";
            fileName = headless ? "cdr-updater-server.exe" : "cdr-updater.exe";
        } else {
            resource = headless ? "native/linux/cdr-updater-server" : "native/linux/cdr-updater";
            fileName = headless ? "cdr-updater-server" : "cdr-updater";
        }
        Path cached = instance.resolve(".cdr").resolve(fileName);
        try (InputStream input = LoadedUpdater.class.getClassLoader().getResourceAsStream(resource)) {
            if (input != null) {
                Files.createDirectories(cached.getParent());
                Path temp = cached.resolveSibling(fileName + ".part");
                Files.copy(input, temp, StandardCopyOption.REPLACE_EXISTING);
                if (!Files.isRegularFile(cached) || Files.size(cached) != Files.size(temp)) {
                    Files.move(temp, cached, StandardCopyOption.REPLACE_EXISTING);
                } else {
                    Files.deleteIfExists(temp);
                }
                return cached;
            }
        }
        if (Files.isRegularFile(cached)) {
            return cached;
        }
        Path jar = LaunchHook.updaterJar();
        if (jar != null && jar.getParent() != null) {
            Path beside = jar.getParent().getParent() == null
                    ? jar.getParent().resolve(fileName)
                    : jar.getParent().getParent().resolve(".cdr").resolve(fileName);
            if (Files.isRegularFile(beside)) {
                return beside;
            }
            Path mods = jar.getParent().resolve(fileName);
            if (Files.isRegularFile(mods)) {
                return mods;
            }
        }
        return null;
    }

    private static boolean isWindows() {
        return System.getProperty("os.name", "").toLowerCase(Locale.ROOT).contains("win");
    }
}
