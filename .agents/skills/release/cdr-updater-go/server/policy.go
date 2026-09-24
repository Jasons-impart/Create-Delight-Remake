package main

func shouldDeleteLocal(path string, managed map[string]struct{}) bool {
	rel := posix(path)
	if protectedLocal(rel) {
		return false
	}
	_, ok := managed[rel]
	return ok
}

func shouldOverwriteLocal(path, side, localSha, remoteSha string, synced map[string]string, overlay bool, localHasTag *bool, keepLocal bool) bool {
	rel := posix(path)
	if remoteSha == "" {
		return false
	}
	if localSha == "" {
		return true
	}
	if localSha == remoteSha {
		return false
	}
	if taggedTemplate(rel) {
		if keepLocal {
			return false
		}
		if localHasTag == nil || !*localHasTag {
			return true
		}
		previous, ok := synced[rel]
		return ok && localSha == previous
	}
	if overlay && !protectedLocal(rel) {
		return true
	}
	if protectedLocal(rel) {
		return false
	}
	if side != "server" {
		return true
	}
	previous, ok := synced[rel]
	if !ok {
		return false
	}
	return localSha == previous
}
