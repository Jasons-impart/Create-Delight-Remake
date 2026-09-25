package main

import (
	"archive/zip"
	"compress/flate"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

const packBodyLimit = 8 << 20

var packBuild sync.Mutex

func (s *store) pack(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodGet {
		http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Side    string   `json:"side"`
		Paths   []string `json:"paths"`
		Discard string   `json:"discard"`
	}
	if r.Method == http.MethodGet {
		req.Side = r.URL.Query().Get("side")
	} else {
		dec := json.NewDecoder(io.LimitReader(r.Body, packBodyLimit))
		if err := dec.Decode(&req); err != nil {
			http.Error(w, "请求无效", http.StatusBadRequest)
			return
		}
	}
	if req.Discard != "" {
		packBuild.Lock()
		err := s.discardPack(req.Discard)
		packBuild.Unlock()
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		w.Header().Set("Cache-Control", "no-store")
		writeHTTPJSON(w, map[string]any{"ok": true})
		return
	}
	if req.Side != "client" && req.Side != "server" {
		http.Error(w, "side 只能是 client 或 server", http.StatusBadRequest)
		return
	}
	noteServer(s.data, r, req.Side)
	files, err := s.manifestFiles(req.Side)
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}
	byPath := map[string]packItem{}
	for _, file := range files {
		byPath[file.Path] = file
	}
	selected := make([]packItem, 0, len(req.Paths))
	seen := map[string]struct{}{}
	for _, raw := range req.Paths {
		rel := posix(raw)
		if rel == "" || strings.Contains(rel, "..") || strings.HasPrefix(rel, "/") {
			http.Error(w, "无效路径", http.StatusBadRequest)
			return
		}
		if _, ok := seen[rel]; ok {
			continue
		}
		file, ok := byPath[rel]
		if !ok {
			http.Error(w, "清单中没有 "+rel, http.StatusBadRequest)
			return
		}
		seen[rel] = struct{}{}
		selected = append(selected, file)
	}
	if len(selected) == 0 {
		http.Error(w, "没有要打包的文件", http.StatusBadRequest)
		return
	}
	flusher, _ := w.(http.Flusher)
	w.Header().Set("Content-Type", "application/x-ndjson; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("X-Accel-Buffering", "no")
	packBuild.Lock()
	defer packBuild.Unlock()
	w.WriteHeader(http.StatusOK)
	enc := json.NewEncoder(w)
	sum, size, err := s.ensurePack(selected, func(done, total int) {
		_ = enc.Encode(map[string]any{"event": "progress", "done": done, "total": total})
		if flusher != nil {
			flusher.Flush()
		}
	})
	if err != nil {
		_ = enc.Encode(map[string]any{"event": "error", "detail": err.Error()})
		if flusher != nil {
			flusher.Flush()
		}
		return
	}
	_ = enc.Encode(map[string]any{"event": "done", "sha256": sum, "size": size})
	if flusher != nil {
		flusher.Flush()
	}
}

func (s *store) ensurePack(files []packItem, report func(done, total int)) (string, int64, error) {
	keyHash := sha256.New()
	for _, file := range files {
		_, _ = io.WriteString(keyHash, file.Path)
		_, _ = io.WriteString(keyHash, "\n")
		_, _ = io.WriteString(keyHash, file.SHA256)
		_, _ = io.WriteString(keyHash, "\n")
	}
	key := hex.EncodeToString(keyHash.Sum(nil))
	metaPath := filepath.Join(s.data, "packs", key+".json")
	if buf, err := os.ReadFile(metaPath); err == nil {
		var meta packMeta
		if json.Unmarshal(buf, &meta) == nil && len(meta.SHA256) == 64 {
			object := filepath.Join(s.data, "objects", meta.SHA256[:2], meta.SHA256)
			if info, err := os.Stat(object); err == nil && !info.IsDir() {
				if meta.Holders < 1 {
					meta.Holders = 1
				} else {
					meta.Holders++
				}
				if err = writePackMeta(metaPath, meta); err != nil {
					return "", 0, err
				}
				if report != nil {
					report(len(files), len(files))
				}
				return meta.SHA256, info.Size(), nil
			}
		}
	}
	if err := os.MkdirAll(filepath.Join(s.data, "packs"), 0o755); err != nil {
		return "", 0, err
	}
	tmp, err := os.CreateTemp(filepath.Join(s.data, "packs"), "build-*.zip")
	if err != nil {
		return "", 0, err
	}
	tmpName := tmp.Name()
	defer os.Remove(tmpName)
	zw := zip.NewWriter(tmp)
	zw.RegisterCompressor(zip.Deflate, func(out io.Writer) (io.WriteCloser, error) {
		return flate.NewWriter(out, flate.BestSpeed)
	})
	total := len(files)
	for i, file := range files {
		in, err := os.Open(filepath.Join(s.data, "objects", file.SHA256[:2], file.SHA256))
		if err != nil {
			_ = zw.Close()
			_ = tmp.Close()
			return "", 0, err
		}
		hdr := &zip.FileHeader{Name: file.Path, Method: zip.Deflate}
		hdr.SetMode(0o644)
		out, err := zw.CreateHeader(hdr)
		if err != nil {
			_ = in.Close()
			_ = zw.Close()
			_ = tmp.Close()
			return "", 0, err
		}
		if _, err = io.Copy(out, in); err != nil {
			_ = in.Close()
			_ = zw.Close()
			_ = tmp.Close()
			return "", 0, err
		}
		_ = in.Close()
		if report != nil && (i == 0 || i+1 == total || (i+1)%20 == 0) {
			report(i+1, total)
		}
	}
	if err = zw.Close(); err != nil {
		_ = tmp.Close()
		return "", 0, err
	}
	if err = tmp.Close(); err != nil {
		return "", 0, err
	}
	digest, err := hashFile(tmpName)
	if err != nil {
		return "", 0, err
	}
	info, err := os.Stat(tmpName)
	if err != nil {
		return "", 0, err
	}
	size := info.Size()
	object := filepath.Join(s.data, "objects", digest[:2], digest)
	if err = os.MkdirAll(filepath.Dir(object), 0o755); err != nil {
		return "", 0, err
	}
	if _, err = os.Stat(object); err != nil {
		if err = os.Rename(tmpName, object); err != nil {
			return "", 0, err
		}
	}
	if err = writePackMeta(metaPath, packMeta{SHA256: digest, Size: size, Holders: 1}); err != nil {
		return "", 0, err
	}
	return digest, size, nil
}

type packMeta struct {
	SHA256  string `json:"sha256"`
	Size    int64  `json:"size"`
	Holders int    `json:"holders"`
}

func writePackMeta(path string, meta packMeta) error {
	buf, err := json.Marshal(meta)
	if err != nil {
		return err
	}
	return os.WriteFile(path, buf, 0o644)
}

func (s *store) discardPack(sum string) error {
	sum = strings.ToLower(strings.TrimSpace(sum))
	if len(sum) != 64 || strings.ContainsAny(sum, "/.\\") {
		return errPackHash
	}
	for _, ch := range sum {
		if (ch < '0' || ch > '9') && (ch < 'a' || ch > 'f') {
			return errPackHash
		}
	}
	keepObject := false
	for _, side := range []string{"client", "server"} {
		files, err := s.manifestFiles(side)
		if err != nil {
			continue
		}
		for _, file := range files {
			if file.SHA256 == sum {
				keepObject = true
			}
		}
	}
	entries, err := os.ReadDir(filepath.Join(s.data, "packs"))
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}
	holdersLeft := 0
	var drop []string
	for _, entry := range entries {
		name := entry.Name()
		if entry.IsDir() || !strings.HasSuffix(name, ".json") {
			continue
		}
		path := filepath.Join(s.data, "packs", name)
		buf, err := os.ReadFile(path)
		if err != nil {
			continue
		}
		var meta packMeta
		if json.Unmarshal(buf, &meta) != nil || meta.SHA256 != sum {
			continue
		}
		meta.Holders--
		if meta.Holders > 0 {
			holdersLeft += meta.Holders
			if err = writePackMeta(path, meta); err != nil {
				return err
			}
			continue
		}
		drop = append(drop, path)
	}
	if holdersLeft == 0 && !keepObject && len(drop) > 0 {
		_ = os.Remove(filepath.Join(s.data, "objects", sum[:2], sum))
	}
	for _, path := range drop {
		_ = os.Remove(path)
	}
	return nil
}

var errPackHash = packError("无效压缩包哈希")

type packError string

func (e packError) Error() string { return string(e) }

type packItem struct {
	Path   string
	SHA256 string
}

func (s *store) manifestFiles(side string) ([]packItem, error) {
	buf, err := os.ReadFile(filepath.Join(s.data, "manifests", side+".json"))
	if err != nil {
		return nil, missingManifest("尚未构建 " + side + " 清单")
	}
	var doc struct {
		Files []struct {
			Path   string `json:"path"`
			SHA256 string `json:"sha256"`
		} `json:"files"`
	}
	if err := json.Unmarshal(buf, &doc); err != nil {
		return nil, err
	}
	out := make([]packItem, 0, len(doc.Files))
	for _, file := range doc.Files {
		rel := posix(file.Path)
		sum := strings.ToLower(strings.TrimSpace(file.SHA256))
		if rel == "" || len(sum) != 64 {
			continue
		}
		out = append(out, packItem{Path: rel, SHA256: sum})
	}
	return out, nil
}

type missingManifest string

func (e missingManifest) Error() string { return string(e) }
