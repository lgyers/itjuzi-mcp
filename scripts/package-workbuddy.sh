#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/dist"
OUTPUT_FILE="$OUTPUT_DIR/itjuzi-mcp-workbuddy.zip"

node "$ROOT_DIR/scripts/sync-workbuddy-skills.mjs"

node -e '
  const fs = require("fs");
  const path = require("path");
  const root = path.resolve(process.argv[1], "workbuddy");
  for (const file of ["connector-meta.json", "mcp.json", "token-schema.json", "icon.svg"]) {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) throw new Error(`Missing required file: ${file}`);
  }
  JSON.parse(fs.readFileSync(path.join(root, "connector-meta.json"), "utf8"));
  JSON.parse(fs.readFileSync(path.join(root, "mcp.json"), "utf8"));
  JSON.parse(fs.readFileSync(path.join(root, "token-schema.json"), "utf8"));
' "$ROOT_DIR"

mkdir -p "$OUTPUT_DIR"

# 在系统临时目录里生成，再 mv 到 dist：
# 1) 旧的 zip 若是残缺文件，zip 会报 "structure invalid" 而写不进去；
# 2) 直接以 dist 内的路径作为输出，zip 收尾时会在同目录建临时文件并 rename，
#    这一步容易触发安全策略，所以让 zip 只在 /tmp 里活动，最后用 mv 落位。
TMP_FILE="${TMPDIR:-/tmp}/itjuzi-mcp-workbuddy.$$.zip"

(
  cd "$ROOT_DIR/workbuddy"
  zip -rq "$TMP_FILE" connector-meta.json mcp.json token-schema.json icon.svg avatars skills
)
mv -f "$TMP_FILE" "$OUTPUT_FILE"

FILE_SIZE="$(du -h "$OUTPUT_FILE" | cut -f1)"
printf "WorkBuddy connector package created: %s (%s)\n" "$OUTPUT_FILE" "$FILE_SIZE"
