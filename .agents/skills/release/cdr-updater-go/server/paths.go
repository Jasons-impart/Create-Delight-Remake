package main

import (
	"os"
	"strings"
	"unicode/utf8"
)

const (
	managedTag = "# cdr-updater-managed"
	serverKeep = "mods/cdr-server.keep"
)

var (
	clientOnlyFiles = map[string]struct{}{
		"options.txt": {}, ".options.txt": {}, "hmclversion.cfg": {}, ".hmclversion.cfg": {},
		"client_jvm_args.example.txt": {}, "kubejs/config/client.properties": {},
	}
	clientOnlyPrefixes = []string{
		"resourcepacks/", "shaderpacks/", "config/fancymenu/", "config/iris/",
		"config/oculus/", "config/sodium/", "config/embeddium/", "config/jei/",
		"kubejs/client_scripts/", "kubejs/client_resources/",
	}
	serverOnlyFiles = map[string]struct{}{
		"start.bat": {}, "start.sh": {}, "user_jvm_args.txt": {}, "server.properties": {},
		"forge.jar": {}, "run.bat": {}, "run.sh": {}, "unix_args.txt": {}, "win_args.txt": {}, "eula.txt": {},
	}
	serverOnlyPrefixes = []string{"libraries/", "kubejs/server_scripts/"}
	protectedFiles     = map[string]struct{}{
		"server.properties": {}, "banned-ips.json": {}, "banned-players.json": {}, "ops.json": {},
		"whitelist.json": {}, "usercache.json": {}, "cdr-updater-state.json": {}, "cdr-updater.toml": {},
		"options.txt": {}, "optionsof.txt": {}, "optionsshaders.txt": {}, "servers.dat": {}, "usernamecache.json": {},
		"eula.txt": {}, "user_jvm_args.txt": {},
	}
	protectedPrefixes = []string{
		"saves/", "world/", "world_nether/", "world_the_end/", "logs/",
		"crash-reports/", "libraries/", "versions/", "screenshots/",
		"replay_recordings/", "journeymap/", "XaeroWorldMap/", "XaeroWaypoints/", "local/",
		"config/", "defaultconfigs/",
	}
)

func posix(path string) string {
	path = strings.ReplaceAll(path, "\\", "/")
	path = strings.TrimPrefix(path, "./")
	for strings.Contains(path, "//") {
		path = strings.ReplaceAll(path, "//", "/")
	}
	return strings.TrimPrefix(path, "/")
}

func unsafePath(rel string) bool {
	rel = posix(rel)
	if rel == "" || strings.HasPrefix(rel, "/") || strings.Contains(rel, ":") {
		return true
	}
	for _, part := range strings.Split(rel, "/") {
		if part == ".." {
			return true
		}
	}
	return false
}

func hasPrefix(path string, prefixes []string) bool {
	for _, prefix := range prefixes {
		if strings.HasPrefix(path, prefix) {
			return true
		}
	}
	return false
}

func protectedLocal(rel string) bool {
	path := posix(rel)
	if _, ok := protectedFiles[path]; ok {
		return true
	}
	return hasPrefix(path, protectedPrefixes)
}

func defaultSide(rel string) string {
	path := posix(rel)
	if _, ok := clientOnlyFiles[path]; ok || hasPrefix(path, clientOnlyPrefixes) {
		return "client"
	}
	if _, ok := serverOnlyFiles[path]; ok || hasPrefix(path, serverOnlyPrefixes) {
		return "server"
	}
	return "both"
}

func taggedTemplate(rel string) bool {
	return posix(rel) == "server.properties"
}

func hasManagedTag(text string) bool {
	return strings.Contains(text, managedTag)
}

func withManagedTag(text string) string {
	body := text
	if strings.HasPrefix(body, "\uFEFF") {
		body = body[len("\uFEFF"):]
	}
	if hasManagedTag(body) {
		return body
	}
	nl := "\n"
	if strings.Contains(body, "\r\n") {
		nl = "\r\n"
	}
	if body == "" {
		return managedTag + nl
	}
	if strings.HasSuffix(body, "\n") || strings.HasSuffix(body, "\r") {
		return body + managedTag + nl
	}
	return body + nl + managedTag + nl
}

func readManagedTag(path string) bool {
	buf, err := os.ReadFile(path)
	if err != nil || !utf8.Valid(buf) {
		return false
	}
	return hasManagedTag(string(buf))
}
