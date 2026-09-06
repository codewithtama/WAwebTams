# ModsTams &mdash; Enterprise Ultra-Light Desktop Client

[![CI](https://github.com/codewithtama/WAwebTams/actions/workflows/ci.yml/badge.svg)](https://github.com/codewithtama/WAwebTams/actions/workflows/ci.yml)
[![Rust](https://img.shields.io/badge/Rust-1.78%2B-orange.svg?logo=rust)](https://www.rust-lang.org/)
[![Tauri](https://img.shields.io/badge/Tauri-v2-24C8DB.svg?logo=tauri)](https://v2.tauri.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%2F%2011-0078D6.svg?logo=windows)](https://microsoft.com/windows)

A high-performance, ultra-lightweight desktop client wrapper for WhatsApp Web engineered with **Rust** and **Tauri v2**. Designed to slash memory consumption by **70%–80%** compared to standard Electron/Chromium distributions while providing an enterprise-grade productivity mod suite.

---

## Technical Architecture

```
+-------------------------------------------------------------------------+
|                              ModsTams Host                              |
+-----------------------------------+-------------------------------------+
|         Rust Native Host          |      Native WebView2 Runtime        |
|  - Single Instance Mutex          |  - Memory Capped V8 Heap (256MB)    |
|  - System Tray Management         |  - Strict Disk & Media Cache (32MB) |
|  - Win32 Working-Set RAM Trimmer  |  - Injected Mod Suite (Assets)      |
+-----------------------------------+-------------------------------------+
                                    |
                                    v
                     +-----------------------------+
                     |   https://web.whatsapp.com  |
                     +-----------------------------+
```

### Architecture Highlights:
- **Zero Heavy Runtime**: Uses native Microsoft Edge WebView2 (Evergreen) built into Windows OS. No separate Chromium or Node.js runtime process.
- **Aggressive RAM Management**:
  - Chromium V8 JavaScript heap is hard-capped to `256MB` (`--max-old-space-size=256`).
  - Active working set is automatically reclaimed using Win32 `SetProcessWorkingSetSize` every 3 minutes.
  - Idle footprint: **~180MB–250MB** (vs. ~800MB–1.2GB on official client).
- **Decoupled Modularity**:
  - `src-tauri/src/memory.rs`: Windows FFI memory optimization worker.
  - `src-tauri/src/tray.rs`: System tray icon, interactive context menu, and IPC dispatcher.
  - `src-tauri/src/window.rs`: Window configuration, script injection, and minimize-to-tray lifecycle.
  - `src-tauri/assets/`: Encapsulated frontend enhancements injected at compile time.

---

## Repository Structure

```
WAwebTams/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI validation
├── scripts/                     # Build and execution automation
│   ├── build-release.bat        # Production release compiler
│   ├── run-dev.bat              # Development server runner
│   └── start-app.bat            # Application launcher
├── src-tauri/                   # Rust native backend
│   ├── assets/
│   │   └── enhancements.js      # Injected productivity & mod suite script
│   ├── capabilities/
│   │   └── default.json         # Tauri v2 security ACL capabilities
│   ├── icons/                   # Cross-platform application icons
│   ├── src/
│   │   ├── lib.rs               # Core application orchestrator (<30 lines)
│   │   ├── main.rs              # Executable entry point with V8 flags
│   │   ├── memory.rs            # Windows FFI working-set trimmer
│   │   ├── tray.rs              # System tray construction & event routing
│   │   └── window.rs            # Window lifecycle & minimize interception
│   ├── .cargo/
│   │   └── config.toml          # Portable build flags
│   ├── Cargo.toml               # Optimized release profile (LTO, strip)
│   └── tauri.conf.json          # Tauri application manifest
├── ui/
│   └── index.html               # Initial offline loading screen
├── .editorconfig                # Universal indentation and encoding standards
├── .gitattributes               # Line-ending normalizations
├── .gitignore                   # Enterprise git exclusion patterns
├── CHANGELOG.md                 # Semantic versioning release log
├── CONTRIBUTING.md              # Engineering guidelines & PR checklist
├── LICENSE                      # MIT Open-Source License
├── package.json                 # Standardized developer lifecycle scripts
├── README.md                    # Technical documentation
└── SECURITY.md                  # Vulnerability disclosure policy
```

---

## ModsTams Suite Features

| Mod Feature | Shortcut | Description |
| :--- | :--- | :--- |
| **Filter Chat Belum Dibaca** | `Ctrl + Shift + U` | Saring hanya percakapan yang memiliki pesan unread dalam 1-klik. |
| **Auto-Blur Media Saja** | `Ctrl + Shift + B` | Sensor otomatis untuk foto, video, avatar, dan stiker (hover untuk intip). |
| **Anti-Centang Biru (Ghost Read)** | `Ctrl + Shift + G` | Membaca pesan tanpa mengirim laporan terbaca (*read receipts*). |
| **Ghost Typing** | `Ctrl + Shift + T` | Menyembunyikan indikator *"Sedang mengetik..."*. |
| **Anti-Delete & Log History** | *Otomatis* | Pesan yang ditarik pengirim tetap terlihat dan dicatat ke audit log. |
| **Anti View-Once (Bypass 1x Lihat)** | *Otomatis* | Media 1x lihat dapat dibuka berulang kali dan diunduh langsung. |
| **Direct Chat** | `Ctrl + M` | Kirim pesan instan ke nomor baru tanpa perlu menyimpan ke kontak. |
| **Status Saver** | *Otomatis* | Tombol unduh otomatis saat melihat status/story kontak. |
| **Multi-Theme & Ultra Dark OLED** | `Ctrl + Shift + O` | Berbagai tema warna termasuk Emerald, Cyberpunk, OLED Midnight. |
| **App Lock & PIN Security** | `Ctrl + L` | Kunci layar aplikasi seketika dengan PIN 4-digit kustom. |
| **Voice Note Speed & Booster** | *Otomatis* | Percepatan audio VN hingga 3.0x dan penguat volume hingga +200%. |

---

## Getting Started

### Prerequisites
- [Rust Toolchain (cargo)](https://rustup.rs/)
- [Node.js (LTS)](https://nodejs.org/)
- Visual Studio C++ Build Tools (MSVC)

### Development
Jalankan dev server dengan hot-reloading:
```bash
npm run dev
# atau: scripts\run-dev.bat
```

### Production Release Build
Kompilasi binary release portabel yang dioptimasi (LTO + Strip):
```bash
npm run build:portable
# atau: scripts\build-release.bat
```
Hasil executable mandiri akan dibuat di direktori utama: `ModsTams.exe`.

### Code Quality & Standards
```bash
# Format Rust code
npm run fmt

# Check Rust code format without altering files
npm run fmt:check

# Run strict Clippy linter
npm run lint
```

---

## Quality Gates & CI/CD
Semua *Pull Request* dan *push* ke branch `main` harus melewati pipeline CI:
1. **Formatting**: `cargo fmt --check` (0 diffs).
2. **Static Analysis**: `cargo clippy -- -D warnings` (0 warnings).
3. **Compilation**: Clean release build on `windows-latest`.

---

## License
Didistribusikan di bawah lisensi [MIT](LICENSE).
