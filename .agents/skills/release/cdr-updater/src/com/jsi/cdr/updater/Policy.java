package com.jsi.cdr.updater;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

final class Policy {
    private Policy() {}

    static boolean shouldDeleteLocal(String path, Set<String> managedPaths) {
        String rel = Fs.posix(path);
        if (isSelf(rel) || PackPaths.protectedLocal(rel)) {
            return false;
        }
        return managed(managedPaths).contains(rel);
    }

    static boolean shouldOverwriteLocal(
            String path,
            String side,
            String localSha,
            String remoteSha,
            Map<String, String> syncedHashes
    ) {
        return shouldOverwriteLocal(path, side, localSha, remoteSha, syncedHashes, false, null, false);
    }

    static boolean shouldOverwriteLocal(
            String path,
            String side,
            String localSha,
            String remoteSha,
            Map<String, String> syncedHashes,
            boolean overlay
    ) {
        return shouldOverwriteLocal(path, side, localSha, remoteSha, syncedHashes, overlay, null, false);
    }

    static boolean shouldOverwriteLocal(
            String path,
            String side,
            String localSha,
            String remoteSha,
            Map<String, String> syncedHashes,
            boolean overlay,
            Boolean localHasManagedTag
    ) {
        return shouldOverwriteLocal(path, side, localSha, remoteSha, syncedHashes, overlay, localHasManagedTag, false);
    }

    static boolean shouldOverwriteLocal(
            String path,
            String side,
            String localSha,
            String remoteSha,
            Map<String, String> syncedHashes,
            boolean overlay,
            Boolean localHasManagedTag,
            boolean keepLocal
    ) {
        String rel = Fs.posix(path);
        if (isSelf(rel) || remoteSha == null || remoteSha.isBlank()) {
            return false;
        }
        if (localSha == null) {
            return true;
        }
        if (localSha.equals(remoteSha)) {
            return false;
        }
        if (PackPaths.taggedTemplate(rel)) {
            if (keepLocal) {
                return false;
            }
            if (!Boolean.TRUE.equals(localHasManagedTag)) {
                return true;
            }
            String previous = syncedHashes == null ? null : syncedHashes.get(rel);
            return previous != null && localSha.equals(previous);
        }
        if (overlay && !PackPaths.protectedLocal(rel)) {
            return true;
        }
        if (PackPaths.protectedLocal(rel)) {
            return false;
        }
        if (!"server".equals(side)) {
            return true;
        }
        String previous = syncedHashes == null ? null : syncedHashes.get(rel);
        if (previous == null) {
            return false;
        }
        return localSha.equals(previous);
    }

    private static boolean isSelf(String rel) {
        return "mods/cdr-updater.jar".equals(rel);
    }

    private static Set<String> managed(Set<String> managedPaths) {
        return managedPaths.stream().map(Fs::posix).collect(Collectors.toSet());
    }
}
