package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestPlayerAllowedRequiresAccessToken(t *testing.T) {
	dir := t.TempDir()
	config := filepath.Join(dir, "config.toml")
	data := filepath.Join(dir, "data")
	if err := os.MkdirAll(filepath.Join(data, "manifests"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(config, []byte("access_token = \"secret\"\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(data, "manifests", "meta.json"), []byte(`{"official_version":"v1"}`), 0o644); err != nil {
		t.Fatal(err)
	}
	req := httptest.NewRequest(http.MethodGet, "/api/status", nil)
	if playerAllowed(req, data) {
		t.Fatal("expected deny without token")
	}
	req.Header.Set("X-CDR-Token", "secret")
	if !playerAllowed(req, data) {
		t.Fatal("expected allow with token")
	}
	req = httptest.NewRequest(http.MethodGet, "/api/status", nil)
	req.Header.Set("Authorization", "Bearer secret")
	if !playerAllowed(req, data) {
		t.Fatal("expected allow with bearer")
	}
}

func TestPrivateTargetRejectsEscape(t *testing.T) {
	dir := t.TempDir()
	setLive(serverConfig{listen: "127.0.0.1", port: "8765", dataDir: "data"}, filepath.Join(dir, "config.toml"), filepath.Join(dir, "data"))
	if err := os.MkdirAll(filepath.Join(dir, "private", "files"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "config.toml"), []byte("overlay_dir = \"./private\"\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if _, err := privateTarget("../secret.txt"); err == nil {
		t.Fatal("expected reject ..")
	}
	if _, err := privateTarget("/tmp/x"); err == nil {
		t.Fatal("expected reject absolute")
	}
	got, err := privateTarget("mods/a.jar")
	if err != nil {
		t.Fatal(err)
	}
	if filepath.Base(got) != "a.jar" {
		t.Fatalf("got %s", got)
	}
}
