#!/usr/bin/env bash
# ===========================================================
# [ModsTams] Development Server Launcher (Linux / macOS)
# Equivalent of: run-dev.bat
# ===========================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "[ModsTams] Memulai Development Server..."

# Ensure cargo is in PATH (rustup installs to ~/.cargo/bin)
export PATH="$HOME/.cargo/bin:$PATH"

cd "$PROJECT_ROOT"
npm run dev
