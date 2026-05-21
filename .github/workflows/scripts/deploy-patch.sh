#!/bin/bash
echo "Applying Patch..."
BASE_DIR=$(dirname "$(readlink -f "$0")")

# files to be deleted
if [ -f "$BASE_DIR/deleted_files.txt" ]; then
  while IFS= read -r line; do
    file_path="$BASE_DIR/$line"
    if [ -f "$file_path" ]; then
      rm -v "$file_path" || { echo "Error: Cannot delete $file_path"; exit 1; }
    else
      echo "Error: File $file_path not found for deletion"
    fi
  done < "$BASE_DIR/deleted_files.txt"
else
  echo "Error: $BASE_DIR/deleted_files.txt not found"
fi

# move patched files to right place
if [ -d "patch" ]; then
  cp -r "patch/." "." || { echo "Error: Failed to copy 'patch' directory"; exit 1; }
else
  echo "Error: 'patch' directory not found"
fi

# remove patch folder
if [ -d "patch" ]; then
  rm -rf "patch" || { echo "Error: Failed to remove 'patch' directory"; exit 1; }
  rm -rf "deleted_files.txt" || { echo "Error: Failed to remove 'deleted_files.txt'"; exit 1; }
else
  echo "Error: 'patch' directory not found for removal"
fi

echo -e "\nDone!"
