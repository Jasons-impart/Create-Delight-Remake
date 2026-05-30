#!/usr/bin/env bash
set -euo pipefail

dest="${1:?Usage: build_click_to_run_client.sh <output-dir>}"

rm -rf "$dest"
mkdir -p "$dest"

copy_if_exists() {
  local src="$1"
  if [ -e "$src" ]; then
    cp -a "$src" "$dest/"
  fi
}

for path in \
  hmclversion.cfg options.txt icon.png LICENSE \
  config defaultconfigs kubejs mods resourcepacks shaderpacks schematics tacz PCL
do
  copy_if_exists "$path"
done

find "$dest" \( -name '*.pw.toml' -o -name 'pack.toml' -o -name 'index.toml' -o -name '.packwizignore' \) -delete
