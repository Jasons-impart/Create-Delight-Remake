package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func reclaimStorage(data, currentVersion string, dropExtracts bool) (string, error) {
	objectBytes, err := collectPacks(data, time.Now())
	if err != nil {
		return "", err
	}
	cacheItems := uint64(0)
	cacheCount, err := pruneCache(filepath.Join(data, "cache"), currentVersion, dropExtracts)
	if err != nil {
		return "", err
	}
	cacheItems += cacheCount
	if objectBytes == 0 && cacheItems == 0 {
		return "", nil
	}
	return fmt.Sprintf("已回收临时对象 %s，下载缓存 %d 项", formatSize(objectBytes), cacheItems), nil
}

func pruneCache(cache, currentVersion string, dropExtracts bool) (uint64, error) {
	info, err := os.Stat(cache)
	if err != nil || !info.IsDir() {
		return 0, nil
	}
	versions, err := os.ReadDir(cache)
	if err != nil {
		return 0, err
	}
	var removed uint64
	for _, entry := range versions {
		if !entry.IsDir() {
			continue
		}
		path := filepath.Join(cache, entry.Name())
		if currentVersion != "" && entry.Name() != currentVersion {
			_ = os.RemoveAll(path)
			removed++
			continue
		}
		n, err := pruneCacheDir(path, dropExtracts)
		if err != nil {
			return removed, err
		}
		removed += n
	}
	return removed, nil
}

func pruneCacheDir(dir string, dropExtracts bool) (uint64, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return 0, nil
	}
	var removed uint64
	for _, entry := range entries {
		name := entry.Name()
		drop := strings.HasSuffix(name, ".partial") ||
			strings.HasSuffix(name, ".cdrtmp") ||
			strings.HasSuffix(name, ".parts") ||
			(dropExtracts && (name == "client-raw" || name == "server-raw" || strings.HasSuffix(name, ".complete")))
		if !drop {
			continue
		}
		_ = os.RemoveAll(filepath.Join(dir, name))
		removed++
	}
	return removed, nil
}

func isObjectHash(value string) bool {
	if len(value) != 64 {
		return false
	}
	for i := 0; i < len(value); i++ {
		c := value[i]
		if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')) {
			return false
		}
	}
	return !strings.ContainsAny(value, "/.\\")
}
