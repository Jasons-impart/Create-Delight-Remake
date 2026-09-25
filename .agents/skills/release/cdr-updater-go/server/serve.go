package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func runServe(args []string) error {
	configPath := "config.toml"
	for i := 0; i < len(args); i++ {
		if args[i] == "--config" && i+1 < len(args) {
			i++
			configPath = args[i]
		}
	}
	cfg := readServerConfig(configPath)
	data := cfg.dataDir
	if !filepath.IsAbs(data) {
		data = filepath.Join(filepath.Dir(configPath), data)
	}
	setLive(cfg, configPath, data)
	root := &store{data: data, overlay: loadOverlay(filepath.Join(data, "manifests", "private-index.json"))}
	mux := http.NewServeMux()
	mux.HandleFunc("/api/status", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		if r.Method != http.MethodGet {
			http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
			return
		}
		meta, err := os.ReadFile(filepath.Join(data, "manifests", "meta.json"))
		if err != nil {
			http.Error(w, "更新仓库尚未构建", http.StatusConflict)
			return
		}
		var doc map[string]any
		if err := json.Unmarshal(meta, &doc); err != nil {
			http.Error(w, "清单损坏", http.StatusInternalServerError)
			return
		}
		writeHTTPJSON(w, map[string]any{
			"official_version":   doc["official_version"],
			"client_fingerprint": doc["client_fingerprint"],
			"server_fingerprint": doc["server_fingerprint"],
		})
	})
	mux.HandleFunc("/api/manifest", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		if r.Method != http.MethodGet {
			http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
			return
		}
		side := r.URL.Query().Get("side")
		if side != "client" && side != "server" {
			http.Error(w, "side 只能是 client 或 server", http.StatusBadRequest)
			return
		}
		noteServer(data, r, side)
		body, err := root.manifest(side)
		if err != nil {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(body)
	})
	mux.HandleFunc("/api/file/", root.file)
	mux.HandleFunc("/api/pack", root.pack)
	registerAdmin(mux, cfg, data)
	addr := cfg.listen + ":" + cfg.port
	fmt.Println("Go 更新服务器已启动 http://" + addr)
	fmt.Println("只提供清单和文件下载。清单不缓存，文件按哈希长期缓存，支持断点续传。")
	server := &http.Server{Addr: addr, Handler: mux, ReadHeaderTimeout: 10 * time.Second}
	return server.ListenAndServe()
}

type serverConfig struct {
	listen  string
	port    string
	dataDir string
}

func readServerConfig(path string) serverConfig {
	cfg := serverConfig{listen: "127.0.0.1", port: "8765", dataDir: "data"}
	text, err := os.ReadFile(path)
	if err != nil {
		return cfg
	}
	for _, line := range strings.Split(string(text), "\n") {
		line = strings.TrimSpace(line)
		switch {
		case strings.HasPrefix(line, "listen"):
			cfg.listen = tomlValue(line)
		case strings.HasPrefix(line, "port"):
			cfg.port = tomlValue(line)
		case strings.HasPrefix(line, "data_dir"):
			cfg.dataDir = tomlValue(line)
		}
	}
	return cfg
}

type store struct {
	data    string
	overlay map[string]struct{}
}

func loadOverlay(path string) map[string]struct{} {
	out := map[string]struct{}{}
	buf, err := os.ReadFile(path)
	if err != nil {
		return out
	}
	var doc map[string]json.RawMessage
	if json.Unmarshal(buf, &doc) != nil {
		return out
	}
	for key := range doc {
		out[posix(key)] = struct{}{}
	}
	return out
}

func writeHTTPJSON(w http.ResponseWriter, body any) {
	buf, err := json.Marshal(body)
	if err != nil {
		http.Error(w, "服务器内部错误", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(buf)
}

func (s *store) manifest(side string) ([]byte, error) {
	buf, err := os.ReadFile(filepath.Join(s.data, "manifests", side+".json"))
	if err != nil {
		return nil, fmt.Errorf("尚未构建 %s 清单", side)
	}
	var doc struct {
		OfficialVersion string           `json:"official_version"`
		Side            string           `json:"side"`
		GeneratedAt     string           `json:"generated_at"`
		Files           []map[string]any `json:"files"`
	}
	if err := json.Unmarshal(buf, &doc); err != nil {
		return nil, err
	}
	for _, file := range doc.Files {
		path, _ := file["path"].(string)
		if _, ok := s.overlay[posix(path)]; ok {
			file["overlay"] = true
		}
	}
	return json.Marshal(doc)
}

func (s *store) file(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
		return
	}
	digest := strings.TrimPrefix(r.URL.Path, "/api/file/")
	digest = strings.ToLower(strings.TrimSpace(digest))
	if len(digest) != 64 || strings.Contains(digest, "/") || strings.Contains(digest, ".") {
		http.Error(w, "无效文件哈希", http.StatusBadRequest)
		return
	}
	object := filepath.Join(s.data, "objects", digest[:2], digest)
	f, err := os.Open(object)
	if err != nil {
		http.Error(w, "文件对象不存在", http.StatusNotFound)
		return
	}
	defer f.Close()
	info, err := f.Stat()
	if err != nil || info.IsDir() {
		http.Error(w, "文件对象不存在", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	w.Header().Set("ETag", `"`+digest+`"`)
	w.Header().Set("Accept-Ranges", "bytes")
	http.ServeContent(w, r, digest, info.ModTime(), f)
}
