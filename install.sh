#!/usr/bin/env bash
# ============================================================
#  ModsTams — One-Click Installer for Ubuntu / Debian / Mint
#  Jalankan: bash install.sh
#  Tidak butuh sudo di awal — script akan minta sendiri saat perlu
# ============================================================
set -euo pipefail

# ── Colours ─────────────────────────────────────────────────
BOLD="\033[1m"; RESET="\033[0m"
RED="\033[0;31m"; GREEN="\033[0;32m"; YELLOW="\033[0;33m"
CYAN="\033[0;36m"; BLUE="\033[0;34m"; DIM="\033[2m"

# ── Paths ────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
CARGO_TOML="$PROJECT_ROOT/src-tauri/Cargo.toml"
OUTPUT_BIN="$PROJECT_ROOT/src-tauri/target/release/ModsTams"
INSTALL_DIR="$HOME/.local/bin"
INSTALLED_BIN="$INSTALL_DIR/ModsTams"
ICON_SRC="$PROJECT_ROOT/src-tauri/icons/128x128.png"
DESKTOP_DIR="$HOME/.local/share/applications"
DESKTOP_FILE="$DESKTOP_DIR/modstams.desktop"
DESKTOP_SHORTCUT="$HOME/Desktop/ModsTams.desktop"
LOGFILE="/tmp/modstams-install.log"

# ── Helpers ──────────────────────────────────────────────────
step()  { echo -e "\n${CYAN}${BOLD}▶ $*${RESET}"; }
ok()    { echo -e "  ${GREEN}✔${RESET}  $*"; }
warn()  { echo -e "  ${YELLOW}⚠${RESET}  $*"; }
fail()  { echo -e "\n${RED}${BOLD}✘ ERROR: $*${RESET}" >&2; exit 1; }
info()  { echo -e "  ${DIM}$*${RESET}"; }

hr() {
    echo -e "${CYAN}${BOLD}════════════════════════════════════════════════════${RESET}"
}

spinner() {
    local pid=$1 msg=$2
    local frames=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
    local i=0
    while kill -0 "$pid" 2>/dev/null; do
        printf "\r  ${CYAN}%s${RESET}  %s..." "${frames[$((i % ${#frames[@]}))]}" "$msg"
        ((i++)); sleep 0.1
    done
    printf "\r%-60s\r" " "
}

# ── Banner ───────────────────────────────────────────────────
clear
hr
echo -e "${CYAN}${BOLD}"
echo   "      __  __           _    _____"
echo   "     |  \/  | ___   __| |__|_   _|__ _ _ __ ___  ___"
echo   "     | |\/| |/ _ \ / _\` / __|| |/ _\` | '_ \` _ \/ __|"
echo   "     | |  | | (_) | (_| \__ \| | (_| | | | | | \__ \\"
echo   "     |_|  |_|\___/ \__,_|___/|_|\__,_|_| |_| |_|___/"
echo -e "${RESET}"
echo -e "     ${DIM}WhatsApp Web Desktop  •  Ubuntu Installer v1.3.0${RESET}"
hr
echo ""
echo -e "  ${DIM}Log: $LOGFILE${RESET}"
echo ""

# ── 0. Detect Ubuntu / Debian ────────────────────────────────
step "Mendeteksi sistem operasi..."
if ! command -v apt-get &>/dev/null; then
    fail "Script ini hanya untuk sistem berbasis Debian/Ubuntu (apt tidak ditemukan)."
fi
DISTRO=$(lsb_release -ds 2>/dev/null || cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2 || echo "Linux")
ok "Sistem terdeteksi: $DISTRO"

# ── 1. System dependencies ───────────────────────────────────
step "Menginstall system dependencies (membutuhkan sudo)..."
info "GTK3, WebKit2GTK 4.1, AppIndicator3, build tools..."

APT_PKGS=(
    build-essential
    curl
    wget
    git
    pkg-config
    libgtk-3-dev
    libwebkit2gtk-4.1-dev
    libsoup-3.0-dev
    libjavascriptcoregtk-4.1-dev
    libglib2.0-dev
    libssl-dev
    libayatana-appindicator3-dev
    librsvg2-dev
    nodejs
    npm
)

# Fallback: Ubuntu 20.04 uses webkit2gtk-4.0
WEBKIT_PKG="libwebkit2gtk-4.1-dev"
if ! apt-cache show libwebkit2gtk-4.1-dev &>/dev/null 2>&1; then
    warn "libwebkit2gtk-4.1-dev tidak tersedia, mencoba libwebkit2gtk-4.0-dev (Ubuntu 20.04)..."
    WEBKIT_PKG="libwebkit2gtk-4.0-dev"
    APT_PKGS=("${APT_PKGS[@]/libwebkit2gtk-4.1-dev/$WEBKIT_PKG}")
fi

(sudo apt-get update -qq && sudo apt-get install -y -qq "${APT_PKGS[@]}") \
    >> "$LOGFILE" 2>&1 &
spinner $! "Menginstall packages"
ok "System dependencies berhasil diinstall"

# ── 2. Rust toolchain ────────────────────────────────────────
step "Mengecek Rust toolchain..."
export PATH="$HOME/.cargo/bin:$PATH"

if ! command -v cargo &>/dev/null; then
    info "Rust belum terinstall. Menginstall via rustup..."
    (curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --profile minimal) \
        >> "$LOGFILE" 2>&1 &
    spinner $! "Menginstall Rust"
    source "$HOME/.cargo/env"
    ok "Rust $(rustc --version) berhasil diinstall"
