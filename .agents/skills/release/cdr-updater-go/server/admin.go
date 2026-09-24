package main

import (
	"crypto/subtle"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	_ "embed"
)

//go:embed web/admin.html
var adminPage []byte

func registerAdmin(mux *http.ServeMux, cfg serverConfig, data string) {
	mux.HandleFunc("/admin", func(w http.ResponseWriter, r *http.Request) {
		serveAdminPage(w, r)
	})
	mux.HandleFunc("/admin/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/admin/" || r.URL.Path == "/admin/index.html" {
			serveAdminPage(w, r)
			return
		}
		if !strings.HasPrefix(r.URL.Path, "/admin/api/") {
			http.NotFound(w, r)
			return
		}
		action := strings.TrimPrefix(r.URL.Path, "/admin/api/")
		action = strings.TrimSuffix(action, "/")
		w.Header().Set("Cache-Control", "no-store")
		switch action {
		case "login":
			if r.Method != http.MethodPost {
				writeAdminError(w, http.StatusMethodNotAllowed, "方法不允许")
				return
			}
			var body struct {
				Token string `json:"token"`
			}
			_ = json.NewDecoder(io.LimitReader(r.Body, 1<<20)).Decode(&body)
			token := strings.TrimSpace(body.Token)
			expected := configuredAdminToken()
			if expected != "" {
				if subtle.ConstantTimeCompare([]byte(token), []byte(expected)) != 1 {
					writeAdminError(w, http.StatusUnauthorized, "网页令牌不正确")
					return
				}
			} else if !adminLoopback(r) {
				writeAdminError(w, http.StatusUnauthorized, "请先登录管理网页")
				return
			}
			if token == "" {
				token = "local"
			}
			http.SetCookie(w, &http.Cookie{Name: "cdr_admin", Value: token, Path: "/admin/ifgfsgfbijuzoxzq", HttpOnly: true, SameSite: http.SameSiteLaxMode})
			writeHTTPJSON(w, map[string]any{"ok": true})
		case "logout":
			http.SetCookie(w, &http.Cookie{Name: "cdr_admin", Value: "", Path: "/admin/ifgfsgfbijuzoxzq", MaxAge: -1})
			writeHTTPJSON(w, map[string]any{"ok": true})
		case "state":
			if r.Method != http.MethodGet {
				writeAdminError(w, http.StatusMethodNotAllowed, "方法不允许")
				return
			}
			if !adminAllowed(r) {
				writeAdminError(w, http.StatusUnauthorized, "请先登录管理网页")
				return
			}
			writeHTTPJSON(w, adminState(data))
		case "tags":
			if !adminAllowed(r) {
				writeAdminError(w, http.StatusUnauthorized, "请先登录管理网页")
				return
			}
			tags, err := fetchReleaseTags(data)
			if err != nil {
				writeAdminError(w, http.StatusBadGateway, err.Error())
				return
			}
			writeHTTPJSON(w, map[string]any{"tags": tags, "current": cfgVersion(data)})
		case "version":
			adminPost(w, r, func() (any, error) { return applyVersion(r) })
		case "rebuild":
			adminPost(w, r, func() (any, error) { return rebuildRepos() })
		case "connection":
			adminPost(w, r, func() (any, error) { return saveConnection(r) })
		case "detect-wan":
			adminPost(w, r, func() (any, error) { return detectWan() })
		case "open-wan":
			adminPost(w, r, func() (any, error) { return openWan() })
		case "private":
			adminPost(w, r, func() (any, error) { return addPrivate(r) })
		case "private/remove":
			adminPost(w, r, func() (any, error) { return removePrivate(r) })
		case "private/side":
			adminPost(w, r, func() (any, error) { return setPrivateSide(r) })
		case "private/folder":
			adminPost(w, r, func() (any, error) { return createPrivateFolder(r) })
		default:
			writeAdminError(w, http.StatusNotFound, "页面不存在")
		}
	})
}

func serveAdminPage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		writeAdminError(w, http.StatusMethodNotAllowed, "方法不允许")
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(http.StatusOK)
	if r.Method != http.MethodHead {
		_, _ = w.Write(adminPage)
	}
}

func adminLoopback(r *http.Request) bool {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		host = r.RemoteAddr
	}
	return host == "127.0.0.1" || host == "::1"
}

func configuredAdminToken() string {
	data := liveDataPath()
	if data == "" {
		return ""
	}
	return strings.TrimSpace(cfgField(data, "admin_token"))
}

