package main

import "testing"

func TestOverwriteRules(t *testing.T) {
	yes := true
	no := false
	if !shouldOverwriteLocal("mods/a.jar", "client", "", "abc", nil, false, nil, false) {
		t.Fatal("missing file should download")
	}
	if shouldOverwriteLocal("mods/a.jar", "client", "abc", "abc", nil, false, nil, false) {
		t.Fatal("same hash should skip")
	}
	if shouldOverwriteLocal("config/a.toml", "server", "local", "remote", map[string]string{}, false, nil, false) {
		t.Fatal("protected config should stay")
	}
	if !shouldOverwriteLocal("mods/a.jar", "server", "old", "new", map[string]string{"mods/a.jar": "old"}, false, nil, false) {
		t.Fatal("unedited server file should update")
	}
	if shouldOverwriteLocal("mods/a.jar", "server", "admin", "new", map[string]string{"mods/a.jar": "old"}, false, nil, false) {
		t.Fatal("admin edit should stay")
	}
	if !shouldOverwriteLocal("mods/private.jar", "server", "old", "new", map[string]string{"mods/private.jar": "old"}, true, nil, false) {
		t.Fatal("overlay mod should force")
	}
	if shouldOverwriteLocal("server.properties", "server", "local", "remote", nil, false, &yes, true) {
		t.Fatal("keep marker blocks template")
	}
	if !shouldOverwriteLocal("server.properties", "server", "forge", "template", nil, false, &no, false) {
		t.Fatal("missing tag should take template")
	}
	tagged := withManagedTag("motd=a\n")
	if tagged != "motd=a\n"+managedTag+"\n" {
		t.Fatalf("tag position: %q", tagged)
	}
}