else
    ok "Rust sudah ada: $(rustc --version)"
fi

# ── 3. Node / npm ────────────────────────────────────────────
step "Mengecek Node.js & npm..."
if ! command -v node &>/dev/null; then
    fail "Node.js tidak ditemukan. Coba: sudo apt install nodejs npm"
fi
ok "Node.js $(node --version)  •  npm $(npm --version)"

# ── 4. Install Tauri CLI ─────────────────────────────────────
step "Menginstall Tauri CLI..."
if ! command -v cargo-tauri &>/dev/null 2>&1; then
    (cd "$PROJECT_ROOT" && npm install --silent) >> "$LOGFILE" 2>&1 &
    spinner $! "npm install"
else
    ok "Tauri CLI sudah tersedia"
fi
(cd "$PROJECT_ROOT" && npm install --silent) >> "$LOGFILE" 2>&1 &
spinner $! "npm install (memastikan node_modules sinkron)"
ok "Node modules siap"

# ── 5. Compile release binary ────────────────────────────────
step "Mengkompilasi ModsTams (release build)..."
info "Ini mungkin butuh 3–10 menit saat pertama kali karena Rust mengkompilasi dependensi..."
echo ""
(cd "$PROJECT_ROOT" && cargo build --manifest-path "$CARGO_TOML" --release 2>&1) \
    | tee -a "$LOGFILE" \
    | grep -E "^(error|warning\[|Compiling|Finished|error\[)" \
    | while IFS= read -r line; do
        if [[ "$line" == error* ]]; then
            echo -e "  ${RED}$line${RESET}"
        elif [[ "$line" == Finished* ]]; then
            echo -e "  ${GREEN}$line${RESET}"
        else
            echo -e "  ${DIM}$line${RESET}"
        fi
    done

[[ -f "$OUTPUT_BIN" ]] || fail "Kompilasi gagal. Lihat log: $LOGFILE"
ok "Kompilasi selesai: $OUTPUT_BIN"

# ── 6. Install binary ────────────────────────────────────────
step "Menginstall binary ke $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"
cp -f "$OUTPUT_BIN" "$INSTALLED_BIN"
chmod +x "$INSTALLED_BIN"

# Pastikan ~/.local/bin ada di PATH
SHELL_RC="$HOME/.bashrc"
[[ "$SHELL" == *"zsh"* ]] && SHELL_RC="$HOME/.zshrc"
if ! grep -q 'LOCAL_BIN_PATH_SET_BY_MODSTAMS' "$SHELL_RC" 2>/dev/null; then
    {
        echo ""
        echo "# LOCAL_BIN_PATH_SET_BY_MODSTAMS"
        echo 'export PATH="$HOME/.local/bin:$PATH"'
    } >> "$SHELL_RC"
fi
export PATH="$HOME/.local/bin:$PATH"
ok "Binary diinstall ke: $INSTALLED_BIN"

# ── 7. Desktop entry (.desktop) ──────────────────────────────
step "Membuat shortcut di Applications menu & Desktop..."
mkdir -p "$DESKTOP_DIR"

ICON_DEST="$HOME/.local/share/icons/modstams.png"
mkdir -p "$(dirname "$ICON_DEST")"
cp -f "$ICON_SRC" "$ICON_DEST"

cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Version=1.3.0
Type=Application
Name=ModsTams
GenericName=WhatsApp Desktop
Comment=Ultra-lightweight WhatsApp Web wrapper with privacy mods
Exec=$INSTALLED_BIN
Icon=$ICON_DEST
Terminal=false
Categories=Network;InstantMessaging;
Keywords=whatsapp;chat;messaging;
StartupWMClass=ModsTams
StartupNotify=true
EOF

chmod +x "$DESKTOP_FILE"

# Shortcut di Desktop
if [[ -d "$HOME/Desktop" ]]; then
    cp -f "$DESKTOP_FILE" "$DESKTOP_SHORTCUT"
    chmod +x "$DESKTOP_SHORTCUT"
    # Beritahu GNOME bahwa file .desktop ini trusted
    gio set "$DESKTOP_SHORTCUT" metadata::trusted true 2>/dev/null || true
    ok "Shortcut Desktop dibuat: $DESKTOP_SHORTCUT"
fi

# Update desktop database
update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
ok "Applications menu entry dibuat"

# ── 8. Done ──────────────────────────────────────────────────
echo ""
hr
echo -e "${GREEN}${BOLD}"
echo   "  ✔  ModsTams berhasil diinstall!"
echo -e "${RESET}"
echo -e "  ${DIM}Cara membuka aplikasi:${RESET}"
echo -e "   • ${BOLD}Double-click ikon ModsTams${RESET} di Desktop"
echo -e "   • Atau cari ${BOLD}ModsTams${RESET} di Applications menu (Super key)"
echo -e "   • Atau dari terminal: ${BOLD}ModsTams${RESET}"
echo ""
echo -e "  ${DIM}Untuk uninstall: ${BOLD}bash uninstall.sh${RESET}"
echo ""
hr
echo ""

# ── 9. Tanya apakah langsung launch ──────────────────────────
read -rp "  Mau langsung buka ModsTams sekarang? [Y/n] " LAUNCH
LAUNCH="${LAUNCH:-Y}"
if [[ "$LAUNCH" =~ ^[Yy]$ ]]; then
    echo -e "\n  ${GREEN}▶ Meluncurkan ModsTams...${RESET}\n"
    nohup "$INSTALLED_BIN" >/dev/null 2>&1 &
    disown
fi
