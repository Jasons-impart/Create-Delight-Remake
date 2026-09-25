package main

import (
	"encoding/base64"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestNoteServerRecordsGameServer(t *testing.T) {
	dir := t.TempDir()
	req := httptest.NewRequest(http.MethodGet, "/api/manifest?side=server", nil)
	req.Header.Set("X-CDR-Side", "server")
	req.Header.Set("X-CDR-Instance-Id", "srv-1")
	req.Header.Set("X-CDR-Hostname", "mc-a")
	req.Header.Set("X-CDR-Instance-Path", base64.StdEncoding.EncodeToString([]byte(`D:\srv`)))
	noteServer(dir, req, "server")
	noteServer(dir, req, "server")
	rows := loadServers(dir)
	if len(rows) != 1 {
		t.Fatalf("rows %d", len(rows))
	}
	row, ok := rows[0].(map[string]any)
	if !ok {
		t.Fatalf("row %#v", rows[0])
	}
	if row["hostname"] != "mc-a" || row["instance_path"] != `D:\srv` || row["sync_count"].(float64) != 2 {
		t.Fatalf("row %#v", row)
	}
	client := httptest.NewRequest(http.MethodGet, "/api/manifest?side=client", nil)
	client.Header.Set("X-CDR-Side", "client")
	noteServer(dir, client, "client")
	if _, err := os.Stat(filepath.Join(dir, "server-connections.json")); err != nil {
		t.Fatal(err)
	}
	if len(loadServers(dir)) != 1 {
		t.Fatal("client request was recorded")
	}
}
