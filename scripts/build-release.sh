#!/usr/bin/env bash
# ===========================================================
# [ModsTams] Enterprise Release Build Pipeline (Linux / macOS)
# Equivalent of: build-release.bat / build-release.ps1
# ===========================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CARGO_TOML="$PROJECT_ROOT/src-tauri/Cargo.toml"
ENHANCEMENTS_JS="$PROJECT_ROOT/src-tauri/assets/enhancements.js"
OUTPUT_BIN="$PROJECT_ROOT/src-tauri/target/release/ModsTams"
DIST_BIN="$PROJECT_ROOT/ModsTams"

SKIP_LINT=0
for arg in "$@"; do
    [[ "$arg" == "--skip-lint" ]] && SKIP_LINT=1
done

bold="\033[1m"; cyan="\033[0;36m"; green="\033[0;32m"; yellow="\033[0;33m"; red="\033[0;31m"; reset="\033[0m"

echo -e "${cyan}${bold}==================================================="
echo -e "[ModsTams] Enterprise Build & Release Pipeline"
echo -e "===================================================${reset}"

# ---- 1. JavaScript syntax check ------------------------------------------
echo -e "\n${yellow}[1/5] Validating Injected JavaScript Syntax...${reset}"
node --check "$ENHANCEMENTS_JS"
echo -e "  -> ${green}enhancements.js syntax is valid.${reset}"

# ---- 2. Rust lint & format gate ------------------------------------------
if [[ $SKIP_LINT -eq 0 ]]; then
    echo -e "\n${yellow}[2/5] Running Rustfmt & Clippy Linter...${reset}"
    cargo fmt --manifest-path "$CARGO_TOML" -- --check
    cargo clippy --manifest-path "$CARGO_TOML" -- -D warnings
    echo -e "  -> ${green}Rust formatting and clippy passed cleanly.${reset}"
else
    echo -e "\n[2/5] Skipping lint (--skip-lint specified)."
fi

# ---- 3. Kill running instances -------------------------------------------
echo -e "\n${yellow}[3/5] Closing active ModsTams instances...${reset}"
pkill -x ModsTams 2>/dev/null || true
sleep 0.5

# ---- 4. Cargo release build ----------------------------------------------
echo -e "\n${yellow}[4/5] Compiling Release Binary (opt-level=3, LTO=fat, strip=true)...${reset}"
BUILD_START=$(date +%s%N)
cargo build --manifest-path "$CARGO_TOML" --release
BUILD_END=$(date +%s%N)
ELAPSED=$(echo "scale=2; ($BUILD_END - $BUILD_START) / 1000000000" | bc)
echo -e "  -> ${green}Compilation completed in ${ELAPSED}s.${reset}"

# ---- 5. Deploy & integrity check -----------------------------------------
echo -e "\n${yellow}[5/5] Deploying and Verifying Binary Integrity...${reset}"
if [[ -f "$OUTPUT_BIN" ]]; then
    cp -f "$OUTPUT_BIN" "$DIST_BIN"
    chmod +x "$DIST_BIN"
    FILE_SIZE=$(stat -c%s "$DIST_BIN" 2>/dev/null || stat -f%z "$DIST_BIN")
    FILE_SIZE_MB=$(echo "scale=2; $FILE_SIZE / 1048576" | bc)
    SHA256=$(sha256sum "$DIST_BIN" 2>/dev/null | awk '{print $1}' \
             || shasum -a 256 "$DIST_BIN" | awk '{print $1}')

    echo -e "\n${green}${bold}==================================================="
    echo -e "BUILD SUCCESSFUL"
    echo -e "===================================================${reset}"
    echo    "  Binary Location : $DIST_BIN"
    echo    "  Binary Size     : ${FILE_SIZE_MB} MB (${FILE_SIZE} bytes)"
    echo    "  SHA-256 Checksum: $SHA256"
    echo -e "${green}${bold}===================================================${reset}"
else
    echo -e "${red}[ERROR] Release binary not found at: $OUTPUT_BIN${reset}" >&2
    exit 1
fi
