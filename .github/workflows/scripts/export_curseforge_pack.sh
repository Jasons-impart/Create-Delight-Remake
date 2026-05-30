#!/usr/bin/env bash
set -euo pipefail

# Export a CurseForge pack after release-only metadata normalization.
# Remaining packwiz-files URLs are served from this checkout, so test/release
# branches do not accidentally download stale files from main.

output="${1:?Usage: export_curseforge_pack.sh <output.zip> [port]}"
port="${2:-8082}"

raw_prefix="${PACKWIZ_FILES_RAW_PREFIX:?PACKWIZ_FILES_RAW_PREFIX is required}"
local_prefix="http://127.0.0.1:${port}/packwiz-files/"
server_pid=""

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../.." && pwd)"

restore_urls() {
  find mods resourcepacks shaderpacks -name '*.pw.toml' -exec \
    sed -i "s|${local_prefix}|${raw_prefix}|g" {} + 2>/dev/null || true
}

cleanup() {
  local status=$?
  if [ -n "$server_pid" ]; then
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
  restore_urls
  exit "$status"
}
trap cleanup EXIT

python3 "$repo_root/scripts/generate-packwiz-files.py" --source "$repo_root/modpack.toml" --output-dir "$repo_root"
bash "$script_dir/normalize_packwiz_files_for_curseforge.sh"

mkdir -p "$(dirname "$output")"

if grep -RIl --include='*.pw.toml' "$raw_prefix" mods resourcepacks shaderpacks >/dev/null 2>&1; then
  find mods resourcepacks shaderpacks -name '*.pw.toml' -exec \
    sed -i "s|${raw_prefix}|${local_prefix}|g" {} +

  python3 -m http.server "$port" --directory "." &
  server_pid=$!

  for _ in $(seq 1 25); do
    if curl -fsS -o /dev/null "http://127.0.0.1:${port}/pack.toml"; then
      break
    fi
    sleep 0.2
  done

  curl -fsS -o /dev/null "http://127.0.0.1:${port}/pack.toml"
fi

./packwiz refresh
./packwiz -y curseforge export -o "$output"
