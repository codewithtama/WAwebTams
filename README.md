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

## Enterprise Engineering Documentation

Comprehensive architectural blueprints, threat modeling, and specifications are maintained under [`docs/`](docs/):

- 🏛️ **[System Architecture (docs/ARCHITECTURE.md)](docs/ARCHITECTURE.md)** &mdash; C4 component breakdown, Win32 working-set trimmer FFI, WebView2 sandbox boundary, and packet interception topology.
- 🛡️ **[Security Threat Model (docs/SECURITY_THREAT_MODEL.md)](docs/SECURITY_THREAT_MODEL.md)** &mdash; Formal STRIDE analysis, zero-telemetry technical guarantee, and memory security invariants.
- ⚡ **[Mod Suite Specification (docs/MOD_SUITE_SPECIFICATION.md)](docs/MOD_SUITE_SPECIFICATION.md)** &mdash; Functional and technical specification for all 15 mod capabilities, LRU eviction limits, and packet schemas.
- 💻 **[Developer Guide (docs/DEVELOPER_GUIDE.md)](docs/DEVELOPER_GUIDE.md)** &mdash; Local environment setup, WebView2 DevTools debugging, memory profiling with Windows Task Manager, and release verification.

---

## Repository Structure

```
WAwebTams/
├── .github/                      # Enterprise CI/CD & Governance
│   ├── ISSUE_TEMPLATE/           # Structured YAML Issue Forms (Bug / Feature RFC)
│   ├── workflows/
│   │   ├── ci.yml                # Multi-stage CI pipeline (Rustfmt, Clippy, JS Syntax, Build)
│   │   └── release.yml           # Automated release publisher with SHA256 checksums
│   ├── dependabot.yml            # Automated dependency updates for Cargo & npm
│   └── PULL_REQUEST_TEMPLATE.md  # Standardized enterprise PR verification checklist
├── docs/                         # Enterprise Technical Documentation
│   ├── ARCHITECTURE.md           # System C4 & process boundary architecture
│   ├── SECURITY_THREAT_MODEL.md  # STRIDE threat model & data privacy guarantees
│   ├── MOD_SUITE_SPECIFICATION.md# Functional mod specs, packet schemas, & LRU limits
│   └── DEVELOPER_GUIDE.md        # Contributor onboarding & performance profiling
├── scripts/                      # Automated build, clean, and verification tooling
│   ├── build-release.bat         # Windows CMD production compiler
│   ├── build-release.ps1         # PowerShell release pipeline with SHA-256 integrity hash
│   ├── run-dev.bat               # Development server runner
│   ├── start-app.bat             # Application launcher
│   ├── clean.bat                 # Build artifact & cache cleaner
│   └── verify-env.ps1            # Developer toolchain diagnostic validator
├── src-tauri/                    # Rust native backend
│   ├── assets/
│   │   └── enhancements.js       # Injected productivity & mod suite engine
│   ├── icons/                    # Cross-platform application icons
│   ├── src/
│   │   ├── lib.rs                # Core application orchestrator (<30 lines)
│   │   ├── main.rs               # Executable entry point with V8 flags
│   │   ├── memory.rs             # Windows FFI working-set trimmer
│   │   ├── storage.rs            # Native recursive storage & cache purge
│   │   ├── tray.rs               # System tray construction & event routing
│   │   └── window.rs             # Window lifecycle & minimize interception
│   ├── Cargo.toml                # Optimized release profile (LTO, strip)
│   └── tauri.conf.json           # Tauri application manifest
├── ui/
│   └── index.html                # Initial offline loading screen
├── .editorconfig                 # Universal indentation and encoding standards
├── .gitattributes                # Line-ending normalizations
├── .gitignore                    # Enterprise git exclusion patterns
├── CHANGELOG.md                  # Semantic versioning release log
├── CODE_OF_CONDUCT.md             # Contributor Covenant v2.1 code of conduct
├── CONTRIBUTING.md               # Enterprise engineering guidelines & PR gates
├── LICENSE                       # MIT Open-Source License
├── package.json                  # Standardized developer lifecycle scripts
├── README.md                     # Executive overview & user guide
└── SECURITY.md                   # Enterprise vulnerability disclosure & SLA policy
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
| **Anti-Tarik Pesan (Anti-Delete)** | `Ctrl + Shift + D` | Intersepsi pesan yang ditarik pengirim ("Pesan ini telah dihapus"), pulihkan teks aslinya dengan badge Linear-style, dan catat ke Revoked Log. |
| **Anti-Edit Inspector** | `Ctrl + Shift + E` | Rekam teks asli sebelum diedit pengirim, tampilkan perbandingan coretan teks asli (*strikethrough*), dan catat ke Edited Log. |
| **Anti-View-Once Destroyer** | `Ctrl + Shift + V` | Bypass pesan 1x lihat (*View-Once*): putar ulang foto/video/VN tanpa batas via vault player dan simpan permanen. |
| **Invisible Story View** | `Ctrl + Shift + S` | Tonton story/status siapapun tanpa nama Anda muncul di daftar penonton (*viewers*) pengirim (blokir receipt WebSocket). |
| **Freeze Last Seen (Zero Presence)** | `Ctrl + Shift + F` | Sembunyikan status *"Online"* saat membuka WA dan bekukan jam terakhir dilihat (*Last Seen*) tanpa memutus koneksi chat. |
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
