#!/usr/bin/env bash
set -euo pipefail

# prepare_patch_diff.sh - Generate patch files from git diff
# Usage: prepare_patch_diff.sh <latest_tag>
#   latest_tag: The previous release tag to diff against

LATEST_TAG="${1:?Usage: prepare_patch_diff.sh <latest_tag>}"

git diff --name-status "$LATEST_TAG" HEAD > diff_report.txt
cat diff_report.txt

# Parse diff report into added/deleted file lists
grep -E '^D' diff_report.txt | cut -f2 > deleted_files.txt || true
grep -E '^R' diff_report.txt | cut -f2 >> deleted_files.txt || true
grep -E '^[AM]' diff_report.txt | cut -f2 > added_files.txt || true
grep -E '^R' diff_report.txt | cut -f3 >> added_files.txt || true
grep -E '^C' diff_report.txt | cut -f3 >> added_files.txt || true

# Create patch directory and copy added/modified files
mkdir -p patch
while IFS= read -r file; do
  [ -z "$file" ] && continue
  if [ -f "$file" ]; then
    mkdir -p "patch/$(dirname "$file")"
    cp "$file" "patch/$file"
  else
    echo "Warn: $file not found at HEAD" >&2
  fi
done < added_files.txt
