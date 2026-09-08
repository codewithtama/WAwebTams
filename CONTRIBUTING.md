# Contributing to ModsTams

Thank you for your interest in contributing to **ModsTams**. As an enterprise-grade open-source desktop wrapper, we enforce rigorous code quality, memory hygiene, and security standards.

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) and the engineering principles outlined below.

---

## 1. Architecture & Design Principles

Every contribution must honor the following non-negotiable architectural constraints:

1. **Ultra-Lightweight Footprint**: Memory overhead of any new feature must not exceed **200 KB** of RAM. All caching collections must be bounded (e.g., LRU caches capped at explicit bounds like 50 or 1,000 entries). Unbounded Maps, Sets, or arrays are **prohibited**.
2. **Zero-Polling CPU Rule**: Background polling loops (`setInterval` or recursive `setTimeout` timers polling DOM/state) are strictly prohibited. Utilize reactive native browser primitives: `MutationObserver`, event listeners, or WebSocket interceptors. Idle CPU utilization must remain at **0.0%**.
3. **Fail-Safe & Non-Destructive**: Any unexpected failure in the mod suite or DOM manipulation must fail closed without crashing the host WhatsApp Web session or breaking standard messaging functionality.
4. **Zero-Egress Security**: Code must never introduce network egress to any third-party host. All network interactions are strictly confined to `*.whatsapp.com` and `*.whatsapp.net`.

---

## 2. Git Workflow & Branching Model

We adopt the **Trunk-Based / GitHub Flow** branching model:

- `main`: Always production-ready, passing all CI quality gates.
- `feat/<feature-name>`: New capabilities or functional enhancements (e.g., `feat/stealth-audio-player`).
- `fix/<issue-description>`: Bug remediations and patch fixes (e.g., `fix/tray-unminimize-focus`).
- `perf/<optimization>`: Memory, render latency, or binary size optimizations.
- `docs/<topic>`: Documentation, architecture specs, or developer guides.
- `chore/<task>`: Toolchain updates, dependency bumps, or CI modifications.

---

## 3. Commit Message Convention

Commits must follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification:

```
<type>(<scope>): <short summary>

[optional body explaining motivation and architectural impact]

[optional footer(s), e.g., Fixes #123, Closes #456]
```

### Recognized Types:
- `feat`: Introduces a new feature to the codebase.
- `fix`: Patches a bug or regression.
- `perf`: Code change that improves memory usage or CPU latency.
- `refactor`: Structural change that neither alters behavior nor adds features.
- `style`: White-space, formatting, semicolons (no logic changes).
- `docs`: Documentation updates only.
- `test`: Adding or adjusting verification routines.
- `chore`: Build scripts, CI pipelines, or auxiliary toolchain maintenance.

### Standard Scopes:
`core`, `tray`, `injection`, `audio`, `privacy`, `anti-tarik`, `anti-edit`, `view-once`, `stealth`, `build`, `ci`.

---

## 4. Engineering Standards

### Rust Backend (`src-tauri/`):
- **Formatting**: Format code with standard rustfmt (`cargo fmt --manifest-path src-tauri/Cargo.toml`).
- **Clippy Linting**: Must pass with zero warnings (`cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings`).
- **Error Handling**: Use explicit typed results with error context; avoid `unwrap()` or `expect()` in production execution paths.
- **Safety**: Keep `unsafe` blocks isolated, strictly documented, and restricted to necessary Win32 FFI operations (such as `SetProcessWorkingSetSize`).

### Injected JavaScript Suite (`src-tauri/assets/enhancements.js`):
- **Encapsulation**: All state must reside within the isolated `window.__modstams` namespace. Never pollute global scope with unnamespaced variables.
- **Syntax Verification**: Must pass syntax check via `node --check src-tauri/assets/enhancements.js`.
- **Defensive Programming**: Wrap all DOM queries and WebSocket hooks in robust `try/catch` error guards.
- **DOM Manipulations**: Use `DocumentFragment` or direct inline style adjustments to minimize browser reflows and repaints.

---

## 5. Pull Request Quality Gates

Before submitting a Pull Request, verify that all automated gates pass locally:

```powershell
# 1. Verify developer toolchain & runtime
npm run verify:env

# 2. Run full linting suite (rustfmt, clippy, node syntax)
npm run lint:all

# 3. Verify release compilation
npm run build:portable
```

### Pull Request Checklist:
- [ ] PR title adheres to Conventional Commits format.
- [ ] Description clearly explains the *Why*, the *How*, and alternatives considered.
- [ ] Memory footprint verified (no memory leaks; bounded collections verified).
- [ ] Zero telemetry and zero third-party network egress maintained.
- [ ] Automated and manual verification steps documented.
