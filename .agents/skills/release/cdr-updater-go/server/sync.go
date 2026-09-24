package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type manifestFile struct {
	Path    string `json:"path"`
	SHA     string `json:"sha256"`
	Size    int64  `json:"size"`
	Overlay bool   `json:"overlay"`
}

type manifestDoc struct {
	OfficialVersion string         `json:"official_version"`
	Files           []manifestFile `json:"files"`
}

type stateDoc struct {
	OfficialVersion string            `json:"official_version"`
	Side            string            `json:"side"`
	ManagedPaths    []string          `json:"managed_paths"`
	SyncedHashes    map[string]string `json:"synced_hashes"`
	InstanceID      string            `json:"instance_id,omitempty"`
}

type appliedChange struct {
	Path   string `json:"path"`
	Action string `json:"action"`
}

type syncResult struct {
	Changed         bool            `json:"changed"`
	ModsChanged     bool            `json:"mods_changed"`
	OfficialVersion string          `json:"official_version"`
	Applied         []appliedChange `json:"applied"`
}

func runSync(args []string) error {
	instance := ""
	side := "client"
	server := ""
	token := ""
	resultPath := ""
	prompt := true
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--instance":
			i++
			instance = args[i]
		case "--side":
			i++
			side = args[i]
		case "--server":
			i++
			server = args[i]
		case "--token":
			i++
			token = args[i]
		case "--result":
			i++
			resultPath = args[i]
		case "--no-prompt":
			prompt = false
		}
	}
	if instance == "" {
		return fmt.Errorf("缺少 --instance")
	}
	if side != "server" {
		side = "client"
		prompt = prompt
	} else {
		prompt = false
	}
	if server == "" {
		server = readUpdateServer(instance)
	}
	if token == "" {
		token = readUpdateToken(instance)
	}
	result, err := syncInstance(instance, side, server, token, prompt, func(line string) {
		fmt.Println("[CDR Updater] " + line)
	})
	if resultPath != "" && result != nil {
		_ = writeJSON(resultPath, result)
	}
	return err
}

func syncInstance(instance, side, server, token string, prompt bool, log func(string)) (*syncResult, error) {
	if err := os.MkdirAll(instance, 0o755); err != nil {
		return nil, err
	}
	state := readState(filepath.Join(instance, "cdr-updater-state.json"))
	log("正在拉取远程清单")
	doc, err := fetchManifest(server, side, token)
	if err != nil {
		return nil, err
	}
	remote := map[string]manifestFile{}
	for _, file := range doc.Files {
		rel := posix(file.Path)
		if unsafePath(rel) {
			continue
		}
		file.Path = rel
		remote[rel] = file
	}
	localSHA := map[string]string{}
	for rel := range remote {
		sum, ok := fileSHA(filepath.Join(instance, filepath.FromSlash(rel)))
		if ok {
			localSHA[rel] = sum
		}
	}
	for _, rel := range state.ManagedPaths {
		rel = posix(rel)
		if _, seen := localSHA[rel]; seen || unsafePath(rel) {
			continue
		}
		sum, ok := fileSHA(filepath.Join(instance, filepath.FromSlash(rel)))
		if ok {
			localSHA[rel] = sum
		}
	}
	managed := map[string]struct{}{}
	for _, rel := range state.ManagedPaths {
		rel = posix(rel)
		if rel != "" {
			managed[rel] = struct{}{}
		}
	}
	if state.SyncedHashes == nil {
		state.SyncedHashes = map[string]string{}
	}
	var jobs []fetchJob
	base := strings.TrimRight(server, "/")
	for rel, file := range remote {
		var tag *bool
		keep := false
		if taggedTemplate(rel) {
			value := readManagedTag(filepath.Join(instance, filepath.FromSlash(rel)))
			tag = &value
			if _, err := os.Stat(filepath.Join(instance, filepath.FromSlash(serverKeep))); err == nil {
				keep = true
			}
		}
		if !shouldOverwriteLocal(rel, side, localSHA[rel], file.SHA, state.SyncedHashes, file.Overlay, tag, keep) {
			if taggedTemplate(rel) && tag != nil && *tag {
				markServerKeep(instance)
			}
			log("保留本地文件 " + rel)
			continue
		}
		jobs = append(jobs, fetchJob{
			URL:    base + "/api/file/" + file.SHA,
			Dest:   filepath.Join(instance, filepath.FromSlash(rel)),
			SHA:    file.SHA,
			Label:  rel,
			Size:   file.Size,
			Header: tokenHeader(token),
		})
	}
	log(fmt.Sprintf("需要下载 %d 个文件", len(jobs)))
	if err := downloadAll(jobs, prompt && side == "client", log); err != nil {
		return nil, err
	}
	applied := make([]appliedChange, 0, len(jobs))
	modsChanged := false
	for _, job := range jobs {
		rel := job.Label
		state.SyncedHashes[rel] = job.SHA
		localSHA[rel] = job.SHA
		applied = append(applied, appliedChange{Path: rel, Action: "write"})
		if strings.HasPrefix(rel, "mods/") && strings.HasSuffix(strings.ToLower(rel), ".jar") {
			modsChanged = true
		}
	}
	remoteSet := map[string]struct{}{}
	var remotePaths []string
	for rel := range remote {
		remoteSet[rel] = struct{}{}
		remotePaths = append(remotePaths, rel)
	}
	for rel := range managed {
		if _, ok := remoteSet[rel]; ok || unsafePath(rel) {
			continue
		}
		if !shouldDeleteLocal(rel, managed) {
			log("保留未纳入更新清单的本地文件 " + rel)
			continue
		}
		target := filepath.Join(instance, filepath.FromSlash(rel))
		if info, err := os.Stat(target); err == nil && !info.IsDir() {
			log("更新器服务器已删除，正在移除 " + rel)
			if err := os.Remove(target); err != nil {
				return nil, err
			}
			applied = append(applied, appliedChange{Path: rel, Action: "delete"})
			if strings.HasPrefix(rel, "mods/") && strings.HasSuffix(strings.ToLower(rel), ".jar") {
				modsChanged = true
			}
		}
		delete(state.SyncedHashes, rel)
		delete(localSHA, rel)
	}
	nextHashes := map[string]string{}
	for rel, sum := range state.SyncedHashes {
		if _, ok := remoteSet[rel]; ok {
			nextHashes[rel] = sum
		}
	}
	for rel, file := range remote {
		if localSHA[rel] == file.SHA && file.SHA != "" {
			nextHashes[rel] = file.SHA
		}
	}
	wroteProperties := false
	for _, item := range applied {
		if item.Path == "server.properties" && item.Action == "write" {
			wroteProperties = true
		}
	}
	if side == "server" && !wroteProperties && readManagedTag(filepath.Join(instance, "server.properties")) {
		local := localSHA["server.properties"]
		remoteSHA := ""
		if file, ok := remote["server.properties"]; ok {
			remoteSHA = file.SHA
		}
		if local != "" && remoteSHA != "" && local != remoteSHA {
			markServerKeep(instance)
		}
	}
	next := stateDoc{
		OfficialVersion: doc.OfficialVersion,
		Side:            side,
		ManagedPaths:    remotePaths,
		SyncedHashes:    nextHashes,
		InstanceID:      state.InstanceID,
	}
	if err := writeJSON(filepath.Join(instance, "cdr-updater-state.json"), next); err != nil {
		return nil, err
	}
	log("同步完成")
	return &syncResult{
		Changed:         len(applied) > 0,
		ModsChanged:     modsChanged,
		OfficialVersion: doc.OfficialVersion,
		Applied:         applied,
	}, nil
}