func presentedAdminToken(r *http.Request) string {
	if header := strings.TrimSpace(r.Header.Get("X-CDR-Admin-Token")); header != "" {
		return header
	}
	cookie, err := r.Cookie("cdr_admin")
	if err != nil {
		return ""
	}
	return strings.TrimSpace(cookie.Value)
}

func adminAllowed(r *http.Request) bool {
	expected := configuredAdminToken()
	if expected != "" {
		got := presentedAdminToken(r)
		return subtle.ConstantTimeCompare([]byte(got), []byte(expected)) == 1
	}
	return adminLoopback(r)
}

func adminState(data string) map[string]any {
	meta := map[string]any{}
	if buf, err := os.ReadFile(filepath.Join(data, "manifests", "meta.json")); err == nil {
		_ = json.Unmarshal(buf, &meta)
	}
	version, _ := meta["official_version"].(string)
	if version == "" {
		version = cfgVersion(data)
	}
	live := liveSnapshot()
	host := live.listen
	if host == "0.0.0.0" || host == "::" {
		host = "127.0.0.1"
	}
	busy, logs := adminActivity()
	return map[string]any{
		"official_version":   version,
		"github_repo":        cfgField(data, "github_repo"),
		"listen":             live.listen,
		"port":               live.port,
		"public_url":         cfgField(data, "public_url"),
		"access_token":       cfgField(data, "access_token"),
		"token_enabled":      cfgField(data, "admin_token") != "",
		"sync_token_enabled": cfgField(data, "access_token") != "",
		"busy":               busy,
		"progress":           progressSnapshot(),
		"admin_url":          "http://" + host + ":" + live.port + "/admin/ifgfsgfbijuzoxzq",
		"client_fingerprint": meta["client_fingerprint"],
		"server_fingerprint": meta["server_fingerprint"],
		"servers":            loadServers(data),
		"privates":           listPrivates(privateRoot(data)),
		"private_folders":    privateFolders(privateRoot(data)),
		"logs":               logs,
	}
}

func listPrivates(root string) []map[string]any {
	rows := []map[string]any{}
	files := filepath.Join(root, "files")
	_ = filepath.Walk(files, func(path string, info os.FileInfo, err error) error {
		if err != nil || info.IsDir() {
			return nil
		}
		name := info.Name()
		if strings.HasSuffix(name, ".side") || strings.HasSuffix(name, ".pw.toml") {
			return nil
		}
		rel, err := filepath.Rel(files, path)
		if err != nil {
			return nil
		}
		rel = filepath.ToSlash(rel)
		side := "auto"
		if buf, err := os.ReadFile(path + ".side"); err == nil {
			side = strings.TrimSpace(string(buf))
		}
		folder := filepath.ToSlash(filepath.Dir(rel))
		if folder == "." {
			folder = "./"
		} else {
			folder += "/"
		}
		rows = append(rows, map[string]any{
			"path": rel, "folder": folder, "side": side, "side_label": sideLabel(side), "source": path,
		})
		return nil
	})
	return rows
}

func fetchReleaseTags(data string) ([]string, error) {
	repo := cfgField(data, "github_repo")
	if repo == "" {
		repo = "Jasons-impart/Create-Delight-Remake"
	}
	api := cfgField(data, "github_api")
	if api == "" {
		api = "https://api.github.com"
	}
	req, err := http.NewRequest(http.MethodGet, strings.TrimRight(api, "/")+"/repos/"+repo+"/releases?per_page=50", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "cdr-updater")
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("无法连接 GitHub: %w", err)
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("GitHub API 失败: %d", resp.StatusCode)
	}
	var releases []struct {
		Tag string `json:"tag_name"`
	}
	if err := json.Unmarshal(body, &releases); err != nil {
		return nil, err
	}
	tags := make([]string, 0, len(releases))
	for _, release := range releases {
		if release.Tag != "" {
			tags = append(tags, release.Tag)
		}
	}
	return tags, nil
}

func cfgVersion(data string) string {
	if v := cfgField(data, "version"); v != "" {
		return v
	}
	return ""
}

func cfgField(data, key string) string {
	buf, err := os.ReadFile(filepath.Join(filepath.Dir(data), "config.toml"))
	if err != nil {
		return ""
	}
	for _, line := range strings.Split(string(buf), "\n") {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, key) {
			return tomlValue(line)
		}
	}
	return ""
}

func writeAdminError(w http.ResponseWriter, code int, detail string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(map[string]string{"detail": detail})
}
