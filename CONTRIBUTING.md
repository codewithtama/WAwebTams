# Contributing to ModsTams

Thank you for your interest in contributing to **ModsTams**. This document outlines our engineering guidelines, development workflow, and code quality standards.

---

## 1. Branching Strategy

We follow the **Trunk-Based / GitHub Flow** branch model:
- `main`: Always production-ready and deployable.
- Feature branches: `feat/<feature-name>` (e.g., `feat/audio-booster-v2`).
- Fix branches: `fix/<bug-description>` (e.g., `fix/tray-unminimize-focus`).
- Chore branches: `chore/<description>` (e.g., `chore/bump-tauri-deps`).

---

## 2. Commit Message Convention

We strictly adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Allowed Types:
- `feat`: A new feature or enhancement.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting).
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Changes to build process, auxiliary tools, or libraries.

---

## 3. Engineering Standards

### Rust Code:
- Follow standard formatting: run `cargo fmt --manifest-path src-tauri/Cargo.toml`.
- Pass all strict linter checks: `cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings`.
- Prefer explicit error handling over `unwrap()` in production paths.
- Single Responsibility Principle: keep functions focused and concise (~30 lines max).

### JavaScript / Injected Suite:
- Avoid polluting the global window scope directly; encapsulate state within the designated `window.__modstams` or `window.__waweb` namespaces.
- Handle storage and DOM errors defensively using `try/catch` and fallback guards.

---

## 4. Pre-Commit Verification Checklist

Before submitting a Pull Request, ensure that:
1. `npm run fmt:check` passes without diffs.
2. `npm run lint` passes without any clippy warnings.
3. `npm run build:portable` compiles successfully.
4. No temporary log files, `.tmp` files, or compiled binaries are staged in Git.
