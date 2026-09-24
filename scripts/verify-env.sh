#!/usr/bin/env bash
# ===========================================================
# [ModsTams] Toolchain & Environment Diagnostics (Linux / macOS)
# Equivalent of: verify-env.ps1
# ===========================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENHANCEMENTS_JS="$PROJECT_ROOT/src-tauri/assets/enhancements.js"

bold="\033[1m"; cyan="\033[0;36m"; green="\033[0;32m"; yellow="\033[0;33m"; red="\033[0;31m"; reset="\033[0m"
FAILURES=0

check_cmd() {
    local cmd="$1"
    local label="$2"
    local ver_arg="${3:---version}"

    if command -v "$cmd" &>/dev/null; then
        local ver
        ver=$("$cmd" $ver_arg 2>&1 | head -1) || ver="(found)"
        echo -e "  ${green}[OK]${reset}   $label ($ver)"
        return 0
    else
        echo -e "  ${red}[FAIL]${reset} $label — NOT found in PATH"
        FAILURES=$((FAILURES + 1))
        return 1
    fi
}

echo -e "${cyan}${bold}==================================================="
echo -e "[ModsTams] Toolchain & Environment Diagnostics"
echo -e "===================================================${reset}\n"

# ---- 1. Core toolchains --------------------------------------------------
echo -e "${yellow}1. Checking Core Toolchains...${reset}"
check_cmd cargo  "Rust Cargo"
check_cmd rustc  "Rust Compiler (rustc)"
check_cmd rustfmt "Rust Code Formatter (rustfmt)"
check_cmd node   "Node.js Runtime"
check_cmd npm    "Node Package Manager (npm)"

echo ""

# ---- 2. Linux system libraries (Tauri deps) ------------------------------
if [[ "$(uname -s)" == "Linux" ]]; then
    echo -e "${yellow}2. Checking Linux GTK / WebKitGTK System Libraries...${reset}"

    check_pkg() {
        local lib="$1"
        local label="$2"
        if pkg-config --exists "$lib" 2>/dev/null; then
            local ver
            ver=$(pkg-config --modversion "$lib" 2>/dev/null || echo "found")
            echo -e "  ${green}[OK]${reset}   $label ($ver)"
        else
            echo -e "  ${red}[FAIL]${reset} $label — run: sudo apt install $3"
            FAILURES=$((FAILURES + 1))
        fi
    }

    check_pkg "gtk+-3.0"          "GTK+ 3"                   "libgtk-3-dev"
    check_pkg "webkit2gtk-4.1"    "WebKit2GTK 4.1"           "libwebkit2gtk-4.1-dev"
    check_pkg "libsoup-3.0"       "libsoup 3"                "libsoup-3.0-dev"
    check_pkg "javascriptcoregtk-4.1" "JavaScriptCore GTK"   "libjavascriptcoregtk-4.1-dev"
    check_pkg "glib-2.0"          "GLib 2"                   "libglib2.0-dev"

    echo ""

    # Check for AppIndicator / libayatana (tray icon support on Ubuntu)
    echo -e "${yellow}   Checking Tray Icon Support...${reset}"
    if pkg-config --exists "ayatana-appindicator3-0.1" 2>/dev/null; then
        echo -e "  ${green}[OK]${reset}   Ayatana AppIndicator3 (tray icon)"
    elif pkg-config --exists "appindicator3-0.1" 2>/dev/null; then
        echo -e "  ${green}[OK]${reset}   AppIndicator3 (tray icon)"
    else
        echo -e "  ${yellow}[WARN]${reset} AppIndicator3 not found — tray icon may not appear on Ubuntu."
        echo -e "         Install with: sudo apt install libayatana-appindicator3-dev"
        echo -e "         (Not a hard build failure — app will still run without tray.)"
    fi

    echo ""
fi

# ---- 3. Verify injected assets -------------------------------------------
echo -e "${yellow}3. Verifying Injected Assets Syntax...${reset}"
if [[ -f "$ENHANCEMENTS_JS" ]]; then
    if node --check "$ENHANCEMENTS_JS" 2>&1; then
        echo -e "  ${green}[OK]${reset}   enhancements.js syntax verified"
    else
        echo -e "  ${red}[FAIL]${reset} enhancements.js has syntax errors"
        FAILURES=$((FAILURES + 1))
    fi
else
    echo -e "  ${red}[FAIL]${reset} $ENHANCEMENTS_JS does not exist"
    FAILURES=$((FAILURES + 1))
fi

echo ""

# ---- Summary -------------------------------------------------------------
echo -e "${cyan}${bold}===================================================${reset}"
if [[ $FAILURES -eq 0 ]]; then
    echo -e "${green}${bold}[STATUS: READY]${reset} All prerequisites and assets are verified!"
    exit 0
else
    echo -e "${red}${bold}[STATUS: INCOMPLETE]${reset} $FAILURES check(s) failed. Resolve the errors above."
    echo ""
    echo -e "Ubuntu quick-install for all Tauri system deps:"
    echo -e "  ${bold}sudo apt update && sudo apt install -y \\"
    echo -e "    libgtk-3-dev libwebkit2gtk-4.1-dev libsoup-3.0-dev \\"
    echo -e "    libjavascriptcoregtk-4.1-dev libglib2.0-dev \\"
    echo -e "    libayatana-appindicator3-dev${reset}"
    exit 1
fi
