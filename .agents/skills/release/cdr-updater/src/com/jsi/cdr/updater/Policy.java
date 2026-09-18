package com.jsi.cdr.updater;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

final class Policy {
    private Policy() {}

    static boolean shouldDeleteLocal(String path, Set<String> managedPaths) {
        String rel = Fs.posix(path);
        if (PackPaths.protectedLocal(rel)) {
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
        String rel = Fs.posix(path);
        if (remoteSha == null || remoteSha.isBlank()) {
            return false;
        }
        if (localSha == null) {
            return true;
        }
        if (localSha.equals(remoteSha)) {
            return false;
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

    private static Set<String> managed(Set<String> managedPaths) {
        return managedPaths.stream().map(Fs::posix).collect(Collectors.toSet());
    }
}
