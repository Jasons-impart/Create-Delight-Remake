package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

func saveOfficialAdjust(r *http.Request) (any, error) {
	var body struct {
		Excludes []struct {
			Path string `json:"path"`
			Side string `json:"side"`
		} `json:"excludes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("无效的官方包调整数据")
	}
	data := liveDataPath()
	root := privateRoot(data)
	if err := os.MkdirAll(root, 0o755); err != nil {
		return nil, err
	}
	var b strings.Builder
	b.WriteString("# 官方包调整：排除的文件不会进入客户端/服务端仓库与清单。\n")
	b.WriteString("# side: both / client / server\n\n")
	seen := map[string]bool{}
	count := 0
	for _, row := range body.Excludes {
		path := filepath.ToSlash(strings.TrimSpace(row.Path))
		if path == "" || strings.Contains(path, "..") || filepath.IsAbs(path) {
			continue
		}
		side := normalizeAdjustSide(row.Side)
		key := path + "|" + side
		if seen[key] {
			continue
		}
		seen[key] = true
		b.WriteString("[[exclude]]\n")
		b.WriteString("path = " + tomlQuote(path) + "\n")
		b.WriteString("side = " + tomlQuote(side) + "\n\n")
		count++
	}
	file := filepath.Join(root, "official-adjust.toml")
	if err := os.WriteFile(file, []byte(b.String()), 0o644); err != nil {
		return nil, err
	}
	note(fmt.Sprintf("已保存官方包调整规则 %d 条", count))
	return map[string]any{"ok": true, "count": count}, nil
}

func listOfficialFiles(data string) []map[string]any {
	sides := loadOfficialSideMap(data)
	excluded, excludeSide := loadOfficialAdjust(privateRoot(data))
	rows := make([]map[string]any, 0, len(sides))
	for path, side := range sides {
		if skipOfficialList(path) {
			continue
		}
		isExcluded := excluded[path]
		row := map[string]any{
			"path":         path,
			"side":         side,
			"category":     categoryOf(path),
			"kind":         kindOf(path),
			"excluded":     isExcluded,
			"exclude_side": "",
		}
		if isExcluded {
			row["exclude_side"] = excludeSide[path]
		}
		rows = append(rows, row)
	}
	sort.Slice(rows, func(i, j int) bool {
		ci := strings.ToLower(fmt.Sprint(rows[i]["category"]))
		cj := strings.ToLower(fmt.Sprint(rows[j]["category"]))
		if ci != cj {
			return ci < cj
		}
		return strings.ToLower(fmt.Sprint(rows[i]["path"])) < strings.ToLower(fmt.Sprint(rows[j]["path"]))
	})
	return rows
}

func officialCategories(rows []map[string]any) []string {
	seen := map[string]bool{}
	out := []string{}
	for _, row := range rows {
		cat := fmt.Sprint(row["category"])
		if seen[cat] {
			continue
		}
		seen[cat] = true
		out = append(out, cat)
	}
	return out
}

func loadOfficialSideMap(data string) map[string]string {
	out := map[string]string{}
	buf, err := os.ReadFile(filepath.Join(data, "manifests", "official-side-map.json"))
	if err == nil {
		raw := map[string]any{}
		if json.Unmarshal(buf, &raw) == nil {
			for k, v := range raw {
				out[filepath.ToSlash(k)] = fmt.Sprint(v)
			}
			return out
		}
	}
	// fallback: scan repos
	for _, side := range []string{"client", "server"} {
		root := filepath.Join(data, "repos", side)
		_ = filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
			if err != nil || info.IsDir() {
				return nil
			}
			rel, err := filepath.Rel(root, path)
			if err != nil {
				return nil
			}
			rel = filepath.ToSlash(rel)
			if skipOfficialList(rel) {
				return nil
			}
			if _, ok := out[rel]; !ok {
				out[rel] = "both"
			}
			return nil
		})
	}
	return out
}

func loadOfficialAdjust(privateRoot string) (map[string]bool, map[string]string) {
	excluded := map[string]bool{}
	sides := map[string]string{}
	buf, err := os.ReadFile(filepath.Join(privateRoot, "official-adjust.toml"))
	if err != nil {
		return excluded, sides
	}
	var path, side string
	inExclude := false
	flush := func() {
		if path == "" {
			return
		}
		p := filepath.ToSlash(path)
		s := normalizeAdjustSide(side)
		excluded[p] = true
		sides[p] = s
		path, side = "", ""
	}
	for _, line := range strings.Split(string(buf), "\n") {
		trim := strings.TrimSpace(line)
		if i := strings.Index(trim, "#"); i >= 0 {
			trim = strings.TrimSpace(trim[:i])
		}
		if trim == "" {
			continue
		}
		if trim == "[[exclude]]" {
			flush()
			inExclude = true
			continue
		}
		if strings.HasPrefix(trim, "[") {
			flush()
			inExclude = false
			continue
		}
		if !inExclude {
			continue
		}
		if strings.HasPrefix(trim, "path") {
			path = tomlValue(trim)
		} else if strings.HasPrefix(trim, "side") {
			side = tomlValue(trim)
		}
	}
	flush()
	return excluded, sides
}

func normalizeAdjustSide(side string) string {
	switch strings.ToLower(strings.TrimSpace(side)) {
	case "client", "server", "both":
		return strings.ToLower(strings.TrimSpace(side))
	default:
		return "both"
	}
}

func categoryOf(path string) string {
	rel := filepath.ToSlash(path)
	slash := strings.Index(rel, "/")
	if slash <= 0 {
		return "根目录"
	}
	return rel[:slash]
}

func kindOf(path string) string {
	rel := strings.ToLower(filepath.ToSlash(path))
	switch {
	case strings.HasPrefix(rel, "mods/") && strings.HasSuffix(rel, ".jar"):
		return "mod"
	case strings.HasPrefix(rel, "config/") || strings.HasPrefix(rel, "defaultconfigs/"):
		return "config"
	case strings.HasPrefix(rel, "kubejs/"):
		return "kubejs"
	case strings.HasPrefix(rel, "resourcepacks/") || strings.HasPrefix(rel, "shaderpacks/"):
		return "resource"
	case strings.HasPrefix(rel, "libraries/"):
		return "library"
	default:
		return "other"
	}
}

func skipOfficialList(path string) bool {
	rel := filepath.ToSlash(path)
	return strings.HasSuffix(rel, ".pw.toml") || strings.HasSuffix(rel, ".side")
}

func tomlQuote(value string) string {
	escaped := strings.ReplaceAll(value, `\`, `\\`)
	escaped = strings.ReplaceAll(escaped, `"`, `\"`)
	return `"` + escaped + `"`
}
