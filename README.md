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
  - Active working set is automatically reclaimed using Win32 recursive process-tree trimming (`SetProcessWorkingSetSize` across host and all `msedgewebview2.exe` renderer and GPU child processes).
  - Idle background footprint: **~60MB–85MB** (vs. ~800MB–1.2GB on official client).
  - Low-overhead browser flags: background networking, domain reliability, speech synthesis, and telemetry disabled.
- **Decoupled Modularity**:
  - `src-tauri/src/memory.rs`: Windows FFI recursive process-tree memory optimization worker.
  - `src-tauri/src/tray.rs`: System tray icon, interactive context menu, and IPC dispatcher.
  - `src-tauri/src/window.rs`: Window configuration, script injection, and minimize-to-tray lifecycle.
  - `src-tauri/assets/`: Encapsulated frontend enhancements (v3.5 GG Extreme) injected at compile time.

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
│   │   ├── storage.rs           # Native recursive storage & cache purge
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
| **Master Privacy Mode** | `Ctrl + B` | Sensor presisi modular untuk isi teks pesan, media, nama kontak, dan preview sidebar. |
| **Auto-Blur Media Saja** | `Ctrl + Shift + B` | Sensor otomatis foto, video, stiker, dan VN (hover untuk intip, emoji tetap tajam). |
| **Filter Chat Belum Dibaca** | `Ctrl + Shift + U` | Saring hanya percakapan unread via trigger native WhatsApp atau CSS pseudo-class `:has()`. |
| **Anti-Centang Biru (Ghost Read)** | `Ctrl + Shift + G` | Membaca pesan tanpa mengirim laporan terbaca (*read receipts*). |
| **Ghost Typing** | `Ctrl + Shift + T` | Menyembunyikan indikator *"Sedang mengetik..."*. |
| **Direct Chat** | `Ctrl + M` | Kirim pesan instan ke nomor baru tanpa perlu menyimpan ke kontak. |
| **Pin Window (Always on Top)** | `Ctrl + Shift + P` | Pin jendela ModsTams agar selalu melayang di atas aplikasi lain saat multitasking. |
| **Auto-Lock Saat Ditinggal** | *Otomatis* | Kunci layar aplikasi otomatis dengan PIN jika tidak ada aktivitas (2m, 5m, 10m). |
| **App Lock & PIN Security** | `Ctrl + L` | Kunci layar aplikasi seketika dengan PIN 4-digit kustom. |
| **Ultra Dark OLED Mode** | `Ctrl + Shift + O` | Mode Hitam Pekat Murni `#000000` hemat daya monitor/laptop dan kontras tinggi. |
| **Status Saver & View-Once** | *Otomatis* | Tombol unduh otomatis saat melihat status/story kontak dan media 1x lihat (zero-polling). |
| **ModsTams Quick HUD** | `Ctrl + Shift + M` | Popover kendali ringkas terpadu, terintegrasi mulus di navbar atas WhatsApp tanpa floating widget. |
| **One-Click Storage & Media Purge** | `Ctrl + Shift + Del` | Bersihkan cache media, blobs, dan shader disk seketika tanpa logout session WhatsApp Web (otomatis trim RAM). |

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
