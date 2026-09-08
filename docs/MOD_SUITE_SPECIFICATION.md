# ModsTams Functional & Technical Mod Suite Specification

## 1. Overview & Classification Matrix

The ModsTams Mod Suite comprises 15 modular enhancements engineered with zero-polling, event-driven reactive DOM observers, and low-level WebSocket protocol packet interception.

| # | Feature Name | Tier / Rank | Primary Hotkey | Subsystem | Storage Bounds |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Anti-Tarik Pesan** | **Rank SS** | `Ctrl + Shift + D` | DOM Mutation / LRU Cache | 1,000 msgs / 50 logs |
| 2 | **Anti-Edit Inspector** | **Rank SS** | `Ctrl + Shift + E` | DOM Mutation / Text Diff | 1,000 snapshots / 50 logs |
| 3 | **Anti-View-Once Destroyer** | **Rank SS** | `Ctrl + Shift + V` | Media Blob Capture | In-Memory Object URLs |
| 4 | **Invisible Story View** | **Rank S+** | `Ctrl + Shift + S` | WebSocket Packet Filter | Zero RAM (Stateless) |
| 5 | **Freeze Last Seen** | **Rank S+** | `Ctrl + Shift + F` | WebSocket / Visibility API | Zero RAM (Stateless) |
| 6 | **Privacy Blur Shield** | **Rank A** | `Ctrl + Shift + P` | CSS Engine / Filter Graph | Zero RAM (CSS Vars) |
| 7 | **Audio Booster & EQ** | **Rank A** | `Ctrl + Shift + B` | Web Audio DSP Graph | Transient AudioNodes |
| 8 | **Floating PiP Media** | **Rank A** | Auto / Button | Picture-in-Picture API | Transient VideoNode |
| 9 | **Quick Search & Jump** | **Rank B** | `Ctrl + K` | In-App Modal Navigator | Stateless DOM Jump |
| 10 | **Tray Minimization** | **Rank S** | `Ctrl + Shift + W` | Native Win32 Host / FFI | Kernel Working-Set Trim |
| 11 | **Compact Density Mode**| **Rank B** | Preferences HUD | CSS Spacing Transforms | Zero RAM (CSS Vars) |
| 12 | **Glassmorphism Theme** | **Rank B** | Preferences HUD | CSS Backdrop Filters | Zero RAM (CSS Vars) |
| 13 | **Session Statistics**  | **Rank B** | Preferences HUD | Reactive Event Counters | Bounded State Object |
| 14 | **Quick RAM Flush**     | **Rank A** | Preferences HUD | Win32 `EmptyWorkingSet` | Instant Heap Reclaim |
| 15 | **Preferences HUD**    | **Rank S** | `Ctrl + Shift + M` | Modal UI Architecture | Isolated DOM Node |

---

## 2. Technical Specifications

### 2.1. Anti-Tarik Pesan (Client-Side Anti-Delete & Revoke Logger)
- **Mechanism**: The `MutationObserver` registers incoming messages into an LRU Map keyed by message ID (`msgKey`). When WhatsApp receives a revocation protocol stanza, its client script modifies the message DOM node into a generic deletion container (`"Pesan ini telah dihapus"` / `"This message was deleted"`).
- **Intervention**: ModsTams detects the revocation mutation before browser paint, extracts the previous text/media reference from `messageCache`, cancels the deletion visually, and injects a Linear Rose badge:
  ```html
  <div class="modstams-revoked-badge">
    <span>⚠️ [Pesan Ditarik Pengirim • 10:42]</span>
  </div>
  ```
- **Log Entry Schema**:
  ```typescript
  interface RevokedLogEntry {
    id: string;
    sender: string;
    timestamp: string;
    originalContent: string;
    revokedAt: string;
  }
  ```

---

