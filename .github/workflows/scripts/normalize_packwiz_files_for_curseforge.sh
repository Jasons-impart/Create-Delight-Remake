#!/usr/bin/env bash
set -euo pipefail

# Convert packwiz-files-backed assets to CurseForge metadata when CurseForge can
# identify them by exact filename. This keeps branch-local packwiz-files useful
# for dev while avoiding CurseForge-hosted payloads in release artifacts.

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

read_side() {
  sed -nE 's/^side = "(.+)"[[:space:]]*$/\1/p' "$1" | head -n 1
}

read_name() {
  sed -nE 's/^name = "(.+)"[[:space:]]*$/\1/p' "$1" | head -n 1
}

read_release_curseforge_field() {
  local meta="$1"
  local key="$2"

  awk -v key="$key" '
    /^\[release\.curseforge\][[:space:]]*$/ { in_section = 1; next }
    /^\[/ { in_section = 0 }
    in_section && $0 ~ "^[[:space:]]*" key "[[:space:]]*=" {
      sub(/^[^=]*=[[:space:]]*/, "")
      gsub(/"/, "")
      gsub(/[[:space:]]/, "")
      print
      exit
    }
  ' "$meta"
}

set_side() {
  local meta="$1"
  local side="$2"
  [ -n "$side" ] || side="both"

  if grep -Eq '^side = ".+"[[:space:]]*$' "$meta"; then
    sed -i -E "s/^side = \".+\"[[:space:]]*$/side = \"$side\"/" "$meta"
  else
    sed -i -E "0,/^filename = \".+\"[[:space:]]*$/s//&\nside = \"$side\"/" "$meta"
  fi
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

write_curseforge_metadata_from_release_hint() {
  local meta="$1"
  local dir="$2"
  local filename="$3"

  local project_id file_id
  project_id="$(read_release_curseforge_field "$meta" "project-id")"
  file_id="$(read_release_curseforge_field "$meta" "file-id")"
  [ -n "$project_id" ] && [ -n "$file_id" ] || return 1

  local payload="packwiz-files/$dir/$filename"
  if [ ! -f "$payload" ]; then
    payload="$dir/$filename"
  fi
  if [ ! -f "$payload" ]; then
    echo "::warning::Cannot synthesize CurseForge metadata for $meta; missing payload $filename"
    return 1
  fi

  local name side hash
  name="$(read_name "$meta")"
  [ -n "$name" ] || name="${filename%.*}"
  side="$(read_side "$meta")"
  [ -n "$side" ] || side="both"
  hash="$(sha1sum "$payload" | awk '{print $1}')"

  cat > "$meta" <<EOF
name = "$name"
filename = "$filename"
side = "$side"

[download]
hash-format = "sha1"
hash = "$hash"
mode = "metadata:curseforge"

[update]
[update.curseforge]
file-id = $file_id
project-id = $project_id
EOF

  return 0
}

curseforge_category_for_dir() {
  case "$1" in
    mods) echo "mc-mods" ;;
    resourcepacks) echo "texture-packs" ;;
    shaderpacks) echo "shaders" ;;
    *) return 1 ;;
  esac
}

candidate_queries_for_filename() {
  local filename="$1"
  local stem="${filename%.*}"

  printf '%s\n' "$stem"
  printf '%s\n' "$stem" | sed -E 's/[ _-]+v?[0-9][A-Za-z0-9._+ -]*$//'
  printf '%s\n' "$stem" | sed -E 's/[ _-]+[rRvV]?[0-9].*$//'
}

resolve_curseforge_metadata_for_asset() {
  local dir="$1"
  local filename="$2"
  local output="$3"
  local cf_category
  cf_category="$(curseforge_category_for_dir "$dir")"

  local query
  while IFS= read -r query; do
    [ -n "$query" ] || continue

    local temp_pack
    temp_pack="$(mktemp -d)"
    mkdir -p "$temp_pack/$dir"
    python3 "$repo_root/scripts/generate-packwiz-files.py" --source "$repo_root/modpack.toml" --output-dir "$temp_pack" >/dev/null

    if (cd "$temp_pack" && "$repo_root/packwiz" -y curseforge add "$query" --category "$cf_category" --meta-folder "$dir" >/dev/null 2>&1); then
      local generated
      while IFS= read -r -d '' generated; do
        grep -Fxq "filename = \"$filename\"" "$generated" || continue
        grep -Fq 'mode = "metadata:curseforge"' "$generated" || continue
        cp "$generated" "$output"
        rm -rf "$temp_pack"
        return 0
      done < <(find "$temp_pack/$dir" -name '*.pw.toml' -print0 2>/dev/null)
    fi

    rm -rf "$temp_pack"
  done < <(candidate_queries_for_filename "$filename" | awk '!seen[$0]++')

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

normalize_packwiz_files_for_category() {
  local dir="$1"
  [ -d "$dir" ] || return 0
  [ -d "packwiz-files/$dir" ] || return 0

  while IFS= read -r -d '' meta; do
    grep -Fq "packwiz-files/$dir/" "$meta" || continue

    local filename
    filename="$(read_filename "$meta")"
    if [ -z "$filename" ]; then
      echo "::warning::Cannot read filename from $meta"
      continue
    fi

    local side
    side="$(read_side "$meta")"
    local resolved_meta
    resolved_meta="$(mktemp)"
    if write_curseforge_metadata_from_release_hint "$meta" "$dir" "$filename"; then
      echo "Converted release-hinted packwiz-files metadata to CurseForge metadata: $meta"
    elif resolve_curseforge_metadata_for_asset "$dir" "$filename" "$resolved_meta"; then
      set_side "$resolved_meta" "$side"
      cp "$resolved_meta" "$meta"
      echo "Converted packwiz-files metadata to CurseForge metadata: $meta"
    else
      echo "Keeping direct packwiz-files metadata: $meta"
    fi
    rm -f "$resolved_meta"
  done < <(find "$dir" -name '*.pw.toml' -print0)
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

normalize_packwiz_files_for_category resourcepacks
normalize_packwiz_files_for_category shaderpacks

./packwiz refresh
