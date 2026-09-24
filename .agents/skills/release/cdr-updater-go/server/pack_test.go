package main

import (
	"archive/zip"
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestPackBundlesRequestedFiles(t *testing.T) {
	dir := t.TempDir()
	payload := []byte("pack-me")
	sum := sha256.Sum256(payload)
	digest := hex.EncodeToString(sum[:])
	object := filepath.Join(dir, "objects", digest[:2], digest)
	if err := os.MkdirAll(filepath.Dir(object), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(object, payload, 0o644); err != nil {
		t.Fatal(err)
	}
	manifest := filepath.Join(dir, "manifests")
	if err := os.MkdirAll(manifest, 0o755); err != nil {
		t.Fatal(err)
	}
	doc := map[string]any{
		"files": []map[string]any{
			{"path": "mods/a.jar", "sha256": digest},
			{"path": "mods/skip.jar", "sha256": digest},
		},
	}
	buf, _ := json.Marshal(doc)
	if err := os.WriteFile(filepath.Join(manifest, "client.json"), buf, 0o644); err != nil {
		t.Fatal(err)
	}
	root := &store{data: dir}
	req := httptest.NewRequest(http.MethodPost, "/api/pack", bytes.NewReader([]byte(`{"side":"client","paths":["mods/a.jar"]}`)))
	rec := httptest.NewRecorder()
	root.pack(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status %d %s", rec.Code, rec.Body.String())
	}
	var meta struct {
		SHA256 string `json:"sha256"`
		Size   int64  `json:"size"`
	}
	var parsed bool
	for _, line := range bytes.Split(rec.Body.Bytes(), []byte("\n")) {
		if len(line) == 0 || !bytes.Contains(line, []byte("sha256")) {
			continue
		}
		if err := json.Unmarshal(line, &meta); err != nil {
			t.Fatal(err)
		}
		parsed = true
	}
	if !parsed {
		t.Fatalf("body %s", rec.Body.String())
	}
	object = filepath.Join(dir, "objects", meta.SHA256[:2], meta.SHA256)
	raw, err := os.ReadFile(object)
	if err != nil {
		t.Fatal(err)
	}
	zr, err := zip.NewReader(bytes.NewReader(raw), int64(len(raw)))
	if err != nil {
		t.Fatal(err)
	}
	if len(zr.File) != 1 || zr.File[0].Name != "mods/a.jar" {
		t.Fatalf("entries %+v", zr.File)
	}
	if zr.File[0].Method != zip.Deflate {
		t.Fatalf("method %d", zr.File[0].Method)
	}
	rc, err := zr.File[0].Open()
	if err != nil {
		t.Fatal(err)
	}
	defer rc.Close()
	got, _ := io.ReadAll(rc)
	if string(got) != string(payload) {
		t.Fatalf("payload %q", got)
	}
	discard := httptest.NewRequest(http.MethodPost, "/api/pack", bytes.NewReader([]byte(`{"discard":"`+meta.SHA256+`"}`)))
	discarded := httptest.NewRecorder()
	root.pack(discarded, discard)
	if discarded.Code != http.StatusOK {
		t.Fatalf("discard %d %s", discarded.Code, discarded.Body.String())
	}
	if _, err = os.Stat(object); !os.IsNotExist(err) {
		t.Fatalf("pack zip still present: %v", err)
	}
	if _, err = os.Stat(filepath.Join(dir, "objects", digest[:2], digest)); err != nil {
		t.Fatal(err)
	}
}