### 2.2. Anti-Edit Inspector (Pre-Edit Diff & Snapshot Vault)
- **Mechanism**: Captures the exact textual string and timestamp of the first received version of every message into `messageCache`.
- **Intervention**: When a sender edits a message, WhatsApp renders an inline `(diedit)` / `(edited)` indicator. ModsTams intercepts this mutation, compares the new text against the initial snapshot, and injects an Amber Linear Comparison subtree:
  ```html
  <div class="modstams-edited-badge">
    <div class="modstams-edited-header">✏️ Sebelum Diedit (10:15):</div>
    <div class="modstams-edited-oldtext"><del>Teks lama sebelum diganti</del></div>
  </div>
  ```
- **Log Entry Schema**:
  ```typescript
  interface EditedLogEntry {
    id: string;
    sender: string;
    timestamp: string;
    originalText: string;
    newText: string;
    editedAt: string;
  }
  ```

---

### 2.3. Anti-View-Once Destroyer (Unlimited Replay & Unlocked Downloader)
- **Mechanism**: Normal WhatsApp Web deletes view-once media immediately upon dismissal, preventing re-opening.
- **Intervention**: ModsTams hooks media element instantiation. When an image or video with `view-once` attributes is rendered, the decrypted media source is cloned as an in-memory `blob:` URL stored in `viewOnceVault`.
- **Capabilities**:
  1. Injects a persistent `"Buka Ulang Media"` (Unlimited Replay) button onto "Opened" bubbles.
  2. Spawns an in-app viewer modal with zooming and rotation.
  3. Provides a direct uncompressed file download button.

---

### 2.4. Invisible Story View / Ghost Status
- **Mechanism**: Intercepts `window.WebSocket.prototype.send`.
- **Packet Filtering**: Drops outgoing read-status receipts matching:
  - Target JID: `status@broadcast`
  - Action / Type: `read-status`, `receipt`
- **User Feedback**: Injects an active ghost status indicator (`👻 Ghost Story Active`) directly into the WhatsApp status viewer header so the user is visually assured their view is undetected.

---

### 2.5. Freeze Last Seen / Zero-Presence Cloak
- **Mechanism**:
  1. WebSocket packet suppression: filters outgoing `presence: available` and `chatstate: composing` packets.
  2. Browser API spoofing: intercepts `document.hasFocus()` and `document.visibilityState` to emulate an inactive or hidden background tab, preventing the WhatsApp client script from triggering automatic presence broadcasts.

---

### 2.6. Audio Equalizer & Dynamic Compressor Booster
- **Mechanism**: Web Audio API DSP pipeline hooked to `<audio>` elements.
- **Nodes**:
  - `BiquadFilterNode` (High-shelf + Peaking filters tuned for voice clarity between 1 kHz and 4 kHz).
  - `DynamicsCompressorNode` (Threshold: -24 dB, Ratio: 4:1, Attack: 0.003s, Release: 0.25s).
  - `GainNode` (Multipliers: 1.0x, 1.5x, 2.0x, 3.0x).
- **Latency**: < 2 ms audio pipeline overhead.

---

## 3. Keyboard Shortcut Matrix

All keyboard shortcuts are globally registered within the WebView context and intercepted at the capture phase:

| Key Combination | Action | Subsystem |
| :--- | :--- | :--- |
| `Ctrl + Shift + M` | Open Preferences HUD | UI / Manager |
| `Ctrl + Shift + D` | Toggle Anti-Tarik Pesan | Anti-Revoke |
| `Ctrl + Shift + E` | Toggle Anti-Edit Inspector | Anti-Edit |
| `Ctrl + Shift + V` | Toggle Anti-View-Once Destroyer | View-Once |
| `Ctrl + Shift + S` | Toggle Invisible Story View | Stealth / WS |
| `Ctrl + Shift + F` | Toggle Freeze Last Seen | Stealth / WS |
| `Ctrl + Shift + P` | Toggle Privacy Blur Shield | Privacy |
| `Ctrl + Shift + B` | Toggle Audio Booster & EQ | Audio DSP |
| `Ctrl + Shift + W` | Minimize / Hide to System Tray | Host / Win32 |
| `Ctrl + K` | Open Quick Search & Jump Navigator | Navigation |
| `Escape` | Dismiss Open Modals & Dialogs | UI / Manager |
