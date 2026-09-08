# ModsTams Enterprise Developer Guide

## 1. Prerequisites & Toolchain Setup

ModsTams requires the following standard toolchain components on Windows 10/11 (x64):

| Tool / Dependency | Minimum Version | Installation / Verification |
| :--- | :--- | :--- |
| **Rust & Cargo** | >= 1.75.0 (stable) | `rustup install stable` (via [rustup.rs](https://rustup.rs/)) |
| **Node.js & npm** | >= 18.0.0 (LTS) | `node --version` (via [nodejs.org](https://nodejs.org/)) |
| **MSVC C++ Build Tools** | Visual Studio 2022 | Desktop development with C++ workload |
| **Edge WebView2 Runtime**| Evergreen (installed by default) | Verify via `scripts/verify-env.ps1` |

### One-Click Toolchain Diagnostics:
Run the built-in diagnostic script:
```powershell
npm run verify:env
```
Or directly via PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-env.ps1
```

---

## 2. Directory Layout

```
WAwebTams/
├── .github/                      # GitHub Enterprise CI/CD & Governance
│   ├── ISSUE_TEMPLATE/           # Structured YAML Issue Forms
│   ├── workflows/                # Multi-stage CI & Release pipelines
│   ├── dependabot.yml            # Automated dependency updates
│   └── PULL_REQUEST_TEMPLATE.md  # Standardized PR checklist
├── docs/                         # Enterprise Architecture & Specs
│   ├── ARCHITECTURE.md           # System C4 & process boundaries
│   ├── SECURITY_THREAT_MODEL.md  # STRIDE threat model & data boundaries
│   ├── MOD_SUITE_SPECIFICATION.md# Functional mod specs & packet schemas
│   └── DEVELOPER_GUIDE.md        # Contributor onboarding & debugging
├── scripts/                      # Developer tooling & build automation
│   ├── build-release.bat         # CMD release build pipeline
│   ├── build-release.ps1         # PowerShell release pipeline with SHA256
│   ├── run-dev.bat               # Dev mode launcher
│   ├── clean.bat                 # Artifacts & target cleaner
│   └── verify-env.ps1            # Toolchain diagnostic validator
├── src-tauri/                    # Native Rust Host Subsystem
│   ├── assets/
│   │   └── enhancements.js       # Injected sandboxed Mod Engine
│   ├── icons/                    # Multi-resolution application icons
│   ├── src/
│   │   ├── main.rs               # Window lifecycle & Win32 memory FFI
│   │   └── tray.rs               # System tray engine & IPC dispatcher
│   ├── Cargo.toml                # Rust crate manifest & release profiles
│   └── tauri.conf.json           # Tauri v2 application configuration
├── ui/                           # Minimal web assets / fallback bundle
├── CHANGELOG.md                  # Semantic Versioning Release Notes
├── CODE_OF_CONDUCT.md            # Contributor Covenant v2.1
├── CONTRIBUTING.md                # Enterprise contribution guidelines
├── LICENSE                       # MIT Open Source License
├── package.json                  # Root npm project manifest & scripts
├── README.md                     # Executive overview & user guide
└── SECURITY.md                   # Enterprise vulnerability disclosure & SLA
```

---

## 3. Development Workflow

### 3.1. Starting Development Server
To launch ModsTams in development mode with live Rust recompilation and console logging:
```powershell
npm run dev
```

### 3.2. Inspecting WebView2 DOM & Mod Engine
1. Launch ModsTams in dev mode.
2. Right-click anywhere in the window and select **Inspect** (or press `F12` if DevTools are enabled).
3. The DevTools console exposes the isolated namespace:
   ```javascript
   // Check current active mod states
   console.log(window.__modstams.state);

   // Inspect captured view-once blobs
   console.log(window.__modstams.state.viewOnceVault);

   // Inspect deleted message cache
   console.log(window.__modstams.state.messageCache);
   ```

---

## 4. Code Quality & Linting Gates

Always execute quality gates before staging commits:

```powershell
# Run all linter checks (rustfmt, clippy, node syntax check)
npm run lint:all

# Check formatting only
npm run fmt:check

# Auto-format Rust files
npm run fmt

# Run Clippy with zero tolerance for warnings
npm run lint
```

---

## 5. Compiling Production Release Binary

To generate the standalone optimized portable binary (`ModsTams.exe`):

```powershell
npm run build:portable
```
Or via the automated PowerShell script:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-release.ps1
```

The script will:
1. Verify `enhancements.js` syntax.
2. Run `rustfmt` and `clippy`.
3. Compile using the release profile with **LTO** and **strip**.
4. Output the final binary to the project root: `ModsTams.exe`.
5. Compute and print the file size and **SHA-256 integrity hash**.

---

## 6. Profiling Memory & Performance

To verify that changes adhere to the enterprise memory budget:
1. Open **Windows Task Manager** -> **Details** tab.
2. Locate `ModsTams.exe` (Native Host) and `msedgewebview2.exe` child processes.
3. Observe **Memory (Active Working Set)**:
   - Base state: ~70–95 MB.
   - When minimized to tray: drops to ~18–25 MB due to `SetProcessWorkingSetSize` memory trim.
4. Verify **CPU Utilization**: Ensure CPU stays strictly at **0.0%** when idle (no polling loops).
