package main

import (
	"strings"
	"testing"
)

func TestProgressPercent(t *testing.T) {
	progressEnd()
	meter := &assetMeter{}
	progressDownloadStart("下载官方包", []*assetMeter{meter}, 1000)
	meter.done.Store(500)
	snap := progressSnapshot()
	if snap["percent"].(int) != 50 {
		t.Fatalf("percent %v", snap["percent"])
	}
	text := snap["text"].(string)
	if !strings.Contains(text, "下载官方包") || !strings.Contains(text, "50%") || !strings.Contains(text, "500 B/1000 B") {
		t.Fatalf("text %q", text)
	}
	progressEnd()
	if progressSnapshot()["active"].(bool) {
		t.Fatal("still active")
	}
}

func TestProgressFromLine(t *testing.T) {
	progressEnd()
	line := "1/2  Client.zip  40%  400.0 MB/1000.0 MB  12.0 MB/s"
	if !progressFromLine(line) {
		t.Fatal("not progress")
	}
	snap := progressSnapshot()
	if snap["percent"].(int) != 40 || snap["text"].(string) != line {
		t.Fatalf("snap %#v", snap)
	}
	if progressFromLine("仓库已重新构建") {
		t.Fatal("plain log treated as progress")
	}
	progressEnd()
}
