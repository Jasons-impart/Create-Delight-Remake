package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const packTTL = 2 * time.Hour
const packBudget int64 = 4 << 30
const diskReserve int64 = 2 << 30

func manifestRefs(data string) (map[string]struct{}, error) {
	refs := map[string]struct{}{}
	for _, side := range []string{"client", "server"} {
		buf, err := os.ReadFile(filepath.Join(data, "manifests", side+".json"))
		if err != nil {
			return nil, err
		}
		var doc struct {
			Files []struct {
				SHA256 string `json:"sha256"`
			} `json:"files"`
		}
		if err = json.Unmarshal(buf, &doc); err != nil {
			return nil, err
		}
		if doc.Files == nil {
			return nil, fmt.Errorf("清单缺少 files")
		}
		for _, f := range doc.Files {
			if !isObjectHash(f.SHA256) {
				return nil, errPackHash
			}
			refs[strings.ToLower(f.SHA256)] = struct{}{}
		}
	}
	if len(refs) == 0 {
		return nil, fmt.Errorf("清单为空，停止回收")
	}
	return refs, nil
}

type cachedPack struct {
	paths []string
	used  time.Time
}

// Caller holds packBuild. Validate all reference metadata before deleting.
func collectPacks(data string, now time.Time) (int64, error) {
	refs, err := manifestRefs(data)
	if err != nil {
		return 0, err
	}
	packs := filepath.Join(data, "packs")
	entries, err := os.ReadDir(packs)
	if err != nil && !os.IsNotExist(err) {
		return 0, err
	}
	groups := map[string]*cachedPack{}
	leftovers := []string{}
	for _, entry := range entries {
		if !entry.Type().IsRegular() {
			continue
		}
		path := filepath.Join(packs, entry.Name())
		if strings.HasSuffix(entry.Name(), ".json") {
			buf, e := os.ReadFile(path)
			if e != nil {
				return 0, e
			}
			var meta packMeta
			if e = json.Unmarshal(buf, &meta); e != nil {
				return 0, e
			}
			if !isObjectHash(meta.SHA256) {
				return 0, errPackHash
			}
			info, e := entry.Info()
			if e != nil {
				return 0, e
			}
			sum := strings.ToLower(meta.SHA256)
			group := groups[sum]
			if group == nil {
				group = &cachedPack{}
				groups[sum] = group
			}
			group.paths = append(group.paths, path)
			if info.ModTime().After(group.used) {
				group.used = info.ModTime()
			}
		} else if strings.HasPrefix(entry.Name(), "build-") || strings.HasSuffix(entry.Name(), ".tmp") {
			leftovers = append(leftovers, path)
		}
	}
	// Build a deletion plan first, including crash-orphaned objects and temp ZIPs.
	drops := []string{}
	err = filepath.WalkDir(filepath.Join(data, "objects"), func(path string, d os.DirEntry, e error) error {
		if e != nil {
			return e
		}
		if !d.Type().IsRegular() || !isObjectHash(d.Name()) {
			return nil
		}
		sum := strings.ToLower(d.Name())
		if _, ok := refs[sum]; ok {
			return nil
		}
		info, e := d.Info()
		if e != nil {
			return e
		}
		used := info.ModTime()
		if group := groups[sum]; group != nil && group.used.After(used) {
			used = group.used
		}
		if now.Sub(used) >= packTTL {
			drops = append(drops, path)
		}
		return nil
	})
	if err != nil && !os.IsNotExist(err) {
		return 0, err
	}
	for sum, group := range groups {
		info, e := os.Stat(filepath.Join(data, "objects", sum[:2], sum))
		if e != nil && !os.IsNotExist(e) {
			return 0, e
		}
		if e == nil && info.ModTime().After(group.used) {
			group.used = info.ModTime()
		}
		if now.Sub(group.used) >= packTTL {
			drops = append(drops, group.paths...)
		}
	}
	for _, path := range leftovers {
		info, e := os.Stat(path)
		if e != nil {
			return 0, e
		}
		if now.Sub(info.ModTime()) >= packTTL {
			drops = append(drops, path)
		}
	}
	var freed int64
	for _, path := range drops {
		info, e := os.Stat(path)
		if e != nil {
			return freed, e
		}
		if e = os.Remove(path); e != nil {
			return freed, e
		}
		freed += info.Size()
	}
	return freed, nil
}

func checkPackCapacity(used, needed, free int64) error {
	if needed < 0 || used < 0 || needed > packBudget || used > packBudget-needed {
		return fmt.Errorf("临时压缩包缓存已达 4 GiB 上限，请稍后重试或逐文件下载")
	}
	if free < diskReserve || needed > free-diskReserve {
		return fmt.Errorf("磁盘空间不足，需保留 2 GiB 可用空间")
	}
	return nil
}
func admitPack(data string, files []packItem) error {
	refs, err := manifestRefs(data)
	if err != nil {
		return err
	}
	var used int64
	for _, dir := range []string{"objects", "packs"} {
		err = filepath.WalkDir(filepath.Join(data, dir), func(path string, d os.DirEntry, e error) error {
			if e != nil {
				return e
			}
			if !d.Type().IsRegular() {
				return nil
			}
			if dir == "objects" {
				if _, ok := refs[d.Name()]; ok {
					return nil
				}
			}
			info, e := d.Info()
			if e != nil {
				return e
			}
			if info.Size() > packBudget-used {
				return fmt.Errorf("临时压缩包缓存已达 4 GiB 上限")
			}
			used += info.Size()
			return nil
		})
		if err != nil && !os.IsNotExist(err) {
			return err
		}
	}
	needed := int64(2 << 20)
	for _, f := range files {
		info, e := os.Stat(filepath.Join(data, "objects", f.SHA256[:2], f.SHA256))
		if e != nil {
			return e
		}
		size := info.Size()
		if size > packBudget {
			return fmt.Errorf("打包内容超过缓存上限")
		}
		needed += size + size/100 + 65536 + int64(2*len(f.Path))
		if needed > packBudget {
			return fmt.Errorf("打包内容超过缓存上限")
		}
	}
	free, err := freeDiskBytes(data)
	if err != nil {
		return err
	}
	return checkPackCapacity(used, needed, free)
}