func fetchManifest(server, side, token string) (*manifestDoc, error) {
	url := strings.TrimRight(server, "/") + "/api/manifest?side=" + side
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "cdr-updater-client")
	req.Header.Set("X-CDR-Side", side)
	if token != "" {
		req.Header.Set("X-CDR-Token", token)
	}
	client := &http.Client{Timeout: 2 * time.Minute}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("更新服务器返回 %d", resp.StatusCode)
	}
	var doc manifestDoc
	if err := json.Unmarshal(body, &doc); err != nil {
		return nil, err
	}
	return &doc, nil
}

func readState(path string) stateDoc {
	state := stateDoc{SyncedHashes: map[string]string{}, ManagedPaths: []string{}}
	buf, err := os.ReadFile(path)
	if err != nil {
		return state
	}
	_ = json.Unmarshal(buf, &state)
	if state.SyncedHashes == nil {
		state.SyncedHashes = map[string]string{}
	}
	return state
}

func readUpdateServer(instance string) string {
	text, err := os.ReadFile(filepath.Join(instance, "cdr-updater.toml"))
	if err != nil {
		return "http://127.0.0.1:8765"
	}
	for _, line := range strings.Split(string(text), "\n") {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "update_server") {
			return tomlValue(line)
		}
	}
	return "http://127.0.0.1:8765"
}

func readUpdateToken(instance string) string {
	text, err := os.ReadFile(filepath.Join(instance, "cdr-updater.toml"))
	if err != nil {
		return ""
	}
	for _, line := range strings.Split(string(text), "\n") {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "update_token") {
			return tomlValue(line)
		}
	}
	return ""
}

func tomlValue(line string) string {
	_, value, ok := strings.Cut(line, "=")
	if !ok {
		return ""
	}
	value = strings.TrimSpace(value)
	value = strings.Trim(value, "\"")
	return value
}

func tokenHeader(token string) map[string]string {
	if token == "" {
		return nil
	}
	return map[string]string{"X-CDR-Token": token}
}

func fileSHA(path string) (string, bool) {
	info, err := os.Stat(path)
	if err != nil || info.IsDir() {
		return "", false
	}
	sum, err := hashFile(path)
	if err != nil {
		return "", false
	}
	return sum, true
}

func markServerKeep(instance string) {
	target := filepath.Join(instance, filepath.FromSlash(serverKeep))
	_ = os.MkdirAll(filepath.Dir(target), 0o755)
	_ = os.WriteFile(target, []byte("keep\n"), 0o644)
}

func writeJSON(path string, value any) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	buf, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return os.WriteFile(path, buf, 0o644)
}
