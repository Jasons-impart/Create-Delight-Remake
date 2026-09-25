package main

import (
	"encoding/base64"
	"encoding/json"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode/utf16"
)

var connectionsMu sync.Mutex

type serverRecord struct {
	ID           string `json:"id"`
	Hostname     string `json:"hostname"`
	InstancePath string `json:"instance_path"`
	Remote       string `json:"remote"`
	FirstSeen    string `json:"first_seen"`
	LastSeen     string `json:"last_seen"`
	SyncCount    int    `json:"sync_count"`
}

func noteServer(data string, r *http.Request, side string) {
	if side != "server" || strings.TrimSpace(r.Header.Get("X-CDR-Side")) != "server" {
		return
	}
	connectionsMu.Lock()
	defer connectionsMu.Unlock()
	path := filepath.Join(data, "server-connections.json")
	var doc struct {
		Servers []serverRecord `json:"servers"`
	}
	if buf, err := os.ReadFile(path); err == nil {
		_ = json.Unmarshal(buf, &doc)
	}
	if doc.Servers == nil {
		doc.Servers = []serverRecord{}
	}
	remote := remoteHost(r.RemoteAddr)
	id := strings.TrimSpace(r.Header.Get("X-CDR-Instance-Id"))
	hostname := strings.TrimSpace(r.Header.Get("X-CDR-Hostname"))
	instancePath := decodeInstancePath(r.Header.Get("X-CDR-Instance-Path"))
	if id == "" {
		id = "ip:" + remote
		if instancePath != "" {
			id += ":" + javaHash(instancePath)
		}
	}
	now := time.Now().UTC().Format(time.RFC3339Nano)
	found := false
	for i := range doc.Servers {
		if doc.Servers[i].ID != id {
			continue
		}
		row := &doc.Servers[i]
		if hostname != "" {
			row.Hostname = hostname
		}
		if instancePath != "" {
			row.InstancePath = instancePath
		}
		if remote != "" {
			row.Remote = remote
		}
		if row.FirstSeen == "" {
			row.FirstSeen = now
		}
		row.LastSeen = now
		row.SyncCount++
		found = true
		break
	}
	if !found {
		doc.Servers = append(doc.Servers, serverRecord{
			ID: id, Hostname: hostname, InstancePath: instancePath, Remote: remote,
			FirstSeen: now, LastSeen: now, SyncCount: 1,
		})
	}
	buf, err := json.Marshal(doc)
	if err != nil {
		return
	}
	if err := os.MkdirAll(data, 0o755); err != nil {
		return
	}
	_ = os.WriteFile(path, buf, 0o644)
}

func remoteHost(addr string) string {
	host, _, err := net.SplitHostPort(addr)
	if err != nil {
		return addr
	}
	return host
}

func decodeInstancePath(encoded string) string {
	encoded = strings.TrimSpace(encoded)
	if encoded == "" {
		return ""
	}
	raw, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return encoded
	}
	return string(raw)
}

func javaHash(text string) string {
	var hash int32
	for _, unit := range utf16.Encode([]rune(text)) {
		hash = hash*31 + int32(unit)
	}
	return strconv.FormatUint(uint64(uint32(hash)), 16)
}
