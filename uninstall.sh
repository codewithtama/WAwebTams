#!/usr/bin/env bash
# ============================================================
#  ModsTams — Uninstaller for Ubuntu / Debian / Mint
#  Jalankan: bash uninstall.sh
# ============================================================
set -euo pipefail

BOLD="\033[1m"; RESET="\033[0m"
RED="\033[0;31m"; GREEN="\033[0;32m"; CYAN="\033[0;36m"; DIM="\033[2m"

hr() { echo -e "${CYAN}${BOLD}════════════════════════════════════════════════════${RESET}"; }
ok() { echo -e "  ${GREEN}✔${RESET}  $*"; }

INSTALLED_BIN="$HOME/.local/bin/ModsTams"
DESKTOP_FILE="$HOME/.local/share/applications/modstams.desktop"
DESKTOP_SHORTCUT="$HOME/Desktop/ModsTams.desktop"
ICON_FILE="$HOME/.local/share/icons/modstams.png"

clear
hr
echo -e "${RED}${BOLD}     ModsTams — Uninstaller${RESET}"
hr
echo ""

# Kill running instance
pkill -x ModsTams 2>/dev/null && ok "Instance ModsTams dihentikan." || true

# Remove binary
[[ -f "$INSTALLED_BIN" ]]     && { rm -f "$INSTALLED_BIN";    ok "Binary dihapus: $INSTALLED_BIN"; }
[[ -f "$DESKTOP_FILE" ]]      && { rm -f "$DESKTOP_FILE";     ok "Desktop entry dihapus"; }
[[ -f "$DESKTOP_SHORTCUT" ]]  && { rm -f "$DESKTOP_SHORTCUT"; ok "Desktop shortcut dihapus"; }
[[ -f "$ICON_FILE" ]]         && { rm -f "$ICON_FILE";        ok "Icon dihapus"; }

# Remove PATH line we added
for RC in "$HOME/.bashrc" "$HOME/.zshrc"; do
    if [[ -f "$RC" ]]; then
        sed -i '/LOCAL_BIN_PATH_SET_BY_MODSTAMS/d' "$RC" 2>/dev/null || true
        sed -i '/export PATH="\$HOME\/.local\/bin:\$PATH"/d' "$RC" 2>/dev/null || true
    fi
done

update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true

echo ""
hr
echo -e "${GREEN}${BOLD}  ✔  ModsTams berhasil diuninstall.${RESET}"
echo ""
echo -e "  ${DIM}Build artifacts (src-tauri/target) tidak dihapus."
echo -e "  Jalankan: bash scripts/clean.sh  untuk membersihkannya.${RESET}"
echo ""
hr
