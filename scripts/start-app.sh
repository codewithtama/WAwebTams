#!/usr/bin/env bash
# ===========================================================
# [ModsTams] Application Launcher (Linux / macOS)
# Equivalent of: start-app.bat
# ===========================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BIN_PATH="$PROJECT_ROOT/ModsTams"

if [[ ! -f "$BIN_PATH" ]]; then
    echo "[INFO] ModsTams binary belum dikompilasi. Memulai build release terlebih dahulu..."
    bash "$SCRIPT_DIR/build-release.sh"
fi

if [[ -f "$BIN_PATH" ]]; then
    echo "[ModsTams] Meluncurkan aplikasi..."
    chmod +x "$BIN_PATH"
    # Launch detached so the terminal is freed immediately
    nohup "$BIN_PATH" >/dev/null 2>&1 &
    disown
fi
