package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"sync/atomic"
	"testing"
)

func TestShortDisconnectRetries(t *testing.T) {
	var hits atomic.Int32
	payload := []byte(strings.Repeat("abc", 100))
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if hits.Add(1) < 3 {
			hj, ok := w.(http.Hijacker)
			if !ok {
				http.Error(w, "no hijack", 500)
				return
			}
			conn, _, _ := hj.Hijack()
			conn.Close()
			return
		}
		w.Write(payload)
	}))
	defer srv.Close()
	dest := filepath.Join(t.TempDir(), "blob.bin")
	err := downloadOne(fetchJob{URL: srv.URL, Dest: dest, Label: "blob", Size: int64(len(payload))}, func(string) {})
	if err != nil {
		t.Fatal(err)
	}
	got, _ := os.ReadFile(dest)
	if string(got) != string(payload) {
		t.Fatalf("payload mismatch %d", len(got))
	}
	if hits.Load() < 3 {
		t.Fatalf("expected retries, hits=%d", hits.Load())
	}
}

func TestDeclineKeepsSingleProcess(t *testing.T) {
	prev := confirmMultiProcess
	confirmMultiProcess = func(int) bool { return false }
	defer func() { confirmMultiProcess = prev }()
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		hits.Add(1)
		fmt.Fprint(w, "ok")
	}))
	defer srv.Close()
	dir := t.TempDir()
	jobs := []fetchJob{
		{URL: srv.URL, Dest: filepath.Join(dir, "a"), Label: "a", Size: 2},
		{URL: srv.URL, Dest: filepath.Join(dir, "b"), Label: "b", Size: 2},
	}
	if err := downloadAll(jobs, true, func(string) {}); err != nil {
		t.Fatal(err)
	}
}

func TestTemporaryStatus(t *testing.T) {
	if !temporary(&statusError{503}) {
		t.Fatal("503 should retry")
	}
	if temporary(&statusError{404}) {
		t.Fatal("404 should not retry")
	}
}
