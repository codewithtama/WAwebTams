# Enterprise Security Policy

## 1. Supported Versions

ModsTams provides active security maintenance, dependency patches, and vulnerability remediations according to the following release matrix:

| Version | Status | Security Support | Maintenance SLA |
| :--- | :--- | :--- | :--- |
| **1.3.x** | **Active (Current)** | :white_check_mark: Supported | P0: 24h, P1: 72h |
| 1.2.x | Deprecated | :warning: Critical Only | Best effort |
| 1.1.x | End of Life (EOL) | :x: Not supported | None |
| 1.0.x | End of Life (EOL) | :x: Not supported | None |

---

## 2. Security Guarantees & Privacy Architecture

ModsTams is architected under a **Zero-Telemetry, Zero-Egress, Client-Side-Only** model:

1. **Zero Remote Telemetry**: ModsTams contains **no** analytical beacons, metrics collectors, trackers, or crash-reporting telemetry backends.
2. **Zero Remote Data Retention**: All mod data structures (e.g., Anti-Tarik message cache, Anti-Edit diff snapshots, Anti-View-Once blobs) reside strictly in volatile RAM within the user's local Microsoft Edge WebView2 sandbox process. Nothing is synchronized to third-party cloud infrastructure.
3. **Network Egress Boundary**: The application communicates exclusively with WhatsApp Web servers (`*.whatsapp.com`, `*.whatsapp.net`). Any attempted outbound network request to any other endpoint is strictly prohibited.
4. **Local Cryptographic Boundary**: All session secrets, QR credentials, and IndexedDB tokens are managed directly by the official WhatsApp Web client engine running inside Microsoft Edge WebView2's isolated profile container (`%LOCALAPPDATA%\com.tams.waweb`).

---

## 3. Vulnerability Severity & Response SLA

We classify security vulnerabilities using the Common Vulnerability Scoring System (CVSS v3.1) and commit to the following incident response service level agreements (SLAs):

| Severity Level | CVSS v3.1 Range | Initial Triage SLA | Fix / Mitigation Target |
| :--- | :--- | :--- | :--- |
| **P0 - Critical** | 9.0 - 10.0 | ≤ **24 hours** | ≤ 48 hours |
| **P1 - High** | 7.0 - 8.9 | ≤ **48 hours** | ≤ 7 calendar days |
| **P2 - Medium** | 4.0 - 6.9 | ≤ **72 hours** | Next scheduled release |
| **P3 - Low** | 0.1 - 3.9 | ≤ **7 calendar days** | Backlog prioritization |

---

## 4. Reporting a Security Vulnerability

If you discover a potential vulnerability or security flaw in ModsTams, we appreciate your responsible disclosure:

### Disclosure Channel:
- **GitHub Security Advisory**: Submit a private report via [GitHub Security Advisories](https://github.com/codewithtama/WAwebTams/security/advisories/new).
- **Encrypted Contact**: If GitHub Advisories is inaccessible, send a GPG-encrypted email to `security@modstams.dev`.

### Report Requirements:
Please provide a comprehensive technical report including:
1. Exact ModsTams version and build SHA.
2. Operating System version and Microsoft Edge WebView2 Runtime build number.
3. Step-by-step reproduction walkthrough with proof-of-concept (PoC).
4. Impact assessment (privilege escalation, sandbox escape, memory disclosure).

### Safe Harbor:
Any responsible security research conducted within the bounds of this policy—without disrupting services, destroying data, or accessing data belonging to other users—will not be met with legal action.
