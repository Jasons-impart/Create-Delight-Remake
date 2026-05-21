#!/usr/bin/env bash
set -euo pipefail

# download_mods.sh - Download all mod JARs via packwiz-installer
# Usage: download_mods.sh [PORT]
#   PORT: HTTP server port (default: 8080)
#
# Required env vars (from workflow-level env):
#   PACKWIZ_FILES_RAW_PREFIX - GitHub raw URL prefix for packwiz-files/
#   PACKWIZ_INSTALLER_BOOTSTRAP_URL - URL for packwiz-installer-bootstrap.jar

PORT="${1:-8080}"

# 1. Create temp pack directory, copy metadata and packwiz-files/
PACK_DIR=$(mktemp -d)
cp pack.toml "$PACK_DIR/"
cp .packwizignore "$PACK_DIR/" 2>/dev/null || true
touch "$PACK_DIR/index.toml"

# Copy .pw.toml metadata
find mods resourcepacks shaderpacks -name '*.pw.toml' 2>/dev/null | while read -r f; do
  mkdir -p "$PACK_DIR/$(dirname "$f")"
  cp "$f" "$PACK_DIR/$f"
done

# Copy packwiz-files/ (CF-restricted mod/resourcepack/shaderpack JARs)
if [ -d "packwiz-files" ]; then
  cp -r packwiz-files "$PACK_DIR/"
fi

# 2. Replace GitHub raw URLs with localhost in .pw.toml files
LOCAL_PREFIX="http://127.0.0.1:$PORT/packwiz-files/"
find "$PACK_DIR" -name '*.pw.toml' -exec sed -i "s|${PACKWIZ_FILES_RAW_PREFIX}|${LOCAL_PREFIX}|g" {} +

# 3. Refresh index in temp directory
(cd "$PACK_DIR" && "$OLDPWD/packwiz" refresh)

# 4. Start Python HTTP server
python3 -m http.server $PORT --directory "$PACK_DIR" &
SERVER_PID=$!

# Wait for server to be ready
for i in $(seq 1 25); do
  if curl -s -o /dev/null "http://127.0.0.1:$PORT/pack.toml"; then break; fi
  sleep 0.2
done

# 5. Download and run packwiz-installer-bootstrap
curl -o packwiz-installer-bootstrap.jar -L "$PACKWIZ_INSTALLER_BOOTSTRAP_URL"
java -jar packwiz-installer-bootstrap.jar -g "http://127.0.0.1:$PORT/pack.toml"

# 6. Cleanup
kill $SERVER_PID 2>/dev/null || true
rm -rf "$PACK_DIR" packwiz-installer-bootstrap.jar
