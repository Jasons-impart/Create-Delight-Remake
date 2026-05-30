#!/usr/bin/env bash
set -euo pipefail

# Convert packwiz-files-backed mod JARs to CurseForge metadata when CurseForge
# can identify them. This keeps branch-local packwiz-files useful for dev while
# avoiding CurseForge-hosted JARs in release artifacts.

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../.." && pwd)"

copied_list="$(mktemp)"

cleanup() {
  if [ -f "$copied_list" ]; then
    while IFS= read -r file; do
      [ -n "$file" ] && rm -f "$file"
    done < "$copied_list"
    rm -f "$copied_list"
  fi
}
trap cleanup EXIT

python3 "$repo_root/scripts/generate-packwiz-files.py" --source "$repo_root/modpack.toml" --output-dir "$repo_root"

read_filename() {
  sed -nE 's/^filename = "(.+)"[[:space:]]*$/\1/p' "$1" | head -n 1
}

has_curseforge_metadata() {
  local dir="$1"
  local filename="$2"
  local skip_path="${3:-}"

  while IFS= read -r -d '' meta; do
    [ "$meta" = "$skip_path" ] && continue
    grep -Fxq "filename = \"$filename\"" "$meta" || continue
    grep -Fq 'mode = "metadata:curseforge"' "$meta" || continue
    return 0
  done < <(find "$dir" -name '*.pw.toml' -print0 2>/dev/null)

  return 1
}

copy_packwiz_file_mods_for_detection() {
  [ -d "mods" ] || return 0
  [ -d "packwiz-files/mods" ] || return 0

  while IFS= read -r -d '' meta; do
    grep -Fq 'packwiz-files/mods/' "$meta" || continue

    local filename
    filename="$(read_filename "$meta")"
    if [ -z "$filename" ]; then
      echo "::warning::Cannot read filename from $meta"
      continue
    fi

    local src="packwiz-files/mods/$filename"
    local dest="mods/$filename"
    if [ ! -f "$src" ]; then
      echo "::warning::Missing packwiz-files payload for $meta: $src"
      continue
    fi

    if [ ! -f "$dest" ]; then
      cp "$src" "$dest"
      printf '%s\n' "$dest" >> "$copied_list"
    fi
  done < <(find mods -name '*.pw.toml' -print0)
}

remove_shadowed_direct_metadata() {
  [ -d "mods" ] || return 0

  while IFS= read -r -d '' meta; do
    grep -Fq 'packwiz-files/mods/' "$meta" || continue

    local filename
    filename="$(read_filename "$meta")"
    [ -n "$filename" ] || continue

    if has_curseforge_metadata "mods" "$filename" "$meta"; then
      echo "Removing direct packwiz-files metadata shadowed by CurseForge metadata: $meta"
      rm -f "$meta"
    fi
  done < <(find mods -name '*.pw.toml' -print0)
}

copy_packwiz_file_mods_for_detection

if [ -s "$copied_list" ]; then
  echo "Detecting CurseForge metadata for packwiz-files-backed mods..."
  if ! ./packwiz -y curseforge detect; then
    echo "::warning::CurseForge detection failed or found no usable matches; leaving unmatched packwiz-files entries as direct payloads."
  fi
  remove_shadowed_direct_metadata
else
  echo "No packwiz-files-backed mod JARs found for CurseForge detection."
fi

./packwiz refresh
