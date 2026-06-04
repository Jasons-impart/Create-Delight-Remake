#!/usr/bin/env bash
set -euo pipefail

# Copy only payloads that are not represented by CurseForge metadata. The
# resulting patch relies on manifest.json for CurseForge-hosted files and keeps
# actual files only for Modrinth/direct/custom entries.

dest="${1:?Usage: copy_non_curseforge_payloads.sh <dest-dir>}"
mkdir -p "$dest"
cdc_dev_jar="Create-Delight-Core-1.20.1-dev.jar"

read_filename() {
  sed -nE 's/^filename = "(.+)"[[:space:]]*$/\1/p' "$1" | head -n 1
}

has_curseforge_metadata() {
  local dir="$1"
  local filename="$2"

  while IFS= read -r -d '' meta; do
    grep -Fxq "filename = \"$filename\"" "$meta" || continue
    grep -Fq 'mode = "metadata:curseforge"' "$meta" || continue
    return 0
  done < <(find "$dir" -name '*.pw.toml' -print0 2>/dev/null)

  return 1
}

copy_for_dir() {
  local dir="$1"
  [ -d "$dir" ] || return 0

  rm -rf "${dest:?}/${dir}"

  while IFS= read -r -d '' meta; do
    local filename
    filename="$(read_filename "$meta")"
    [ -n "$filename" ] || continue

    if has_curseforge_metadata "$dir" "$filename"; then
      echo "Skipping CurseForge manifest payload: ${dir}/${filename}"
      continue
    fi

    local src="${dir}/${filename}"
    if [ -f "$src" ]; then
      mkdir -p "${dest}/${dir}"
      cp "$src" "${dest}/${dir}/"
    else
      echo "::warning::Missing non-CurseForge payload referenced by $meta: $src"
    fi
  done < <(find "$dir" -name '*.pw.toml' -print0)
}

copy_for_dir mods

if [ -f "mods/$cdc_dev_jar" ] && ! has_curseforge_metadata mods "$cdc_dev_jar"; then
  mkdir -p "$dest/mods"
  cp "mods/$cdc_dev_jar" "$dest/mods/"
fi

copy_for_dir resourcepacks
copy_for_dir shaderpacks
