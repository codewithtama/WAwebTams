# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
