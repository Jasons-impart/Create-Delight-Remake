package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestLauncherSyncWritesMissingFile(t *testing.T) {
	payload := []byte("hello-from-manifest")
	mux := http.NewServeMux()
	mux.HandleFunc("/api/manifest", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Query().Get("side") != "client" {
			t.Errorf("side %s", r.URL.Query().Get("side"))
		}
		w.Header().Set("Content-Type", "application/json")
		sum := sha256.Sum256(payload)
		_, _ = w.Write([]byte(fmt.Sprintf(`{"official_version":"1","files":[{"path":"mods/extra.jar","sha256":"%s","size":%d}]}`, hex.EncodeToString(sum[:]), len(payload))))
	})
	mux.HandleFunc("/api/file/", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write(payload)
	})
	srv := httptest.NewServer(mux)
	defer srv.Close()
	dir := t.TempDir()
	confirmMultiProcess = func(int) bool { return false }
	result, err := syncInstance(dir, "client", srv.URL, "", false, func(string) {})
	if err != nil {
		t.Fatal(err)
	}
	if !result.Changed || !result.ModsChanged {
		t.Fatalf("result %+v", result)
	}
	got, err := os.ReadFile(filepath.Join(dir, "mods", "extra.jar"))
	if err != nil {
		t.Fatal(err)
	}
	if string(got) != string(payload) {
		t.Fatalf("file %q", got)
	}
}
