#!/usr/bin/env bash
# ===========================================================
# [ModsTams] Enterprise Clean Pipeline (Linux / macOS)
# Equivalent of: clean.bat
# ===========================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

bold="\033[1m"; cyan="\033[0;36m"; green="\033[0;32m"; yellow="\033[0;33m"; reset="\033[0m"

echo -e "${cyan}${bold}==================================================="
echo -e "[ModsTams] Enterprise Clean Pipeline"
echo -e "===================================================${reset}"

# 1. Kill running instances
echo -e "\n${yellow}[1/3] Menutup instance ModsTams yang sedang aktif...${reset}"
pkill -x ModsTams 2>/dev/null && echo "  -> Instance dihentikan." || echo "  -> Tidak ada instance yang berjalan."

# 2. Remove cargo target directory
echo -e "\n${yellow}[2/3] Membersihkan direktori target Cargo...${reset}"
TARGET_DIR="$PROJECT_ROOT/src-tauri/target"
if [[ -d "$TARGET_DIR" ]]; then
    rm -rf "$TARGET_DIR"
    echo "  -> Cargo target directory removed."
else
    echo "  -> Target directory sudah bersih."
fi

# 3. Remove temp logs and caches
echo -e "\n${yellow}[3/3] Membersihkan file sementara dan cache...${reset}"
find "$PROJECT_ROOT" -maxdepth 1 -name "*.log" -o -name "*.tmp" | xargs rm -f 2>/dev/null || true

echo -e "\n${green}${bold}==================================================="
echo -e "[SUKSES] Lingkungan kerja berhasil dibersihkan!"
echo -e "===================================================${reset}"
