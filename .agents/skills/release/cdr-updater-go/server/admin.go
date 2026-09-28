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

const adminPrefix = "/admin/ifgfsgfbijuzoxzq"

func registerAdmin(mux *http.ServeMux, cfg serverConfig, data string) {
	mux.HandleFunc(adminPrefix, func(w http.ResponseWriter, r *http.Request) {
		serveAdminPage(w, r)
	})
	mux.HandleFunc(adminPrefix+"/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == adminPrefix+"/" || r.URL.Path == adminPrefix+"/index.html" {
			serveAdminPage(w, r)
			return
		}
		apiPrefix := adminPrefix + "/api/"
		if !strings.HasPrefix(r.URL.Path, apiPrefix) {
			http.NotFound(w, r)
			return
		}
		action := strings.TrimPrefix(r.URL.Path, apiPrefix)
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
			http.SetCookie(w, &http.Cookie{Name: "cdr_admin", Value: token, Path: adminPrefix, HttpOnly: true, SameSite: http.SameSiteLaxMode})
			writeHTTPJSON(w, map[string]any{"ok": true})
		case "logout":
			http.SetCookie(w, &http.Cookie{Name: "cdr_admin", Value: "", Path: adminPrefix, MaxAge: -1})
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
		case "official-adjust":
			if r.Method == http.MethodGet {
				if !adminAllowed(r) {
					writeAdminError(w, http.StatusUnauthorized, "请先登录管理网页")
					return
				}
				rows := listOfficialFiles(data)
				writeHTTPJSON(w, map[string]any{"files": rows, "categories": officialCategories(rows)})
				return
			}
			adminPost(w, r, func() (any, error) { return saveOfficialAdjust(r) })
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
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("X-Frame-Options", "DENY")
	w.Header().Set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'")
	body := adminPage
	if !adminAllowed(r) {
		body = adminLoginGate
	}
	w.WriteHeader(http.StatusOK)
	if r.Method != http.MethodHead {
		_, _ = w.Write(body)
	}
}

var adminLoginGate = []byte(`<!DOCTYPE html>
<html lang="zh-CN"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>CDR 管理登录</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#0a0a0a;color:#f4f4f4}
.card{width:min(420px,92vw);padding:28px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:#161616}
h1{margin:0 0 8px;font-size:1.25rem}p{margin:0 0 18px;color:#9a9a9a;font-size:.92rem}
label{display:block;margin:0 0 6px;font-size:.85rem;color:#9a9a9a}
input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:#0a0a0a;color:#fff}
button{margin-top:14px;width:100%;padding:10px 12px;border:0;border-radius:10px;background:#fff;color:#111;font-weight:600;cursor:pointer}
.err{margin-top:10px;color:#ffb4b4;font-size:.85rem;min-height:1.2em}
</style></head><body>
<form class="card" id="f">
<h1>CDR 更新服务器</h1>
<p>管理面板需先登录。未认证不会下发完整管理页。</p>
<label for="token">管理令牌</label>
<input id="token" type="password" autocomplete="current-password" autofocus>
<button type="submit">进入面板</button>
<div class="err" id="err"></div>
</form>
<script>
const apiBase = location.pathname.replace(/\/?$/, '') + '/api';
document.getElementById('f').onsubmit = async (ev) => {
  ev.preventDefault();
  const err = document.getElementById('err');
  err.textContent = '';
  try {
    const res = await fetch(apiBase + '/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token: document.getElementById('token').value.trim()}),
      credentials: 'same-origin'
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || ('HTTP ' + res.status));
    location.reload();
  } catch (e) {
    err.textContent = e.message || String(e);
  }
};
</script>
</body></html>`)

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
	officialFiles := listOfficialFiles(data)
	return map[string]any{
		"official_version":   version,
		"github_repo":        cfgField(data, "github_repo"),
		"listen":             live.listen,
		"port":               live.port,
		"public_url":         cfgField(data, "public_url"),
		"access_token":       "",
		"server_access_token": "",
		"token_enabled":      cfgField(data, "admin_token") != "",
		"sync_token_enabled": cfgField(data, "access_token") != "",
		"server_sync_token_enabled": cfgField(data, "server_access_token") != "",
		"busy":               busy,
		"progress":           progressSnapshot(),
		"admin_url":          "http://" + host + ":" + live.port + adminPrefix,
		"client_fingerprint": meta["client_fingerprint"],
		"server_fingerprint": meta["server_fingerprint"],
		"servers":            loadServers(data),
		"privates":           listPrivates(privateRoot(data)),
		"private_folders":    privateFolders(privateRoot(data)),
		"official_files":     officialFiles,
		"official_categories": officialCategories(officialFiles),
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
