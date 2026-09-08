# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-09-08

### Added
- **Anti-Tarik Pesan (Client-Side Anti-Delete & Revoke Logger)**: Ultra-lightweight DOM-level message retention engine with bounded 1,000-entry LRU ring buffer (<200KB RAM overhead).
- **Non-Destructive Message Restoration**: Detects revoke stanzas / "Pesan ini telah dihapus" and restores original message text inside a sleek Linear/Raycast-style rose badge with timestamp and media type tags.
- **Revoked Messages Log Viewer**: In-app inspector drawer accessible via Preferences HUD (`Ctrl+Shift+M`) displaying captured revoked messages in the current session with one-click clipboard copying.
- **Instant Desktop Alert**: Dispatches real-time discrete Toast alert when a revoked message is intercepted.
- **Keyboard Shortcut & System Tray Integration**: Toggle Anti-Tarik via `Ctrl+Shift+D` or context menu in the Windows system tray.

---

## [1.1.0] - 2026-09-07

### Added
- **Recursive Child-Process Memory Trimming**: Windows FFI snapshot enumerating and trimming physical memory (`SetProcessWorkingSetSize`) across all `msedgewebview2.exe` renderer and GPU child processes, slashing idle RAM to **~60MB–85MB**.
- **Native Always On Top (`Ctrl+Shift+P`)**: Pin window on top of games, IDEs, and browser windows via native Win32 window flags, hotkey, and tray menu.
- **Inactivity Auto-Lock Security**: Zero-overhead idle monitor automatically engaging 4-digit PIN lock when inactive for 2, 5, or 10 minutes.
- **Low-Overhead Chromium Browser Flags**: Injected `--disable-background-networking`, `--disable-domain-reliability`, `--disable-component-update`, `--disable-speech-api`, `--enable-gpu-rasterization`, and `--enable-zero-copy` via `WEBVIEW2_ADDITIONAL_BROWSER_ARGS`.
- **Seamless Native Header Integration**: Injected modern SVG button directly into the WhatsApp Web top navbar, replacing floating draggable widget overlays and eliminating global mouse drag listeners.
- **ModsTams Quick HUD**: Redesigned Control Center into an ultra-compact single-view popover with instant response and zero tab bloat.
- **One-Click Storage & Media Cache Purge (`Ctrl+Shift+Del`)**: Native recursive cache cleaner targeting disposable Chromium cache directories (`Cache`, `Code Cache`, `GPUCache`, `DawnGraphiteCache`, `blob_storage`, `ShaderCache`) and flushing `CacheStorage` without altering user session tokens, IndexedDB, or logging the user out.
- **Native Unread Filter Integration**: Replaced manual virtual DOM row hiding with native WhatsApp Web filter button triggering and zero-loop CSS `:has()` pseudo-class filtering.

### Removed
- Removed floating `#modstams-dock` overlay widget and mousemove/mouseup listeners.
- Removed legacy `midnight` and `crimson` secondary theme styles, standardizing on Emerald and Ultra Dark OLED.
- Removed manual `#pane-side [role="row"]` DOM traversal loops.

---

## [1.0.0] - 2026-09-06

### Added
- Enterprise-grade modular Rust crate architecture (`memory`, `tray`, `window`).
- Dedicated assets pipeline separating frontend/injected JavaScript (`assets/enhancements.js`) from Rust source.
- Automated GitHub Actions CI workflow for `rustfmt`, `clippy`, and compilation validation.
- Standardized cross-platform EditorConfig (`.editorconfig`) and Git attributes (`.gitattributes`).
- Consolidated scripts directory (`scripts/build-release.bat`, `scripts/run-dev.bat`, `scripts/start-app.bat`) with backward-compatible root proxies.
- Portable build configuration decoupling hardcoded local user directories from `.cargo/config.toml`.
- Enterprise documentation suite: `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE`, `SECURITY.md`, and technical architecture `README.md`.

### Performance & Security
- Aggressive V8 memory cap (256MB heap limit, size optimization flags).
- Native Windows `SetProcessWorkingSetSize` periodic physical memory trimmer (3-minute interval).
- System tray minimization and single-instance process mutual exclusion.
- Comprehensive gitignore preventing binary and dependency leaks into version control.
