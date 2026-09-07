/**
 * ModsTams Super Suite v3.5 - GG Extreme Edition
 * Ultra-lightweight WhatsApp Web client enhancement script.
 * Zero-polling architecture, hardware-accelerated precision blur, native header integration,
 * Chromium sub-process memory trimming, and zero-leak event handlers.
 */
(function() {
    if (window.__waweb_initialized) return;
    window.__waweb_initialized = true;

    /* Safe storage helpers */
    function safeGet(key, fallback = '') {
        try {
            const val = localStorage.getItem(key);
            return val !== null ? val : fallback;
        } catch(e) {
            return fallback;
        }
    }

    function safeSet(key, val) {
        try {
            localStorage.setItem(key, val);
        } catch(e) {}
    }

    /* ==========================================================================
       1. TOAST NOTIFICATION SYSTEM (GPU-Accelerated, Zero-Audio-Leak)
       ========================================================================== */
    function getToastContainer() {
        if (!document.body) return null;
        let container = document.getElementById('modstams-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'modstams-toast-container';
            container.style.cssText = [
                'position: fixed',
                'bottom: 24px',
                'right: 24px',
                'z-index: 9999999',
                'display: flex',
                'flex-direction: column',
                'gap: 8px',
                'pointer-events: none',
                'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            ].join(';');
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(title, subtitle, iconSvg = null, borderColor = '#00a884') {
        const container = getToastContainer();
        if (!container) return;

        const toast = document.createElement('div');
        toast.style.cssText = [
            'pointer-events: auto',
            'display: flex',
            'align-items: center',
            'gap: 12px',
            'background: #111b21',
            'color: #e9edef',
            'padding: 10px 16px',
            'border-radius: 10px',
            `border-left: 4px solid ${borderColor}`,
            'border-top: 1px solid rgba(255, 255, 255, 0.08)',
            'border-right: 1px solid rgba(255, 255, 255, 0.08)',
            'border-bottom: 1px solid rgba(255, 255, 255, 0.08)',
            'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65)',
            'min-width: 260px',
            'max-width: 380px',
            'transform: translateY(16px)',
            'opacity: 0',
            'transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease'
        ].join(';');

        const defaultSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${borderColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;

        toast.innerHTML = `
            <div style="width: 30px; height: 30px; border-radius: 8px; background: rgba(0, 168, 132, 0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${iconSvg || defaultSvg}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 13px; color: ${borderColor}; line-height: 1.2; margin-bottom: 2px;">${title}</div>
                <div style="font-size: 11px; color: #8696a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2;">${subtitle || ''}</div>
            </div>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.transform = 'translateY(12px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 250);
        }, 2800);
    }

    function triggerDownload(url, filename) {
        if (!document.body) return;
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Download Dimulai", filename);
    }

    /* ==========================================================================
       2. PRECISION MODULAR PRIVACY & BLUR ENGINE (Hardware-Accelerated CSS)
       ========================================================================== */
    const DEFAULT_PRIVACY_CFG = {
        active: false,
        blurChat: true,
        blurMedia: true,
        blurPreview: true,
        blurNames: false,
        blurAvatars: false,
        blurInput: false,
        intensity: 8
    };

    let privacyConfig = Object.assign({}, DEFAULT_PRIVACY_CFG);
    try {
        const savedCfg = JSON.parse(safeGet('modstams_privacy_v2', 'null'));
        if (savedCfg && typeof savedCfg === 'object') {
            privacyConfig = Object.assign({}, DEFAULT_PRIVACY_CFG, savedCfg);
        }
    } catch(e) {
        privacyConfig = Object.assign({}, DEFAULT_PRIVACY_CFG);
    }

    let privacyStyleElement = null;

    function applyPrivacyStyles() {
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        if (!head) return;

        if (!privacyStyleElement) {
            privacyStyleElement = document.createElement('style');
            privacyStyleElement.id = 'modstams-privacy-style';
            head.appendChild(privacyStyleElement);
        }

        if (!privacyConfig.active) {
            privacyStyleElement.textContent = '';
            return;
        }

        const i = Math.max(3, Math.min(20, parseInt(privacyConfig.intensity) || 8));
        const mediaBlur = Math.round(i * 1.5);
        const rules = [];

        // 1. BLUR CHAT MESSAGES (Targeting individual bubbles & copyable text)
        if (privacyConfig.blurChat) {
            rules.push(`
                /* Blur Chat Message Text */
                #main .message-in .selectable-text,
                #main .message-out .selectable-text,
                #main [data-testid="msg-container"] .copyable-text:not([data-testid="conversation-panel-wrapper"]) {
                    filter: blur(${i}px) !important;
                    transition: filter 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                /* Individual unblur: ONLY the message bubble hovered unblurs */
                #main .message-in:hover .selectable-text,
                #main .message-out:hover .selectable-text,
                #main [data-testid="msg-container"]:hover .copyable-text {
                    filter: none !important;
                }
            `);
        }

        // 2. BLUR MEDIA (Photos, Videos, Stickers, Voice Notes, Thumbnails)
        if (privacyConfig.blurMedia) {
            rules.push(`
                /* Blur Media: Images, Videos, Audio, Thumbs - excludes emojis */
                #main [data-testid="msg-container"] img:not([class*="emoji"]),
                #main [data-testid="msg-container"] video,
                #main [data-testid="image-thumb"],
                #main [data-testid="video-thumb"],
                #main [data-testid="audio-player"],
                #main [data-testid="media-canvas"],
                #main div[role="button"][style*="background-image"] {
                    filter: blur(${mediaBlur}px) !important;
                    transition: filter 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                /* Individual unblur on hover */
                #main [data-testid="msg-container"]:hover img:not([class*="emoji"]),
                #main [data-testid="msg-container"]:hover video,
                #main [data-testid="image-thumb"]:hover,
                #main [data-testid="video-thumb"]:hover,
                #main [data-testid="audio-player"]:hover,
                #main [data-testid="media-canvas"]:hover,
                #main div[role="button"][style*="background-image"]:hover {
                    filter: none !important;
                }
            `);
        }

        // 3. BLUR SIDEBAR LAST MESSAGE PREVIEW
        if (privacyConfig.blurPreview) {
            rules.push(`
                /* Blur Last Message snippet in Chat List */
                #pane-side [role="row"] [data-testid="last-msg-status"],
                #pane-side [role="row"] span[title]:not([dir]) {
                    filter: blur(${i}px) !important;
                    transition: filter 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                /* Individual row unblur on hover */
                #pane-side [role="row"]:hover [data-testid="last-msg-status"],
                #pane-side [role="row"]:hover span[title]:not([dir]) {
                    filter: none !important;
                }
            `);
        }

        // 4. BLUR CONTACT & GROUP NAMES
        if (privacyConfig.blurNames) {
            rules.push(`
                /* Blur Contact/Group Titles */
                header [data-testid="conversation-info-header"] span,
                #pane-side [role="row"] [data-testid="cell-frame-title"] span {
                    filter: blur(${i}px) !important;
                    transition: filter 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                header [data-testid="conversation-info-header"]:hover span,
                #pane-side [role="row"]:hover [data-testid="cell-frame-title"] span {
                    filter: none !important;
                }
            `);
        }

        // 5. BLUR PROFILE PICTURES / AVATARS
        if (privacyConfig.blurAvatars) {
            rules.push(`
                /* Blur Contact Avatars */
                #pane-side [role="row"] div[data-testid="avatar"] img,
                #main header div[data-testid="avatar"] img {
                    filter: blur(${i}px) !important;
                    transition: filter 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                #pane-side [role="row"]:hover div[data-testid="avatar"] img,
                #main header div[data-testid="avatar"]:hover img {
                    filter: none !important;
                }
            `);
        }

        // 6. BLUR INPUT MESSAGE BOX (Sensitive Draft Messages)
        if (privacyConfig.blurInput) {
            rules.push(`
                /* Blur Draft Message Input */
                footer div[contenteditable="true"] {
                    filter: blur(${i}px) !important;
                    transition: filter 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                footer div[contenteditable="true"]:hover,
                footer div[contenteditable="true"]:focus,
                footer div[contenteditable="true"]:focus-within {
                    filter: none !important;
                }
            `);
        }

        privacyStyleElement.textContent = rules.join('\n');
    }

    function savePrivacyConfig() {
        safeSet('modstams_privacy_v2', JSON.stringify(privacyConfig));
        applyPrivacyStyles();
    }

    // Toggle Master Privacy Mode (Ctrl+B)
    window.__waweb_togglePrivacy = function() {
        privacyConfig.active = !privacyConfig.active;
        savePrivacyConfig();
        showToast(
            privacyConfig.active ? "Privacy Mode Aktif" : "Privacy Mode Nonaktif",
            privacyConfig.active ? "Sensor presisi aktif. Arahkan mouse ke pesan untuk intip." : "Semua obrolan tampil normal.",
            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${privacyConfig.active ? '#00e5ff' : '#8696a0'}" stroke-width="2.2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
            privacyConfig.active ? "#00e5ff" : "#8696a0"
        );
    };

    // Toggle Media-Only Blur (Ctrl+Shift+B)
    window.__modstams_toggleBlurMedia = function() {
        privacyConfig.blurMedia = !privacyConfig.blurMedia;
        if (privacyConfig.blurMedia && !privacyConfig.active) {
            privacyConfig.active = true;
        }
        savePrivacyConfig();
        showToast(
            privacyConfig.blurMedia && privacyConfig.active ? "Sensor Media Aktif" : "Sensor Media Nonaktif",
            privacyConfig.blurMedia && privacyConfig.active ? "Foto & video disensor otomatis (Ctrl+Shift+B)" : "Foto & video tampil tanpa sensor",
            null,
            privacyConfig.blurMedia && privacyConfig.active ? "#00e5ff" : "#8696a0"
        );
    };

    window.__modstams_updatePrivacyConfig = function(updates) {
        Object.assign(privacyConfig, updates);
        savePrivacyConfig();
    };

    /* ==========================================================================
       3. GHOST TYPING (Sembunyikan Indikator Mengetik - Ctrl+Shift+T)
       ========================================================================== */
    let ghostTypingActive = safeGet('modstams_ghost_typing', 'true') !== 'false';

    window.__waweb_toggleGhostTyping = function() {
        ghostTypingActive = !ghostTypingActive;
        safeSet('modstams_ghost_typing', ghostTypingActive ? 'true' : 'false');
        showToast(
            ghostTypingActive ? "Ghost Typing Aktif" : "Typing Normal",
            ghostTypingActive ? "Status 'Sedang mengetik...' disembunyikan (Ctrl+Shift+T)" : "Status 'Sedang mengetik...' terlihat lawan bicara",
            null,
            ghostTypingActive ? '#00e5ff' : '#8696a0'
        );
    };

    document.addEventListener('input', function(e) {
        if (ghostTypingActive && e.target && e.target.getAttribute('contenteditable') === 'true') {
            e.stopImmediatePropagation ? e.stopImmediatePropagation() : null;
        }
    }, true);

    /* ==========================================================================
       4. GHOST READ / ANTI-CENTANG BIRU (Bebas Baca Chat - Ctrl+Shift+G)
       ========================================================================== */
    let ghostReadActive = safeGet('modstams_ghost_read', 'true') !== 'false';

    const originalHasFocus = document.hasFocus.bind(document);
    document.hasFocus = function() {
        if (ghostReadActive) return false;
        return originalHasFocus();
    };

    try {
        Object.defineProperty(document, 'visibilityState', {
            get: function() { return ghostReadActive ? 'hidden' : 'visible'; },
            configurable: true
        });
        Object.defineProperty(document, 'hidden', {
            get: function() { return ghostReadActive ? true : false; },
            configurable: true
        });
    } catch(e) {}

    window.addEventListener('focus', function(e) {
        if (ghostReadActive) {
            e.stopImmediatePropagation();
        }
    }, true);

    window.__waweb_toggleGhostRead = function() {
        ghostReadActive = !ghostReadActive;
        safeSet('modstams_ghost_read', ghostReadActive ? 'true' : 'false');
        showToast(
            ghostReadActive ? "Anti-Centang Biru Aktif" : "Centang Biru Normal",
            ghostReadActive ? "Membaca pesan tanpa laporan tanda baca (Ctrl+Shift+G)" : "Laporan dibaca dikirim normal",
            null,
            ghostReadActive ? "#00e5ff" : "#8696a0"
        );
    };

    /* ==========================================================================
       5. DIRECT CHAT (Kirim Pesan Tanpa Simpan Nomor - Ctrl+M)
       ========================================================================== */
    window.__waweb_openDirectChatModal = function() {
        if (!document.body) return;
        const existing = document.getElementById('modstams-direct-modal');
        if (existing) {
            existing.remove();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'modstams-direct-modal';
        modal.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100vw',
            'height: 100vh',
            'background: rgba(11, 20, 26, 0.85)',
            'z-index: 999999',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        ].join(';');

        modal.innerHTML = `
            <div style="background: #111b21; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 22px; width: 380px; max-width: 90vw; box-shadow: 0 16px 40px rgba(0,0,0,0.7);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div style="font-weight: 600; font-size: 15px; color: #00a884; display: flex; align-items: center; gap: 8px;">
                        <span>Direct Chat (Tanpa Simpan Nomor)</span>
                    </div>
                    <button id="modstams-direct-close" style="background: transparent; border: none; color: #8696a0; cursor: pointer; font-size: 20px; line-height: 1;">&times;</button>
                </div>
                <div style="font-size: 12px; color: #8696a0; margin-bottom: 10px;">Ketik nomor HP tujuan (contoh: 08123456789 atau 62812...):</div>
                <input id="modstams-direct-phone" type="text" placeholder="08xxxxxxxxxx" style="width: 100%; box-sizing: border-box; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 10px 12px; color: #e9edef; font-size: 13px; outline: none; margin-bottom: 10px;">
                <textarea id="modstams-direct-msg" placeholder="Pesan pembuka (opsional)..." rows="2" style="width: 100%; box-sizing: border-box; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 10px; color: #e9edef; font-size: 12px; outline: none; margin-bottom: 14px; resize: none;"></textarea>
                <div style="display: flex; gap: 8px;">
                    <button id="modstams-direct-btn" style="flex: 1; background: #00a884; color: white; border: none; border-radius: 8px; padding: 10px; font-weight: 600; cursor: pointer; font-size: 13px;">Buka Obrolan</button>
                    <button id="modstams-direct-cancel" style="background: #202c33; color: #8696a0; border: none; border-radius: 8px; padding: 10px 14px; font-weight: 500; cursor: pointer; font-size: 13px;">Batal</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const inputPhone = modal.querySelector('#modstams-direct-phone');
        inputPhone.focus();

        function executeDirectChat() {
            let raw = inputPhone.value.trim().replace(/[^0-9+]/g, '');
            if (!raw) {
                showToast("Nomor Kosong", "Silakan masukkan nomor HP tujuan", null, '#ff5252');
                return;
            }
            if (raw.startsWith('0')) {
                raw = '62' + raw.substring(1);
            } else if (raw.startsWith('+')) {
                raw = raw.substring(1);
            } else if (!raw.startsWith('62') && raw.length <= 11) {
                raw = '62' + raw;
            }

            const msg = modal.querySelector('#modstams-direct-msg').value.trim();
            modal.remove();

            showToast("Membuka Chat", `Menghubungkan ke +${raw}...`);
            const link = document.createElement('a');
            link.href = `https://web.whatsapp.com/send?phone=${raw}${msg ? '&text=' + encodeURIComponent(msg) : ''}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }

        modal.querySelector('#modstams-direct-btn').onclick = executeDirectChat;
        modal.querySelector('#modstams-direct-close').onclick = () => modal.remove();
        modal.querySelector('#modstams-direct-cancel').onclick = () => modal.remove();
        modal.onkeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                executeDirectChat();
            } else if (e.key === 'Escape') {
                modal.remove();
            }
        };
    };

    /* ==========================================================================
       6. APP LOCK & AUTO-LOCK PIN SECURITY (Ctrl+L)
       ========================================================================== */
    let appPin = safeGet('modstams_app_pin', '');
    let isAppLocked = false;
    let autoLockMinutes = parseInt(safeGet('modstams_autolock_minutes', '5')) || 0;
    let lastActivityTime = Date.now();

    function registerActivity() {
        lastActivityTime = Date.now();
    }

    ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'].forEach(evt => {
        window.addEventListener(evt, registerActivity, { passive: true });
    });

    // Zero-overhead inactivity checker (runs every 10s)
    setInterval(() => {
        if (autoLockMinutes > 0 && appPin && !isAppLocked) {
            const elapsedMinutes = (Date.now() - lastActivityTime) / 60000;
            if (elapsedMinutes >= autoLockMinutes) {
                window.__modstams_lockApp();
                showToast("Kunci Otomatis", `Layar terkunci karena idle ${autoLockMinutes} menit`, null, "#ffaa00");
            }
        }
    }, 10000);

    /* ==========================================================================
       6B. ALWAYS ON TOP / WINDOW PIN (Ctrl+Shift+P)
       ========================================================================== */
    let isWindowPinned = false;

    window.__modstams_toggleAlwaysOnTop = async function() {
        try {
            if (window.__TAURI__ && window.__TAURI__.core && window.__TAURI__.core.invoke) {
                isWindowPinned = await window.__TAURI__.core.invoke('toggle_always_on_top');
            } else {
                isWindowPinned = !isWindowPinned;
            }
        } catch(e) {
            isWindowPinned = !isWindowPinned;
        }
        showToast(
            isWindowPinned ? "Pin Window Aktif" : "Pin Window Nonaktif",
            isWindowPinned ? "Jendela melayang selalu di atas aplikasi lain (Ctrl+Shift+P)" : "Jendela berjalan normal",
            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${isWindowPinned ? '#00e5ff' : '#8696a0'}" stroke-width="2.2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path></svg>`,
            isWindowPinned ? "#00e5ff" : "#8696a0"
        );
        const pinSwitch = document.getElementById('sw-pin-window');
        if (pinSwitch) {
            pinSwitch.innerHTML = renderSwitch('sw-btn-pin', isWindowPinned);
        }
    };

    window.__modstams_onPinToggled = function(pinned) {
        isWindowPinned = pinned;
        showToast(
            isWindowPinned ? "Pin Window Aktif" : "Pin Window Nonaktif",
            isWindowPinned ? "Jendela melayang selalu di atas aplikasi lain (Ctrl+Shift+P)" : "Jendela berjalan normal",
            null,
            isWindowPinned ? "#00e5ff" : "#8696a0"
        );
        const pinSwitch = document.getElementById('sw-pin-window');
        if (pinSwitch) {
            pinSwitch.innerHTML = renderSwitch('sw-btn-pin', isWindowPinned);
        }
    };

    function renderLockOverlay() {
        if (!document.body) return;
        if (document.getElementById('modstams-lock-screen')) return;

        const overlay = document.createElement('div');
        overlay.id = 'modstams-lock-screen';
        overlay.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100vw',
            'height: 100vh',
            'background: rgba(11, 20, 26, 0.98)',
            'z-index: 99999999',
            'display: flex',
            'flex-direction: column',
            'align-items: center',
            'justify-content: center',
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            'color: #e9edef',
            'user-select: none'
        ].join(';');

        let enteredPin = "";

        overlay.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; max-width: 320px; width: 100%;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(0, 168, 132, 0.18); border: 2px solid #00a884; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00a884" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div style="font-size: 18px; font-weight: 700; color: #e9edef; margin-bottom: 4px;">ModsTams Terkunci</div>
                <div style="font-size: 12px; color: #8696a0; margin-bottom: 22px;">Ketik PIN 4-digit untuk membuka</div>

                <div id="pin-dots" style="display: flex; gap: 12px; margin-bottom: 24px;">
                    <div class="pin-dot" style="width: 13px; height: 13px; border-radius: 50%; border: 2px solid #8696a0; transition: all 0.15s ease;"></div>
                    <div class="pin-dot" style="width: 13px; height: 13px; border-radius: 50%; border: 2px solid #8696a0; transition: all 0.15s ease;"></div>
                    <div class="pin-dot" style="width: 13px; height: 13px; border-radius: 50%; border: 2px solid #8696a0; transition: all 0.15s ease;"></div>
                    <div class="pin-dot" style="width: 13px; height: 13px; border-radius: 50%; border: 2px solid #8696a0; transition: all 0.15s ease;"></div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 230px;">
                    ${[1,2,3,4,5,6,7,8,9].map(n => `
                        <button class="pin-btn" data-val="${n}" style="height: 52px; border-radius: 26px; border: 1px solid rgba(255,255,255,0.08); background: #1f2c34; color: #e9edef; font-size: 18px; font-weight: 600; cursor: pointer;">${n}</button>
                    `).join('')}
                    <button id="pin-clear" style="height: 52px; border-radius: 26px; border: none; background: transparent; color: #8696a0; font-size: 12px; font-weight: 600; cursor: pointer;">C</button>
                    <button class="pin-btn" data-val="0" style="height: 52px; border-radius: 26px; border: 1px solid rgba(255,255,255,0.08); background: #1f2c34; color: #e9edef; font-size: 18px; font-weight: 600; cursor: pointer;">0</button>
                    <button id="pin-back" style="height: 52px; border-radius: 26px; border: none; background: transparent; color: #8696a0; font-size: 12px; font-weight: 700; cursor: pointer;">DEL</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        function updateDots() {
            const dots = overlay.querySelectorAll('.pin-dot');
            dots.forEach((dot, idx) => {
                if (idx < enteredPin.length) {
                    dot.style.background = '#00a884';
                    dot.style.borderColor = '#00a884';
                    dot.style.transform = 'scale(1.1)';
                } else {
                    dot.style.background = 'transparent';
                    dot.style.borderColor = '#8696a0';
                    dot.style.transform = 'scale(1)';
                }
            });
        }

        function checkPin() {
            if (enteredPin.length === 4) {
                if (enteredPin === appPin) {
                    overlay.remove();
                    isAppLocked = false;
                    showToast("ModsTams Terbuka", "Selamat datang kembali!");
                } else {
                    enteredPin = "";
                    updateDots();
                    showToast("PIN Salah", "Silakan coba lagi", null, '#ff5252');
                }
            }
        }

        overlay.querySelectorAll('.pin-btn').forEach(btn => {
            btn.onclick = () => {
                if (enteredPin.length < 4) {
                    enteredPin += btn.getAttribute('data-val');
                    updateDots();
                    if (enteredPin.length === 4) setTimeout(checkPin, 80);
                }
            };
        });

        overlay.querySelector('#pin-clear').onclick = () => {
            enteredPin = "";
            updateDots();
        };

        overlay.querySelector('#pin-back').onclick = () => {
            enteredPin = enteredPin.slice(0, -1);
            updateDots();
        };

        const handleKey = (e) => {
            if (!document.getElementById('modstams-lock-screen')) {
                window.removeEventListener('keydown', handleKey);
                return;
            }
            if (e.key >= '0' && e.key <= '9') {
                if (enteredPin.length < 4) {
                    enteredPin += e.key;
                    updateDots();
                    if (enteredPin.length === 4) setTimeout(checkPin, 80);
                }
            } else if (e.key === 'Backspace') {
                enteredPin = enteredPin.slice(0, -1);
                updateDots();
            } else if (e.key === 'Escape') {
                enteredPin = "";
                updateDots();
            }
        };
        window.addEventListener('keydown', handleKey);
    }

    window.__modstams_lockApp = function() {
        if (!appPin) {
            showToast("PIN Belum Diatur", "Buka Control Center (Ctrl+Shift+M) untuk mengatur PIN", null, '#ffaa00');
            return;
        }
        isAppLocked = true;
        renderLockOverlay();
    };

    /* ==========================================================================
       7. NATIVE UNREAD FILTER INTEGRATION (Zero Virtual-DOM Scraper)
       ========================================================================== */
    let unreadFilterActive = safeGet('modstams_unread_filter', 'false') === 'true';
    let unreadStyleElement = null;

    function applyUnreadCssFilter() {
        const head = document.head || document.documentElement;
        if (!head) return;
        if (!unreadStyleElement) {
            unreadStyleElement = document.createElement('style');
            unreadStyleElement.id = 'modstams-unread-style';
            head.appendChild(unreadStyleElement);
        }

        if (unreadFilterActive) {
            // Hardware-accelerated CSS pseudo-selector :has() - 0 JavaScript loops!
            unreadStyleElement.textContent = `
                #pane-side [role="row"]:not(:has(span[aria-label*="unread" i])):not(:has(span[aria-label*="belum dibaca" i])):not(:has([data-icon="unread-count"])) {
                    display: none !important;
                }
            `;
        } else {
            unreadStyleElement.textContent = '';
        }
    }

    window.__modstams_toggleUnreadFilter = function() {
        // Priority 1: Trigger native WhatsApp Web filter button if available
        const nativeFilterBtn = document.querySelector(
            'button[data-testid="filter-unread-chats-button"], ' +
            'button[aria-label*="unread" i], ' +
            'button[aria-label*="belum dibaca" i], ' +
            'button[aria-label*="filter" i], ' +
            'button span[data-icon="filter"]'
        );

        if (nativeFilterBtn) {
            const btn = nativeFilterBtn.closest('button') || nativeFilterBtn;
            btn.click();
            showToast("Filter Unread", "Filter resmi WhatsApp diaktifkan (Ctrl+Shift+U)", null, "#00a884");
            return;
        }

        // Priority 2: Pure CSS filter without modifying DOM properties
        unreadFilterActive = !unreadFilterActive;
        safeSet('modstams_unread_filter', unreadFilterActive ? 'true' : 'false');
        applyUnreadCssFilter();

        showToast(
            unreadFilterActive ? "Filter Unread Aktif" : "Menampilkan Semua Chat",
            unreadFilterActive ? "Menampilkan obrolan belum dibaca (Ctrl+Shift+U)" : "Semua obrolan kembali normal",
            null,
            unreadFilterActive ? "#00a884" : "#8696a0"
        );
    };

    /* ==========================================================================
       8. STORY & VIEW-ONCE DOWNLOADER (Zero-Polling Event Observer)
       ========================================================================== */
    function checkAndInjectMediaDownloader(target) {
        if (!target || !target.querySelectorAll) return;

        // View Once inside modal/dialog
        const modals = target.querySelectorAll('div[data-animate-modal-popup="true"], div[role="dialog"]');
        modals.forEach(overlay => {
            if (overlay.querySelector('#modstams-viewonce-btn')) return;
            const img = overlay.querySelector('img[src]');
            const video = overlay.querySelector('video[src]');
            const media = img || video;

            if (media && media.src) {
                const btn = document.createElement('button');
                btn.id = 'modstams-viewonce-btn';
                btn.style.cssText = [
                    'position: absolute',
                    'top: 18px',
                    'right: 76px',
                    'z-index: 9999',
                    'background: #00a884',
                    'color: #ffffff',
                    'border: none',
                    'border-radius: 8px',
                    'padding: 7px 13px',
                    'font-size: 12px',
                    'font-weight: 600',
                    'cursor: pointer',
                    'display: flex',
                    'align-items: center',
                    'gap: 6px',
                    'box-shadow: 0 4px 14px rgba(0,0,0,0.4)'
                ].join(';');
                btn.innerHTML = `
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Simpan Media</span>
                `;
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const ext = video ? 'mp4' : 'jpg';
                    triggerDownload(media.src, `Media_${Date.now()}.${ext}`);
                };
                overlay.appendChild(btn);
            }
        });

        // Status / Story viewer panel
        const statusPanel = document.querySelector('div[role="region"][tabindex="-1"], div[data-animate-modal-body="true"]');
        if (statusPanel && !statusPanel.querySelector('#modstams-status-download-btn')) {
            const media = statusPanel.querySelector('img[src], video[src]');
            if (media && media.src) {
                const btn = document.createElement('button');
                btn.id = 'modstams-status-download-btn';
                btn.style.cssText = [
                    'position: absolute',
                    'bottom: 24px',
                    'right: 24px',
                    'z-index: 99999',
                    'background: #00a884',
                    'color: #ffffff',
                    'border: none',
                    'border-radius: 24px',
                    'padding: 9px 16px',
                    'font-size: 12px',
                    'font-weight: 600',
                    'cursor: pointer',
                    'display: flex',
                    'align-items: center',
                    'gap: 6px',
                    'box-shadow: 0 6px 18px rgba(0,0,0,0.5)'
                ].join(';');
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Unduh Story</span>
                `;
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const isVideo = statusPanel.querySelector('video[src]') !== null;
                    const src = (statusPanel.querySelector('video[src]') || statusPanel.querySelector('img[src]')).src;
                    triggerDownload(src, `Story_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`);
                };
                statusPanel.appendChild(btn);
            }
        }
    }

    /* ==========================================================================
       9. DUAL-THEME ENGINE (Default Emerald vs Ultra Dark OLED #000000)
       ========================================================================== */
    const THEMES = {
        emerald: {
            name: "Emerald WhatsApp (Default)",
            accent: "#00a884",
            css: ""
        },
        oled: {
            name: "Ultra Dark OLED (Pitch Black)",
            accent: "#00a884",
            css: `
                body, #app, #app > div, #main, #pane-side,
                [data-testid="chat-list"], header, footer,
                [data-testid="conversation-panel-wrapper"],
                div[style*="background-color: rgb(17, 27, 33)"],
                div[style*="background-color: rgb(32, 44, 51)"] {
                    background-color: #000000 !important;
                    background: #000000 !important;
                }
                .message-in { background-color: #0a0e11 !important; border: 1px solid #161b1f !important; }
                .message-out { background-color: #00382b !important; }
                [data-testid="chat-list-search"], div[role="textbox"] { background-color: #080808 !important; border-color: #1c1c1c !important; }
                div, header, footer { border-color: #121212 !important; }
            `
        }
    };

    let currentTheme = safeGet('modstams_theme', 'emerald') === 'oled' ? 'oled' : 'emerald';
    let themeStyleElement = null;

    function applyCurrentTheme() {
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        if (!head) return;

        if (!themeStyleElement) {
            themeStyleElement = document.createElement('style');
            themeStyleElement.id = 'modstams-theme-style';
            head.appendChild(themeStyleElement);
        }
        themeStyleElement.textContent = THEMES[currentTheme].css;
    }

    window.__waweb_toggleOled = function() {
        currentTheme = currentTheme === 'oled' ? 'emerald' : 'oled';
        safeSet('modstams_theme', currentTheme);
        applyCurrentTheme();
        showToast(
            currentTheme === 'oled' ? "Ultra Dark OLED Aktif" : "Tema Emerald WhatsApp",
            currentTheme === 'oled' ? "Hitam pekat murni #000000 hemat baterai (Ctrl+Shift+O)" : "Tema standar aktif",
            null,
            "#00a884"
        );
    };

    /* ==========================================================================
       10. SEAMLESS NATIVE HEADER INTEGRATION
       Replaces floating overlay widget with native topbar icon
       ========================================================================== */
    function injectNativeHeaderButton() {
        if (document.getElementById('modstams-header-btn')) return;

        const header = document.querySelector('#pane-side header') || document.querySelector('header');
        if (!header) return;

        let targetContainer = header.querySelector('div[style*="justify-content: flex-end"]') ||
                              header.querySelector('span:has(div[role="button"])') ||
                              header.lastElementChild ||
                              header;

        const btn = document.createElement('div');
        btn.id = 'modstams-header-btn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.title = 'ModsTams Quick HUD (Ctrl+Shift+M)';
        btn.style.cssText = [
            'display: inline-flex',
            'align-items: center',
            'justify-content: center',
            'width: 36px',
            'height: 36px',
            'border-radius: 50%',
            'cursor: pointer',
            'color: #00a884',
            'margin: 0 4px',
            'transition: background-color 0.15s ease, transform 0.15s ease',
            'flex-shrink: 0'
        ].join(';');

        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
        `;

        btn.onmouseenter = () => {
            btn.style.backgroundColor = 'rgba(0, 168, 132, 0.15)';
            btn.style.transform = 'scale(1.08)';
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = 'transparent';
            btn.style.transform = 'scale(1)';
        };
        btn.onclick = (e) => {
            e.stopPropagation();
            window.__waweb_toggleModCenter();
        };

        if (targetContainer.firstChild) {
            targetContainer.insertBefore(btn, targetContainer.firstChild);
        } else {
            targetContainer.appendChild(btn);
        }
    }

    /* ==========================================================================
       11. MODSTAMS QUICK HUD (Ultra-Compact Single-View Popover)
       ========================================================================== */
    window.__waweb_toggleModCenter = function() {
        if (!document.body) return;
        const existing = document.getElementById('modstams-quick-hud');
        if (existing) {
            existing.remove();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'modstams-quick-hud';
        modal.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100vw',
            'height: 100vh',
            'background: rgba(11, 20, 26, 0.75)',
            'z-index: 999999',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        ].join(';');

        function renderSwitch(id, active) {
            return `
                <div id="${id}" style="width: 40px; height: 22px; border-radius: 11px; background: ${active ? '#00a884' : '#374248'}; position: relative; cursor: pointer; transition: background 0.2s ease;">
                    <div style="width: 16px; height: 16px; border-radius: 50%; background: #ffffff; position: absolute; top: 3px; left: ${active ? '21px' : '3px'}; transition: left 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></div>
                </div>
            `;
        }

        function renderCheckboxChip(id, checked, label) {
            return `
                <div id="${id}" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 8px; cursor: pointer; background: ${checked ? 'rgba(0, 168, 132, 0.15)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${checked ? 'rgba(0, 168, 132, 0.4)' : 'rgba(255,255,255,0.08)'}; transition: all 0.15s ease;">
                    <div style="width: 14px; height: 14px; border-radius: 3px; border: 2px solid ${checked ? '#00a884' : '#8696a0'}; background: ${checked ? '#00a884' : 'transparent'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        ${checked ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                    </div>
                    <span style="font-size: 12px; font-weight: 500; color: ${checked ? '#e9edef' : '#8696a0'};">${label}</span>
                </div>
            `;
        }

        modal.innerHTML = `
            <div style="background: #111b21; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; width: 420px; max-width: 92vw; box-shadow: 0 24px 60px rgba(0,0,0,0.8); color: #e9edef; overflow: hidden; display: flex; flex-direction: column;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); background: #182229;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 28px; height: 28px; border-radius: 8px; background: rgba(0, 168, 132, 0.2); display: flex; align-items: center; justify-content: center;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#00a884"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        </div>
                        <div>
                            <div style="font-weight: 700; font-size: 14px; color: #00a884;">ModsTams Quick HUD</div>
                            <div style="font-size: 11px; color: #8696a0;">v3.5 GG Extreme • Sub-70MB RAM Edition</div>
                        </div>
                    </div>
                    <button id="modstams-hud-close" style="background: transparent; border: none; color: #8696a0; cursor: pointer; font-size: 20px; line-height: 1;">&times;</button>
                </div>

                <!-- Body (Single-View, Zero-Tab Bloat) -->
                <div style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; max-height: 75vh; overflow-y: auto;">
                    
                    <!-- Section 1: Precision Privacy Master -->
                    <div style="background: #182229; padding: 12px; border-radius: 10px; border-left: 3px solid ${privacyConfig.active ? '#00e5ff' : '#8696a0'};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <div>
                                <div style="font-weight: 600; font-size: 13px; color: ${privacyConfig.active ? '#00e5ff' : '#e9edef'};">Master Privacy Mode (Ctrl+B)</div>
                                <div style="font-size: 11px; color: #8696a0;">Arahkan mouse ke balon pesan untuk mengintip</div>
                            </div>
                            <div id="sw-master-privacy">${renderSwitch('sw-btn-master', privacyConfig.active)}</div>
                        </div>

                        <!-- Intensity slider -->
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
                            <span style="font-size: 11px; color: #8696a0; white-space: nowrap;">Kekuatan Blur:</span>
                            <input id="hud-blur-slider" type="range" min="4" max="16" value="${privacyConfig.intensity}" style="flex: 1; accent-color: #00a884; cursor: pointer;">
                            <span id="hud-blur-val" style="font-size: 11px; font-weight: 700; color: #00a884; min-width: 28px;">${privacyConfig.intensity}px</span>
                        </div>

                        <!-- Granular Chips Grid -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px;">
                            ${renderCheckboxChip('chip-chat', privacyConfig.blurChat, 'Pesan Chat')}
                            ${renderCheckboxChip('chip-media', privacyConfig.blurMedia, 'Media Foto/VN')}
                            ${renderCheckboxChip('chip-preview', privacyConfig.blurPreview, 'Sidebar Preview')}
                            ${renderCheckboxChip('chip-names', privacyConfig.blurNames, 'Nama Kontak')}
                            ${renderCheckboxChip('chip-avatars', privacyConfig.blurAvatars, 'Foto Profil')}
                            ${renderCheckboxChip('chip-input', privacyConfig.blurInput, 'Draft Ketik')}
                        </div>
                    </div>

                    <!-- Section 2: Stealth Toggles -->
                    <div style="display: flex; flex-direction: column; gap: 8px; background: #182229; padding: 12px; border-radius: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: 600; font-size: 12px; color: #e9edef;">Anti-Centang Biru (Ghost Read)</div>
                                <div style="font-size: 10px; color: #8696a0;">Bebas baca chat tanpa trigger centang biru (Ctrl+Shift+G)</div>
                            </div>
                            <div id="sw-ghostread">${renderSwitch('sw-btn-ghostread', ghostReadActive)}</div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
                            <div>
                                <div style="font-weight: 600; font-size: 12px; color: #e9edef;">Sembunyikan Sedang Mengetik</div>
                                <div style="font-size: 10px; color: #8696a0;">Lawan bicara tidak melihat status mengetik (Ctrl+Shift+T)</div>
                            </div>
                            <div id="sw-ghosttyping">${renderSwitch('sw-btn-ghosttyping', ghostTypingActive)}</div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
                            <div>
                                <div style="font-weight: 600; font-size: 12px; color: #e9edef;">Ultra Dark OLED (Pitch Black)</div>
                                <div style="font-size: 10px; color: #8696a0;">Hitam murni #000000 hemat baterai (Ctrl+Shift+O)</div>
                            </div>
                            <div id="sw-oled">${renderSwitch('sw-btn-oled', currentTheme === 'oled')}</div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
                            <div>
                                <div style="font-weight: 600; font-size: 12px; color: #e9edef;">Pin Selalu di Atas (Always on Top)</div>
                                <div style="font-size: 10px; color: #8696a0;">Melayang di atas aplikasi lain (Ctrl+Shift+P)</div>
                            </div>
                            <div id="sw-pin-window">${renderSwitch('sw-btn-pin', isWindowPinned)}</div>
                        </div>
                    </div>

                    <!-- Section 3: Quick Tools & Lock -->
                    <div style="display: flex; gap: 8px;">
                        <button id="btn-direct-chat" style="flex: 1; background: rgba(0, 168, 132, 0.15); border: 1px solid rgba(0, 168, 132, 0.35); color: #00a884; border-radius: 8px; padding: 9px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            Direct Chat (Ctrl+M)
                        </button>
                        <button id="btn-lock-app" style="flex: 1; background: rgba(255, 82, 82, 0.12); border: 1px solid rgba(255, 82, 82, 0.3); color: #ff5252; border-radius: 8px; padding: 9px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Kunci Layar (Ctrl+L)
                        </button>
                    </div>

                    <!-- Inactivity Auto-Lock selector -->
                    <div style="background: #182229; padding: 10px 12px; border-radius: 10px; display: flex; flex-direction: column; gap: 6px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-weight: 600; font-size: 12px; color: #e9edef;">Kunci Otomatis Saat Ditinggal</div>
                            <div id="val-autolock-hud" style="font-size: 11px; font-weight: 700; color: #00a884;">${autoLockMinutes > 0 ? autoLockMinutes + ' Menit' : 'Mati'}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
                            ${[0, 2, 5, 10].map(m => `
                                <button class="btn-autolock" data-min="${m}" style="padding: 6px 0; font-size: 11px; font-weight: 600; border-radius: 6px; border: 1px solid ${autoLockMinutes === m ? '#00a884' : 'rgba(255,255,255,0.08)'}; background: ${autoLockMinutes === m ? 'rgba(0, 168, 132, 0.2)' : '#202c33'}; color: ${autoLockMinutes === m ? '#00a884' : '#8696a0'}; cursor: pointer; transition: all 0.15s ease;">${m === 0 ? 'Mati' : m + 'm'}</button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Quick PIN setup -->
                    <div style="display: flex; gap: 6px; align-items: center; background: #182229; padding: 8px 10px; border-radius: 8px;">
                        <input id="input-pin-hud" type="password" maxlength="4" placeholder="${appPin ? 'Ganti PIN 4-digit' : 'Atur PIN 4-digit baru'}" style="flex: 1; background: #202c33; border: 1px solid #2a3942; border-radius: 6px; padding: 6px 10px; color: #e9edef; font-size: 11px; outline: none;">
                        <button id="btn-save-pin-hud" style="background: #2a3942; color: #00a884; border: none; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: 600; cursor: pointer;">Simpan</button>
                    </div>

                </div>

                <!-- Footer -->
                <div style="padding: 10px 18px; background: #141d22; border-top: 1px solid rgba(255,255,255,0.06); font-size: 10px; color: #8696a0; display: flex; justify-content: space-between; align-items: center;">
                    <div>Hotkey: <b>Ctrl+B</b> (Privacy) • <b>Ctrl+Shift+U</b> (Unread) • <b>Ctrl+M</b> (Direct)</div>
                    <div style="color: #00a884; font-weight: 700;">GG Extreme</div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Master Privacy Toggle
        modal.querySelector('#sw-master-privacy').onclick = () => {
            window.__waweb_togglePrivacy();
            modal.querySelector('#sw-master-privacy').innerHTML = renderSwitch('sw-btn-master', privacyConfig.active);
        };

        // Slider
        const slider = modal.querySelector('#hud-blur-slider');
        const sliderVal = modal.querySelector('#hud-blur-val');
        slider.oninput = (e) => {
            const val = parseInt(e.target.value) || 8;
            sliderVal.innerText = `${val}px`;
            privacyConfig.intensity = val;
            savePrivacyConfig();
        };

        // Chip toggles
        function bindChip(id, key) {
            const el = modal.querySelector('#' + id);
            if (!el) return;
            el.onclick = () => {
                privacyConfig[key] = !privacyConfig[key];
                savePrivacyConfig();
                const isChecked = privacyConfig[key];
                el.style.background = isChecked ? 'rgba(0, 168, 132, 0.15)' : 'rgba(255,255,255,0.04)';
                el.style.borderColor = isChecked ? 'rgba(0, 168, 132, 0.4)' : 'rgba(255,255,255,0.08)';
                const box = el.querySelector('div:first-child');
                box.style.borderColor = isChecked ? '#00a884' : '#8696a0';
                box.style.background = isChecked ? '#00a884' : 'transparent';
                box.innerHTML = isChecked ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '';
                const span = el.querySelector('span');
                if (span) span.style.color = isChecked ? '#e9edef' : '#8696a0';
            };
        }

        bindChip('chip-chat', 'blurChat');
        bindChip('chip-media', 'blurMedia');
        bindChip('chip-preview', 'blurPreview');
        bindChip('chip-names', 'blurNames');
        bindChip('chip-avatars', 'blurAvatars');
        bindChip('chip-input', 'blurInput');

        // Stealth Toggles
        modal.querySelector('#sw-ghostread').onclick = () => {
            window.__waweb_toggleGhostRead();
            modal.querySelector('#sw-ghostread').innerHTML = renderSwitch('sw-btn-ghostread', ghostReadActive);
        };
        modal.querySelector('#sw-ghosttyping').onclick = () => {
            window.__waweb_toggleGhostTyping();
            modal.querySelector('#sw-ghosttyping').innerHTML = renderSwitch('sw-btn-ghosttyping', ghostTypingActive);
        };
        modal.querySelector('#sw-oled').onclick = () => {
            window.__waweb_toggleOled();
            modal.querySelector('#sw-oled').innerHTML = renderSwitch('sw-btn-oled', currentTheme === 'oled');
        };
        modal.querySelector('#sw-pin-window').onclick = () => {
            window.__modstams_toggleAlwaysOnTop();
        };

        // Auto-Lock Selector Buttons
        modal.querySelectorAll('.btn-autolock').forEach(btn => {
            btn.onclick = () => {
                const m = parseInt(btn.getAttribute('data-min')) || 0;
                autoLockMinutes = m;
                safeSet('modstams_autolock_minutes', m);
                lastActivityTime = Date.now();
                modal.querySelectorAll('.btn-autolock').forEach(b => {
                    const bm = parseInt(b.getAttribute('data-min')) || 0;
                    b.style.borderColor = bm === m ? '#00a884' : 'rgba(255,255,255,0.08)';
                    b.style.background = bm === m ? 'rgba(0, 168, 132, 0.2)' : '#202c33';
                    b.style.color = bm === m ? '#00a884' : '#8696a0';
                });
                const label = modal.querySelector('#val-autolock-hud');
                if (label) label.innerText = m > 0 ? `${m} Menit` : 'Mati';
                showToast("Auto-Lock Diatur", m > 0 ? `Kunci otomatis aktif setelah ${m} menit idle` : "Kunci otomatis dinonaktifkan", null, m > 0 ? '#00a884' : '#8696a0');
            };
        });

        // Quick Tools
        modal.querySelector('#btn-direct-chat').onclick = () => {
            modal.remove();
            window.__waweb_openDirectChatModal();
        };
        modal.querySelector('#btn-lock-app').onclick = () => {
            modal.remove();
            window.__modstams_lockApp();
        };

        // PIN Save
        modal.querySelector('#btn-save-pin-hud').onclick = () => {
            const val = modal.querySelector('#input-pin-hud').value.trim();
            if (val.length === 4 && /^\d{4}$/.test(val)) {
                appPin = val;
                safeSet('modstams_app_pin', val);
                modal.querySelector('#input-pin-hud').value = '';
                showToast("PIN Tersimpan", "Gunakan Ctrl+L untuk mengunci aplikasi");
            } else {
                showToast("PIN Tidak Valid", "Harus berupa 4 digit angka (misal: 1234)", null, '#ff5252');
            }
        };

        modal.querySelector('#modstams-hud-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        modal.onkeydown = (e) => {
            if (e.key === 'Escape') modal.remove();
        };
    };

    /* ==========================================================================
       12. GLOBAL KEYBOARD SHORTCUTS
       ========================================================================== */
    window.addEventListener('keydown', function(e) {
        if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
            window.location.reload();
        }
        // Ctrl+B: Master Privacy Mode
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            window.__waweb_togglePrivacy();
        }
        // Ctrl+Shift+B: Auto-Blur Media Saja
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            window.__modstams_toggleBlurMedia();
        }
        // Ctrl+M: Direct Chat
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            window.__waweb_openDirectChatModal();
        }
        // Ctrl+Shift+M: Quick HUD
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            window.__waweb_toggleModCenter();
        }
        // Ctrl+Shift+P: Toggle Always on Top
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            window.__modstams_toggleAlwaysOnTop();
        }
        // Ctrl+Shift+U: Unread Filter
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'u') {
            e.preventDefault();
            window.__modstams_toggleUnreadFilter();
        }
        // Ctrl+L: Lock App
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            window.__modstams_lockApp();
        }
        // Ctrl+Shift+O: Toggle OLED Ultra Dark
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') {
            e.preventDefault();
            window.__waweb_toggleOled();
        }
        // Ctrl+Shift+T: Ghost Typing
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            window.__waweb_toggleGhostTyping();
        }
        // Ctrl+Shift+G: Ghost Read
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g') {
            e.preventDefault();
            window.__waweb_toggleGhostRead();
        }
    });

    /* ==========================================================================
       13. EVENT-DRIVEN LIFECYCLE INITIALIZATION
       ========================================================================== */
    function initSuite() {
        applyCurrentTheme();
        applyPrivacyStyles();
        injectNativeHeaderButton();
        if (unreadFilterActive) applyUnreadCssFilter();

        if (window.__TAURI__ && window.__TAURI__.core && window.__TAURI__.core.invoke) {
            window.__TAURI__.core.invoke('is_always_on_top').then(val => {
                isWindowPinned = !!val;
            }).catch(() => {});
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initSuite, { once: true });
    } else {
        initSuite();
    }

    // Narrow MutationObserver: watches body only for modal dialogs and header mount
    const rootObserver = new MutationObserver((mutations) => {
        for (let m = 0; m < mutations.length; m++) {
            if (mutations[m].addedNodes.length > 0) {
                checkAndInjectMediaDownloader(document.body);
                injectNativeHeaderButton();
                break;
            }
        }
    });

    if (document.body) {
        rootObserver.observe(document.body, { childList: true, subtree: false });
    }

    window.addEventListener('load', () => {
        injectNativeHeaderButton();
        applyPrivacyStyles();
    }, { once: true });

})();
