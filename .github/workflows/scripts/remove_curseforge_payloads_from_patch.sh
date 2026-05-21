#!/usr/bin/env bash
set -euo pipefail

# Remove payload files from an already-built patch directory when the current
# packwiz metadata says that payload belongs in CurseForge manifest.json.

patch_dir="${1:?Usage: remove_curseforge_payloads_from_patch.sh <patch-dir>}"

read_filename() {
  sed -nE 's/^filename = "(.+)"[[:space:]]*$/\1/p' "$1" | head -n 1
}

remove_for_dir() {
  local dir="$1"
  [ -d "$dir" ] || return 0

  while IFS= read -r -d '' meta; do
    grep -Fq 'mode = "metadata:curseforge"' "$meta" || continue

    local filename
    filename="$(read_filename "$meta")"
    [ -n "$filename" ] || continue

    local payload="${patch_dir}/${dir}/${filename}"
    if [ -f "$payload" ]; then
      echo "Removing CurseForge manifest payload from patch: $payload"
      rm -f "$payload"
    fi
  done < <(find "$dir" -name '*.pw.toml' -print0)

  find "${patch_dir}/${dir}" -name '*.pw.toml' -delete 2>/dev/null || true
}

remove_for_dir mods
remove_for_dir resourcepacks
remove_for_dir shaderpacks
