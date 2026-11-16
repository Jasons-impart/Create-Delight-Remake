package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func cacheWrite(t *testing.T, path string, value []byte, when time.Time) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, value, 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Chtimes(path, when, when); err != nil {
		t.Fatal(err)
	}
}

func TestCacheExpiryAndFailClosed(t *testing.T) {
	dir := t.TempDir()
	now := time.Now()
	old := now.Add(-packTTL - time.Minute)
	official, expired, recent, orphan := strings.Repeat("a", 64), strings.Repeat("b", 64), strings.Repeat("c", 64), strings.Repeat("d", 64)
	object := func(sum string) string { return filepath.Join(dir, "objects", sum[:2], sum) }
	for _, sum := range []string{official, expired, recent, orphan} {
		cacheWrite(t, object(sum), []byte("payload"), old)
	}
	for _, side := range []string{"client", "server"} {
		cacheWrite(t, filepath.Join(dir, "manifests", side+".json"), []byte(`{"files":[{"sha256":"`+official+`"}]}`), now)
	}
	for _, sum := range []string{official, expired, recent} {
		meta, _ := json.Marshal(packMeta{SHA256: sum, Size: 7, Holders: 50, Leases: []string{"abandoned"}})
		cacheWrite(t, filepath.Join(dir, "packs", sum+".json"), meta, old)
	}
	partial := filepath.Join(dir, "packs/build-abandoned.zip")
	cacheWrite(t, partial, []byte("partial"), old)
	// An actual Range download renews idle age, including when no lease is released.
	s := &store{data: dir}
	req := httptest.NewRequest(http.MethodGet, "/api/file/"+recent, nil)
	req.Header.Set("Range", "bytes=0-2")
	rec := httptest.NewRecorder()
	s.file(rec, req)
	if rec.Code != http.StatusPartialContent || rec.Body.String() != "pay" {
		t.Fatalf("Range: %d %s", rec.Code, rec.Body.String())
	}
	bad := filepath.Join(dir, "packs/bad.json")
	cacheWrite(t, bad, []byte("{"), old)
	if _, err := collectPacks(dir, now); err == nil {
		t.Fatal("corrupt metadata accepted")
	}
	if _, err := os.Stat(object(expired)); err != nil {
		t.Fatal("deleted before validation", err)
	}
	if err := os.Remove(bad); err != nil {
		t.Fatal(err)
	}
	if _, err := collectPacks(dir, now); err != nil {
		t.Fatal(err)
	}
	for _, path := range []string{object(expired), object(orphan), partial} {
		if _, err := os.Stat(path); !os.IsNotExist(err) {
			t.Fatal("expired file retained", path, err)
		}
	}
	for _, sum := range []string{official, recent} {
		if _, err := os.Stat(object(sum)); err != nil {
			t.Fatal("live file removed", err)
		}
	}
	cacheWrite(t, filepath.Join(dir, "manifests/server.json"), []byte("{}"), now)
	if _, err := collectPacks(dir, now.Add(packTTL)); err == nil {
		t.Fatal("corrupt manifest accepted")
	}
	if _, err := os.Stat(object(recent)); err != nil {
		t.Fatal("deleted with invalid manifest", err)
	}
}

func TestPackCanonicalReuseAfterRelease(t *testing.T) {
	dir := t.TempDir()
	now := time.Now()
	sum := strings.Repeat("a", 64)
	cacheWrite(t, filepath.Join(dir, "objects", sum[:2], sum), []byte("payload"), now)
	for _, side := range []string{"client", "server"} {
		cacheWrite(t, filepath.Join(dir, "manifests", side+".json"), []byte(`{"files":[{"sha256":"`+sum+`"}]}`), now)
	}
	s := &store{data: dir}
	a := packItem{Path: "a.txt", SHA256: sum}
	b := packItem{Path: "b.txt", SHA256: sum}
	digest, size, lease, err := s.ensurePack([]packItem{b, a, a}, nil)
	if err != nil {
		t.Fatal(err)
	}
	if err = s.discardPack(digest, lease); err != nil {
		t.Fatal(err)
	}
	path := filepath.Join(dir, "objects", digest[:2], digest)
	before, err := os.Stat(path)
	if err != nil {
		t.Fatal(err)
	}
	again, size2, lease2, err := s.ensurePack([]packItem{a, b}, nil)
	if err != nil {
		t.Fatal(err)
	}
	after, err := os.Stat(path)
	if err != nil {
		t.Fatal(err)
	}
	if digest != again || size != size2 || lease == lease2 || !before.ModTime().Equal(after.ModTime()) {
		t.Fatal("did not reuse canonical ZIP")
	}
	entries, err := os.ReadDir(filepath.Join(dir, "packs"))
	if err != nil || len(entries) != 1 {
		t.Fatal("duplicate pack metadata", entries, err)
	}
	if _, err = collectPacks(dir, time.Now().Add(packTTL+time.Minute)); err != nil {
		t.Fatal(err)
	}
	if _, err = os.Stat(path); !os.IsNotExist(err) {
		t.Fatal("abandoned lease prevented expiration")
	}
}

func TestPackCapacity(t *testing.T) {
	if checkPackCapacity(packBudget-100, 101, 1<<62) == nil {
		t.Fatal("cache budget ignored")
	}
	if checkPackCapacity(0, 101, diskReserve+100) == nil {
		t.Fatal("disk reserve ignored")
	}
	if err := checkPackCapacity(0, 100, diskReserve+100); err != nil {
		t.Fatal(err)
	}
	if checkPackCapacity(1<<62, 1<<62, 1<<62) == nil {
		t.Fatal("overflow accepted")
	}
}
