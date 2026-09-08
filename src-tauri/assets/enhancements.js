/**
 * ModsTams Suite - Professional Desktop Client
 * Minimalist, high-performance WhatsApp Web enhancement module.
 * Designed with modern SaaS principles (Linear / Raycast / Vercel style).
 * Strict design system: slate palette, 8px grid, subtle borders, zero neon/gaming aesthetics.
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
       1. TOAST NOTIFICATION SYSTEM (Linear / Raycast Dark SaaS Style)
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
                'font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            ].join(';');
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(title, subtitle, iconSvg = null, accentColor = '#3b82f6') {
        const container = getToastContainer();
        if (!container) return;

        const toast = document.createElement('div');
        toast.style.cssText = [
            'pointer-events: auto',
            'display: flex',
            'align-items: center',
            'gap: 12px',
            'background: #1e293b',
            'color: #f1f5f9',
            'padding: 10px 14px',
            'border-radius: 8px',
            'border: 1px solid #334155',
            `border-left: 3px solid ${accentColor}`,
            'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
            'min-width: 260px',
            'max-width: 360px',
            'transform: translateY(12px)',
            'opacity: 0',
            'transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease'
        ].join(';');

        const defaultSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="m9 12 2 2 4-4"></path></svg>`;

        toast.innerHTML = `
            <div style="width: 28px; height: 28px; border-radius: 6px; background: #0f172a; border: 1px solid #334155; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${iconSvg || defaultSvg}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 13px; color: #f1f5f9; line-height: 1.3; margin-bottom: 1px;">${title}</div>
                <div style="font-size: 12px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;">${subtitle || ''}</div>
            </div>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.transform = 'translateY(8px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 200);
        }, 2600);
    }

    function triggerDownload(url, filename) {
        if (!document.body) return;
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Download Started", filename, null, '#22c55e');
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
        const mediaBlur = Math.round(i * 1.4);
        const rules = [];

        // 1. BLUR CHAT MESSAGES
        if (privacyConfig.blurChat) {
            rules.push(`
                #main .message-in .selectable-text,
                #main .message-out .selectable-text,
                #main [data-testid="msg-container"] .copyable-text:not([data-testid="conversation-panel-wrapper"]) {
                    filter: blur(${i}px) !important;
                    transition: filter 0.16s ease !important;
                }
                #main .message-in:hover .selectable-text,
                #main .message-out:hover .selectable-text,
                #main [data-testid="msg-container"]:hover .copyable-text {
                    filter: none !important;
                }
            `);
        }

        // 2. BLUR MEDIA (Images, Videos, Voice Notes, Stickers)
        if (privacyConfig.blurMedia) {
            rules.push(`
                #main [data-testid="msg-container"] img:not([class*="emoji"]),
                #main [data-testid="msg-container"] video,
                #main [data-testid="image-thumb"],
                #main [data-testid="video-thumb"],
                #main [data-testid="audio-player"],
                #main [data-testid="media-canvas"],
                #main div[role="button"][style*="background-image"] {
                    filter: blur(${mediaBlur}px) !important;
                    transition: filter 0.16s ease !important;
                }
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
                #pane-side [role="row"] [data-testid="last-msg-status"],
                #pane-side [role="row"] span[title]:not([dir]) {
                    filter: blur(${i}px) !important;
                    transition: filter 0.16s ease !important;
                }
                #pane-side [role="row"]:hover [data-testid="last-msg-status"],
                #pane-side [role="row"]:hover span[title]:not([dir]) {
                    filter: none !important;
                }
            `);
        }

        // 4. BLUR CONTACT & GROUP NAMES
        if (privacyConfig.blurNames) {
            rules.push(`
                header [data-testid="conversation-info-header"] span,
                #pane-side [role="row"] [data-testid="cell-frame-title"] span {
                    filter: blur(${i}px) !important;
                    transition: filter 0.16s ease !important;
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
                #pane-side [role="row"] div[data-testid="avatar"] img,
                #main header div[data-testid="avatar"] img {
                    filter: blur(${i}px) !important;
                    transition: filter 0.16s ease !important;
                }
                #pane-side [role="row"]:hover div[data-testid="avatar"] img,
                #main header div[data-testid="avatar"]:hover img {
                    filter: none !important;
                }
            `);
        }

        // 6. BLUR INPUT MESSAGE BOX (Draft text)
        if (privacyConfig.blurInput) {
            rules.push(`
                footer div[contenteditable="true"] {
                    filter: blur(${i}px) !important;
                    transition: filter 0.16s ease !important;
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
            privacyConfig.active ? "Privacy Blur Enabled" : "Privacy Blur Disabled",
            privacyConfig.active ? "Hover any message to temporarily unblur." : "Displaying all messages normally.",
            null,
            privacyConfig.active ? "#3b82f6" : "#94a3b8"
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
            privacyConfig.blurMedia && privacyConfig.active ? "Media Blur Enabled" : "Media Blur Disabled",
            privacyConfig.blurMedia && privacyConfig.active ? "Photos and videos are concealed (Ctrl+Shift+B)" : "Media displays normally",
            null,
            privacyConfig.blurMedia && privacyConfig.active ? "#3b82f6" : "#94a3b8"
        );
    };

    window.__modstams_updatePrivacyConfig = function(updates) {
        Object.assign(privacyConfig, updates);
        savePrivacyConfig();
    };

    /* ==========================================================================
       3. GHOST TYPING (Suppress Typing Indicator - Ctrl+Shift+T)
       ========================================================================== */
    let ghostTypingActive = safeGet('modstams_ghost_typing', 'true') !== 'false';

    window.__waweb_toggleGhostTyping = function() {
        ghostTypingActive = !ghostTypingActive;
        safeSet('modstams_ghost_typing', ghostTypingActive ? 'true' : 'false');
        showToast(
            ghostTypingActive ? "Ghost Typing Enabled" : "Ghost Typing Disabled",
            ghostTypingActive ? "Typing indicator is concealed (Ctrl+Shift+T)" : "Typing indicator is visible",
            null,
            ghostTypingActive ? "#3b82f6" : "#94a3b8"
        );
    };

    document.addEventListener('input', function(e) {
        if (ghostTypingActive && e.target && e.target.getAttribute('contenteditable') === 'true') {
            e.stopImmediatePropagation ? e.stopImmediatePropagation() : null;
        }
    }, true);

    /* ==========================================================================
       4. GHOST READ / STEALTH RECEIPTS (Read Without Blue Checks - Ctrl+Shift+G)
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
            ghostReadActive ? "Ghost Read Enabled" : "Ghost Read Disabled",
            ghostReadActive ? "Reading messages without triggering blue checks (Ctrl+Shift+G)" : "Read receipts sent normally",
            null,
            ghostReadActive ? "#3b82f6" : "#94a3b8"
        );
    };

    /* ==========================================================================
       5. DIRECT CHAT MODAL (Clean Slate Surface - Ctrl+M)
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
            'background: rgba(15, 23, 42, 0.7)',
            'backdrop-filter: blur(4px)',
            'z-index: 999999',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        ].join(';');

        modal.innerHTML = `
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 24px; width: 380px; max-width: 90vw; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div>
                        <div style="font-weight: 600; font-size: 15px; color: #f1f5f9;">Direct Chat</div>
                        <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">Send message without saving to contacts</div>
                    </div>
                    <button id="modstams-direct-close" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; line-height: 1; padding: 4px; border-radius: 4px;">&times;</button>
                </div>
                <div style="font-size: 12px; font-weight: 500; color: #94a3b8; margin-bottom: 6px;">Recipient Phone Number</div>
                <input id="modstams-direct-phone" type="text" placeholder="e.g. 08123456789 or 628..." style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 9px 12px; color: #f1f5f9; font-size: 13px; outline: none; margin-bottom: 12px;">
                <div style="font-size: 12px; font-weight: 500; color: #94a3b8; margin-bottom: 6px;">Initial Message (Optional)</div>
                <textarea id="modstams-direct-msg" placeholder="Type a message..." rows="2" style="width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 9px 12px; color: #f1f5f9; font-size: 12px; outline: none; margin-bottom: 18px; resize: none;"></textarea>
                <div style="display: flex; gap: 8px;">
                    <button id="modstams-direct-btn" style="flex: 1; background: #3b82f6; color: white; border: none; border-radius: 6px; padding: 9px 14px; font-weight: 500; cursor: pointer; font-size: 13px;">Start Chat</button>
                    <button id="modstams-direct-cancel" style="background: #0f172a; color: #94a3b8; border: 1px solid #334155; border-radius: 6px; padding: 9px 14px; font-weight: 500; cursor: pointer; font-size: 13px;">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const inputPhone = modal.querySelector('#modstams-direct-phone');
        inputPhone.focus();

        function executeDirectChat() {
            let raw = inputPhone.value.trim().replace(/[^0-9+]/g, '');
            if (!raw) {
                showToast("Required Field", "Please enter a valid phone number", null, '#ef4444');
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

            showToast("Opening Conversation", `Connecting to +${raw}...`, null, '#3b82f6');
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

    setInterval(() => {
        if (autoLockMinutes > 0 && appPin && !isAppLocked) {
            const elapsedMinutes = (Date.now() - lastActivityTime) / 60000;
            if (elapsedMinutes >= autoLockMinutes) {
                window.__modstams_lockApp();
                showToast("Workspace Locked", `Auto-lock engaged after ${autoLockMinutes}m idle`, null, "#3b82f6");
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
            isWindowPinned ? "Window Pinned" : "Window Unpinned",
            isWindowPinned ? "Floating on top of other windows (Ctrl+Shift+P)" : "Standard window behavior restored",
            null,
            isWindowPinned ? "#3b82f6" : "#94a3b8"
        );
        const pinSwitch = document.getElementById('sw-pin-window');
        if (pinSwitch) {
            pinSwitch.innerHTML = renderSwitch('sw-btn-pin', isWindowPinned);
        }
    };

    window.__modstams_onPinToggled = function(pinned) {
        isWindowPinned = pinned;
        showToast(
            isWindowPinned ? "Window Pinned" : "Window Unpinned",
            isWindowPinned ? "Floating on top of other windows (Ctrl+Shift+P)" : "Standard window behavior restored",
            null,
            isWindowPinned ? "#3b82f6" : "#94a3b8"
        );
        const pinSwitch = document.getElementById('sw-pin-window');
        if (pinSwitch) {
            pinSwitch.innerHTML = renderSwitch('sw-btn-pin', isWindowPinned);
        }
    };

    /* ==========================================================================
       6C. ONE-CLICK STORAGE & MEDIA CACHE PURGE (Ctrl+Shift+Del)
       ========================================================================== */
    window.__modstams_purgeCache = async function() {
        try {
            if ('caches' in window) {
                try {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(k => caches.delete(k)));
                } catch (cacheErr) {
                    console.warn("[ModsTams] CacheStorage clean skipped:", cacheErr);
                }
            }

            if (window.__TAURI__ && window.__TAURI__.core && window.__TAURI__.core.invoke) {
                const res = await window.__TAURI__.core.invoke('purge_media_cache');
                const mb = (res.bytes_freed / (1024 * 1024)).toFixed(1);
                window.__modstams_onCachePurged(mb, res.files_deleted);
            } else {
                showToast("Cache Cleared", "Temporary media and cache purged", null, "#22c55e");
            }
        } catch (err) {
            console.error("[ModsTams] Purge cache failed:", err);
            showToast("Purge Cache Error", "Unable to purge temporary cache", null, "#ef4444");
        }
    };

    window.__modstams_onCachePurged = function(mb, filesCount) {
        showToast(
            "Cache Purged",
            `Freed ${mb} MB (${filesCount} cached files) • Session preserved`,
            null,
            "#22c55e"
        );
        const statusEl = document.getElementById('val-cache-status');
        if (statusEl) {
            statusEl.innerText = `Freed ${mb} MB (${filesCount} files)`;
            statusEl.style.color = '#22c55e';
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
            'background: #0f172a',
            'z-index: 99999999',
            'display: flex',
            'flex-direction: column',
            'align-items: center',
            'justify-content: center',
            'font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            'color: #f1f5f9',
            'user-select: none'
        ].join(';');

        let enteredPin = "";

        overlay.innerHTML = `
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 32px 28px; width: 300px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);">
                <div style="width: 44px; height: 44px; border-radius: 8px; background: #0f172a; border: 1px solid #334155; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div style="font-size: 15px; font-weight: 600; color: #f1f5f9; margin-bottom: 4px;">Workspace Locked</div>
                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 24px;">Enter 4-digit PIN to continue</div>

                <div id="pin-dots" style="display: flex; gap: 12px; margin-bottom: 24px;">
                    <div class="pin-dot" style="width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #334155; transition: all 0.15s ease;"></div>
                    <div class="pin-dot" style="width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #334155; transition: all 0.15s ease;"></div>
                    <div class="pin-dot" style="width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #334155; transition: all 0.15s ease;"></div>
                    <div class="pin-dot" style="width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid #334155; transition: all 0.15s ease;"></div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 100%;">
                    ${[1,2,3,4,5,6,7,8,9].map(n => `
                        <button class="pin-btn" data-val="${n}" style="height: 44px; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: #f1f5f9; font-size: 16px; font-weight: 500; cursor: pointer; transition: background 0.12s ease;">${n}</button>
                    `).join('')}
                    <button id="pin-clear" style="height: 44px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: #94a3b8; font-size: 12px; font-weight: 500; cursor: pointer;">C</button>
                    <button class="pin-btn" data-val="0" style="height: 44px; border-radius: 6px; border: 1px solid #334155; background: #0f172a; color: #f1f5f9; font-size: 16px; font-weight: 500; cursor: pointer;">0</button>
                    <button id="pin-back" style="height: 44px; border-radius: 6px; border: 1px solid transparent; background: transparent; color: #94a3b8; font-size: 12px; font-weight: 500; cursor: pointer;">DEL</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        function updateDots() {
            const dots = overlay.querySelectorAll('.pin-dot');
            dots.forEach((dot, idx) => {
                if (idx < enteredPin.length) {
                    dot.style.background = '#3b82f6';
                    dot.style.borderColor = '#3b82f6';
                } else {
                    dot.style.background = 'transparent';
                    dot.style.borderColor = '#334155';
                }
            });
        }

        function checkPin() {
            if (enteredPin.length === 4) {
                if (enteredPin === appPin) {
                    overlay.remove();
                    isAppLocked = false;
                    lastActivityTime = Date.now();
                    showToast("Workspace Unlocked", "Welcome back", null, '#22c55e');
                } else {
                    enteredPin = "";
                    updateDots();
                    showToast("Incorrect PIN", "Please verify and re-enter", null, '#ef4444');
                }
            }
        }

        overlay.querySelectorAll('.pin-btn').forEach(btn => {
            btn.onclick = () => {
                if (enteredPin.length < 4) {
                    enteredPin += btn.getAttribute('data-val');
                    updateDots();
                    if (enteredPin.length === 4) setTimeout(checkPin, 60);
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
                    if (enteredPin.length === 4) setTimeout(checkPin, 60);
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
            showToast("PIN Required", "Configure a 4-digit PIN in Preferences (Ctrl+Shift+M)", null, '#3b82f6');
            return;
        }
        isAppLocked = true;
        renderLockOverlay();
    };

    /* ==========================================================================
       7. NATIVE UNREAD FILTER INTEGRATION
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
            showToast("Filter Unread", "Toggled native chat filter", null, "#3b82f6");
            return;
        }

        unreadFilterActive = !unreadFilterActive;
        safeSet('modstams_unread_filter', unreadFilterActive ? 'true' : 'false');
        applyUnreadCssFilter();

        showToast(
            unreadFilterActive ? "Unread Filter Active" : "Showing All Chats",
            unreadFilterActive ? "Filtered to conversations with unread messages" : "Restored full conversation list",
            null,
            unreadFilterActive ? "#3b82f6" : "#94a3b8"
        );
    };

    /* ==========================================================================
       8. STORY & VIEW-ONCE DOWNLOADER (Subtle Action Buttons)
       ========================================================================== */
    function checkAndInjectMediaDownloader(target) {
        if (!target || !target.querySelectorAll) return;

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
                    'background: #1e293b',
                    'color: #f1f5f9',
                    'border: 1px solid #334155',
                    'border-radius: 6px',
                    'padding: 7px 12px',
                    'font-size: 12px',
                    'font-weight: 500',
                    'cursor: pointer',
                    'display: flex',
                    'align-items: center',
                    'gap: 6px',
                    'box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3)',
                    'transition: background 0.15s ease'
                ].join(';');
                btn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Save Media</span>
                `;
                btn.onmouseenter = () => btn.style.background = '#334155';
                btn.onmouseleave = () => btn.style.background = '#1e293b';
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const ext = video ? 'mp4' : 'jpg';
                    triggerDownload(media.src, `Media_${Date.now()}.${ext}`);
                };
                overlay.appendChild(btn);
            }
        });

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
                    'background: #1e293b',
                    'color: #f1f5f9',
                    'border: 1px solid #334155',
                    'border-radius: 6px',
                    'padding: 8px 14px',
                    'font-size: 12px',
                    'font-weight: 500',
                    'cursor: pointer',
                    'display: flex',
                    'align-items: center',
                    'gap: 6px',
                    'box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3)',
                    'transition: background 0.15s ease'
                ].join(';');
                btn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Save Story</span>
                `;
                btn.onmouseenter = () => btn.style.background = '#334155';
                btn.onmouseleave = () => btn.style.background = '#1e293b';
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
       9. DUAL-THEME ENGINE (Default WhatsApp vs Ultra Dark OLED)
       ========================================================================== */
    const THEMES = {
        emerald: {
            name: "Standard Dark",
            accent: "#3b82f6",
            css: ""
        },
        oled: {
            name: "Pitch Black (OLED)",
            accent: "#3b82f6",
            css: `
                body, #app, #app > div, #main, #pane-side,
                [data-testid="chat-list"], header, footer,
                [data-testid="conversation-panel-wrapper"],
                div[style*="background-color: rgb(17, 27, 33)"],
                div[style*="background-color: rgb(32, 44, 51)"] {
                    background-color: #000000 !important;
                    background: #000000 !important;
                }
                .message-in { background-color: #0d1117 !important; border: 1px solid #1e293b !important; }
                .message-out { background-color: #1e293b !important; }
                [data-testid="chat-list-search"], div[role="textbox"] { background-color: #080808 !important; border-color: #1e293b !important; }
                div, header, footer { border-color: #1e293b !important; }
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
            currentTheme === 'oled' ? "OLED Pitch Black" : "Standard Theme",
            currentTheme === 'oled' ? "True black #000000 enabled for high contrast" : "Standard theme restored",
            null,
            "#3b82f6"
        );
    };

    /* ==========================================================================
       10. SEAMLESS NAVBAR PREFERENCES ICON (Clean Minimalist Icon)
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
        btn.title = 'Preferences (Ctrl+Shift+M)';
        btn.style.cssText = [
            'display: inline-flex',
            'align-items: center',
            'justify-content: center',
            'width: 32px',
            'height: 32px',
            'border-radius: 6px',
            'cursor: pointer',
            'color: #94a3b8',
            'margin: 0 4px',
            'transition: color 0.15s ease, background 0.15s ease',
            'flex-shrink: 0'
        ].join(';');

        btn.innerHTML = `
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 21v-7"></path>
                <path d="M4 10V3"></path>
                <path d="M12 21v-9"></path>
                <path d="M12 8V3"></path>
                <path d="M20 21v-5"></path>
                <path d="M20 12V3"></path>
                <path d="M1 14h6"></path>
                <path d="M9 8h6"></path>
                <path d="M17 16h6"></path>
            </svg>
        `;

        btn.onmouseenter = () => {
            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            btn.style.color = '#f1f5f9';
        };
        btn.onmouseleave = () => {
            btn.style.backgroundColor = 'transparent';
            btn.style.color = '#94a3b8';
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
       10B. ANTI-TARIK PESAN & REVOKE LOGGER (Client-Side DOM & LRU Ring Buffer)
       ========================================================================== */
    let antiDeleteActive = safeGet('modstams_anti_delete', 'true') !== 'false';
    const MAX_MSG_CACHE = 1000;
    const messageCache = new Map();
    const revokedLog = [];

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function cacheMessage(id, data) {
        if (!id || !data) return;
        if (messageCache.has(id)) {
            const existing = messageCache.get(id);
            if (!existing.text && data.text) existing.text = data.text;
            if (!existing.sender && data.sender) existing.sender = data.sender;
            return;
        }
        if (messageCache.size >= MAX_MSG_CACHE) {
            const oldestKey = messageCache.keys().next().value;
            messageCache.delete(oldestKey);
        }
        messageCache.set(id, data);
    }

    const REVOKE_REGEX = /pesan ini telah dihapus|this message was deleted|you deleted this message|pesan ini dihapus|message was deleted|dihapus oleh admin|deleted by admin|pesan ditarik/i;

    function isRevokedMessage(el) {
        if (!el) return false;
        if (el.querySelector('span[data-icon="recalled"], span[data-icon="msg-deleted"], [data-icon*="recalled"], [data-testid*="revoked"]')) {
            return true;
        }
        const text = (el.innerText || el.textContent || '').trim();
        if (!text) return false;
        return REVOKE_REGEX.test(text);
    }

    function extractMessageData(el) {
        if (!el) return null;
        let msgId = el.getAttribute('data-id');
        if (!msgId) {
            const parent = el.closest('[data-id]');
            if (parent) msgId = parent.getAttribute('data-id');
        }
        if (!msgId) return null;

        const isOut = msgId.startsWith('true_');
        let sender = isOut ? 'Anda' : '';
        let time = '';
        const prePlainEl = el.querySelector('[data-pre-plain-text]');
        if (prePlainEl) {
            const pre = prePlainEl.getAttribute('data-pre-plain-text') || '';
            const match = pre.match(/\[(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)[^\]]*\]\s*([^:]+):?/);
            if (match) {
                time = match[1];
                if (!isOut) sender = match[2].trim();
            }
        }

        if (!sender && !isOut) {
            const authorEl = el.querySelector('span[data-testid="author"], span[dir="auto"].color-1, span[dir="auto"].color-2');
            if (authorEl && authorEl.innerText) {
                sender = authorEl.innerText.trim();
            }
        }

        let text = '';
        const textEl = el.querySelector('.selectable-text, .copyable-text .selectable-text, span._ao3e');
        if (textEl) {
            text = textEl.innerText.trim();
        }

        let mediaType = null;
        if (el.querySelector('img[src]:not([class*="emoji"])')) mediaType = 'image';
        else if (el.querySelector('video[src]')) mediaType = 'video';
        else if (el.querySelector('[data-testid="audio-player"], audio')) mediaType = 'audio';
        else if (el.querySelector('[data-icon="msg-sticker"], [data-testid="sticker"]')) mediaType = 'sticker';
        else if (el.querySelector('[data-testid="document-thumb"]')) mediaType = 'document';

        return { id: msgId, sender: sender || (isOut ? 'Anda' : 'Kontak'), time, text, isOut, mediaType };
    }

    function restoreRevokedMessage(el, cached) {
        if (!el || !cached) return;
        if (el.querySelector('.modstams-revoked-bubble')) return;
        el.setAttribute('data-modstams-restored', 'true');

        const bubble = el.querySelector('[data-testid="msg-container"]') || el.querySelector('.message-in, .message-out') || el;

        const pill = document.createElement('div');
        pill.className = 'modstams-revoked-bubble';
        pill.style.cssText = [
            'margin-top: 6px',
            'padding: 8px 10px',
            'background: rgba(244, 63, 94, 0.08)',
            'border: 1px solid rgba(244, 63, 94, 0.3)',
            'border-radius: 6px',
            'font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            'box-shadow: 0 2px 4px rgba(0,0,0,0.1)'
        ].join(';');

        const mediaBadge = cached.mediaType ? `<span style="font-size: 10px; background: rgba(244, 63, 94, 0.18); color: #f43f5e; padding: 1px 5px; border-radius: 3px; margin-left: 6px; text-transform: uppercase; font-weight: 600;">${cached.mediaType}</span>` : '';

        pill.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; font-size: 11px; font-weight: 600; color: #f43f5e;">
                <div style="display: flex; align-items: center; gap: 5px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                    </svg>
                    <span>Pesan Ditarik ${cached.time ? '• ' + cached.time : ''}</span>
                    ${mediaBadge}
                </div>
                <span style="font-size: 10px; color: #94a3b8; font-weight: normal;">Anti-Tarik ModsTams</span>
            </div>
            <div class="selectable-text copyable-text" style="font-size: 13px; line-height: 1.45; color: #f1f5f9; user-select: text; -webkit-user-select: text; word-break: break-word; font-weight: 400;">
                ${cached.text ? escapeHtml(cached.text) : '<i style="color: #94a3b8;">[Konten media ditarik sebelum teks diunduh]</i>'}
            </div>
        `;

        bubble.appendChild(pill);

        if (!revokedLog.some(r => r.id === cached.id)) {
            revokedLog.unshift({
                id: cached.id,
                sender: cached.sender || 'Seseorang',
                time: cached.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: cached.text || `[Media ${cached.mediaType || 'file'}]`,
                mediaType: cached.mediaType,
                revokedAt: Date.now()
            });
            if (revokedLog.length > 50) revokedLog.pop();

            const senderName = cached.sender || 'Kontak';
            const snippet = cached.text ? (cached.text.length > 35 ? cached.text.substring(0, 32) + '...' : cached.text) : `[Media ${cached.mediaType || 'file'}]`;
            showToast(
                "Pesan Ditarik Terdeteksi",
                `${senderName}: "${snippet}"`,
                `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`,
                "#f43f5e"
            );
        }
    }

    function scanAndProcessMessages() {
        if (!antiDeleteActive) return;
        const mainEl = document.querySelector('#main');
        if (!mainEl) return;

        const messageNodes = mainEl.querySelectorAll('[data-id]');
        for (let i = 0; i < messageNodes.length; i++) {
            const node = messageNodes[i];
            const msgId = node.getAttribute('data-id');
            if (!msgId) continue;

            if (isRevokedMessage(node)) {
                if (messageCache.has(msgId)) {
                    restoreRevokedMessage(node, messageCache.get(msgId));
                }
            } else {
                const data = extractMessageData(node);
                if (data && (data.text || data.mediaType)) {
                    cacheMessage(msgId, data);
                }
            }
        }
    }

    let messagesObserver = null;
    let isScanPending = false;

    function scheduleMessageScan() {
        if (!antiDeleteActive || isScanPending) return;
        isScanPending = true;
        requestAnimationFrame(() => {
            isScanPending = false;
            scanAndProcessMessages();
        });
    }

    function bindMainChatObserver() {
        const mainEl = document.querySelector('#main');
        if (!mainEl) {
            if (messagesObserver) {
                messagesObserver.disconnect();
                messagesObserver = null;
            }
            return;
        }

        scheduleMessageScan();

        if (!messagesObserver || messagesObserver.__target !== mainEl) {
            if (messagesObserver) messagesObserver.disconnect();
            messagesObserver = new MutationObserver(() => {
                scheduleMessageScan();
            });
            messagesObserver.__target = mainEl;
            messagesObserver.observe(mainEl, { childList: true, subtree: true });
        }
    }

    window.__modstams_toggleAntiDelete = function() {
        antiDeleteActive = !antiDeleteActive;
        safeSet('modstams_anti_delete', antiDeleteActive ? 'true' : 'false');
        if (antiDeleteActive) {
            scheduleMessageScan();
        }
        showToast(
            antiDeleteActive ? "Anti-Tarik Diaktifkan" : "Anti-Tarik Dinonaktifkan",
            antiDeleteActive ? "Pesan yang ditarik pengirim akan otomatis dipulihkan (Ctrl+Shift+D)" : "Pesan ditarik tidak akan diintersepsi",
            `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${antiDeleteActive ? '#f43f5e' : '#94a3b8'}" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`,
            antiDeleteActive ? "#f43f5e" : "#94a3b8"
        );
        const parent = document.getElementById('sw-antidelete');
        if (parent) {
            parent.innerHTML = renderSwitch('sw-btn-antidelete', antiDeleteActive, '#f43f5e');
        }
    };

    window.__modstams_openRevokedLogModal = function() {
        if (!document.body) return;
        const existing = document.getElementById('modstams-revoked-log-modal');
        if (existing) {
            existing.remove();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'modstams-revoked-log-modal';
        modal.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100vw',
            'height: 100vh',
            'background: rgba(15, 23, 42, 0.75)',
            'backdrop-filter: blur(4px)',
            'z-index: 9999999',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        ].join(';');

        const listHtml = revokedLog.length === 0 ? `
            <div style="padding: 36px 16px; text-align: center; color: #94a3b8;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.5" style="margin: 0 auto 12px; display: block;">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                </svg>
                <div style="font-size: 13px; font-weight: 500; color: #f1f5f9; margin-bottom: 4px;">Belum Ada Pesan Ditarik</div>
                <div style="font-size: 11px;">Pesan yang dihapus oleh pengirim selama sesi ini akan otomatis dicatat di sini.</div>
            </div>
        ` : revokedLog.map(item => `
            <div style="background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 12px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-weight: 600; font-size: 12px; color: #f43f5e;">${escapeHtml(item.sender)}</span>
                        <span style="font-size: 11px; color: #64748b;">${item.time}</span>
                        ${item.mediaType ? `<span style="font-size: 9px; background: rgba(244,63,94,0.18); color: #f43f5e; padding: 1px 4px; border-radius: 3px; text-transform: uppercase; font-weight: 600;">${item.mediaType}</span>` : ''}
                    </div>
                    <button class="btn-copy-revoked" data-text="${escapeHtml(item.text)}" style="background: #1e293b; border: 1px solid #334155; color: #94a3b8; border-radius: 4px; padding: 3px 8px; font-size: 11px; cursor: pointer; transition: all 0.12s ease;">Salin</button>
                </div>
                <div style="font-size: 12.5px; color: #f1f5f9; line-height: 1.4; word-break: break-word; user-select: text; -webkit-user-select: text;">
                    ${escapeHtml(item.text)}
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; width: 460px; max-width: 92vw; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); color: #f1f5f9; overflow: hidden; display: flex; flex-direction: column; max-height: 80vh;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid #334155; background: #1e293b;">
                    <div>
                        <div style="font-weight: 600; font-size: 14px; color: #f1f5f9; display: flex; align-items: center; gap: 6px;">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            Log Pesan Ditarik (${revokedLog.length})
                        </div>
                        <div style="font-size: 11px; color: #94a3b8; margin-top: 1px;">Riwayat pesan yang ditarik pengirim pada sesi ini</div>
                    </div>
                    <button id="modstams-revoked-close" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; line-height: 1; padding: 4px; border-radius: 4px;">&times;</button>
                </div>
                <div style="padding: 14px 18px; overflow-y: auto; flex: 1;">
                    ${listHtml}
                </div>
                <div style="padding: 10px 18px; background: #0f172a; border-top: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
                    <button id="modstams-revoked-clear" style="background: transparent; border: 1px solid #334155; color: #94a3b8; border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: pointer;">Bersihkan Log</button>
                    <button id="modstams-revoked-done" style="background: #334155; border: none; color: #f1f5f9; border-radius: 4px; padding: 5px 12px; font-size: 11px; font-weight: 500; cursor: pointer;">Tutup</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelectorAll('.btn-copy-revoked').forEach(btn => {
            btn.onclick = () => {
                const txt = btn.getAttribute('data-text');
                navigator.clipboard.writeText(txt).then(() => {
                    btn.innerText = 'Tersalin!';
                    btn.style.color = '#22c55e';
                    setTimeout(() => {
                        btn.innerText = 'Salin';
                        btn.style.color = '#94a3b8';
                    }, 1500);
                });
            };
        });

        modal.querySelector('#modstams-revoked-clear').onclick = () => {
            revokedLog.length = 0;
            modal.remove();
            showToast("Log Dibersihkan", "Riwayat pesan ditarik telah dikosongkan", null, "#94a3b8");
        };

        modal.querySelector('#modstams-revoked-close').onclick = () => modal.remove();
        modal.querySelector('#modstams-revoked-done').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        modal.onkeydown = (e) => { if (e.key === 'Escape') modal.remove(); };
    };

    /* ==========================================================================
       11. MODSTAMS PREFERENCES DIALOG (Linear / Raycast Professional SaaS UI)
       ========================================================================== */
    function renderSwitch(id, active, activeColor = '#3b82f6') {
        return `
            <div id="${id}" style="width: 36px; height: 20px; border-radius: 10px; background: ${active ? activeColor : '#334155'}; position: relative; cursor: pointer; transition: background 0.15s ease;">
                <div style="width: 16px; height: 16px; border-radius: 50%; background: #ffffff; position: absolute; top: 2px; left: ${active ? '18px' : '2px'}; transition: left 0.15s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>
            </div>
        `;
    }

    function renderCheckboxChip(id, checked, label) {
        return `
            <div id="${id}" style="display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 6px; cursor: pointer; background: ${checked ? 'rgba(59, 130, 246, 0.1)' : '#1e293b'}; border: 1px solid ${checked ? '#3b82f6' : '#334155'}; transition: all 0.12s ease;">
                <div style="width: 14px; height: 14px; border-radius: 3px; border: 1.5px solid ${checked ? '#3b82f6' : '#64748b'}; background: ${checked ? '#3b82f6' : 'transparent'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    ${checked ? '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                </div>
                <span style="font-size: 12px; font-weight: 500; color: ${checked ? '#f1f5f9' : '#94a3b8'};">${label}</span>
            </div>
        `;
    }

    window.__waweb_toggleModCenter = function() {
        if (!document.body) return;
        const existing = document.getElementById('modstams-preferences-dialog');
        if (existing) {
            existing.remove();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'modstams-preferences-dialog';
        modal.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100vw',
            'height: 100vh',
            'background: rgba(15, 23, 42, 0.7)',
            'backdrop-filter: blur(4px)',
            'z-index: 999999',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        ].join(';');

        modal.innerHTML = `
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; width: 440px; max-width: 92vw; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); color: #f1f5f9; overflow: hidden; display: flex; flex-direction: column;">
                
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #334155; background: #1e293b;">
                    <div>
                        <div style="font-weight: 600; font-size: 15px; color: #f1f5f9;">Preferences</div>
                        <div style="font-size: 12px; color: #94a3b8; margin-top: 1px;">Privacy and desktop controls</div>
                    </div>
                    <button id="modstams-hud-close" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; line-height: 1; padding: 4px; border-radius: 4px;">&times;</button>
                </div>

                <!-- Body (Linear SaaS Layout) -->
                <div style="padding: 18px 20px; display: flex; flex-direction: column; gap: 16px; max-height: 75vh; overflow-y: auto;">
                    
                    <!-- Section 1: Privacy Blur -->
                    <div>
                        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px;">Privacy & Blur</div>
                        
                        <div style="background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 500; font-size: 13px; color: #f1f5f9;">Master Privacy Blur</div>
                                    <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Conceal message contents until hovered (Ctrl+B)</div>
                                </div>
                                <div id="sw-master-privacy">${renderSwitch('sw-btn-master', privacyConfig.active)}</div>
                            </div>

                            <div style="display: flex; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid #1e293b;">
                                <span style="font-size: 12px; color: #94a3b8; white-space: nowrap;">Blur Intensity:</span>
                                <input id="hud-blur-slider" type="range" min="4" max="16" value="${privacyConfig.intensity}" style="flex: 1; accent-color: #3b82f6; cursor: pointer;">
                                <span id="hud-blur-val" style="font-size: 12px; font-weight: 600; color: #3b82f6; min-width: 28px; text-align: right;">${privacyConfig.intensity}px</span>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding-top: 8px; border-top: 1px solid #1e293b;">
                                ${renderCheckboxChip('chip-chat', privacyConfig.blurChat, 'Message Text')}
                                ${renderCheckboxChip('chip-media', privacyConfig.blurMedia, 'Photos & Media')}
                                ${renderCheckboxChip('chip-preview', privacyConfig.blurPreview, 'Sidebar Preview')}
                                ${renderCheckboxChip('chip-names', privacyConfig.blurNames, 'Contact Names')}
                                ${renderCheckboxChip('chip-avatars', privacyConfig.blurAvatars, 'Profile Photos')}
                                ${renderCheckboxChip('chip-input', privacyConfig.blurInput, 'Draft Input')}
                            </div>
                        </div>
                    </div>

                    <!-- Section 2: Stealth & Desktop Controls -->
                    <div>
                        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px;">Stealth & Window</div>
                        
                        <div style="background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 500; font-size: 13px; color: #f1f5f9;">Ghost Read</div>
                                    <div style="font-size: 11px; color: #94a3b8; margin-top: 1px;">Suppress read receipts (Ctrl+Shift+G)</div>
                                </div>
                                <div id="sw-ghostread">${renderSwitch('sw-btn-ghostread', ghostReadActive)}</div>
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #1e293b;">
                                <div>
                                    <div style="font-weight: 500; font-size: 13px; color: #f1f5f9;">Ghost Typing</div>
                                    <div style="font-size: 11px; color: #94a3b8; margin-top: 1px;">Conceal "typing..." indicator (Ctrl+Shift+T)</div>
                                </div>
                                <div id="sw-ghosttyping">${renderSwitch('sw-btn-ghosttyping', ghostTypingActive)}</div>
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #1e293b;">
                                <div>
                                    <div style="font-weight: 500; font-size: 13px; color: #f1f5f9; display: flex; align-items: center; gap: 6px;">
                                        <span>Anti-Tarik Pesan</span>
                                        <span style="font-size: 10px; background: rgba(244, 63, 94, 0.15); color: #f43f5e; padding: 1px 5px; border-radius: 4px; font-weight: 600;">RANK S+</span>
                                    </div>
                                    <div style="font-size: 11px; color: #94a3b8; margin-top: 1px;">Pulihkan & tampilkan pesan yang dihapus (Ctrl+Shift+D)</div>
                                </div>
                                <div id="sw-antidelete">${renderSwitch('sw-btn-antidelete', antiDeleteActive, '#f43f5e')}</div>
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #1e293b;">
                                <div>
                                    <div style="font-weight: 500; font-size: 13px; color: #f1f5f9;">Log Pesan Ditarik</div>
                                    <div id="val-revoked-count" style="font-size: 11px; color: #94a3b8; margin-top: 1px;">${revokedLog.length} pesan tercatat di sesi aktif</div>
                                </div>
                                <button id="btn-view-revoked" style="background: #1e293b; border: 1px solid #334155; color: #f1f5f9; border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s ease;">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                                    Buka Log (${revokedLog.length})
                                </button>
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #1e293b;">
                                <div>
                                    <div style="font-weight: 500; font-size: 13px; color: #f1f5f9;">Always On Top</div>
                                    <div style="font-size: 11px; color: #94a3b8; margin-top: 1px;">Pin window above all applications (Ctrl+Shift+P)</div>
                                </div>
                                <div id="sw-pin-window">${renderSwitch('sw-btn-pin', isWindowPinned)}</div>
                            </div>

                            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #1e293b;">
                                <div>
                                    <div style="font-weight: 500; font-size: 13px; color: #f1f5f9;">Pitch Black Theme (OLED)</div>
                                    <div style="font-size: 11px; color: #94a3b8; margin-top: 1px;">High contrast pure #000000 mode (Ctrl+Shift+O)</div>
                                </div>
                                <div id="sw-oled">${renderSwitch('sw-btn-oled', currentTheme === 'oled')}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 3: Security & Quick Tools -->
                    <div>
                        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 8px;">Security & Tools</div>
                        
                        <div style="background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
                            
                            <!-- Auto-Lock Idle Threshold -->
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="font-weight: 500; font-size: 13px; color: #f1f5f9;">Auto-Lock On Inactivity</div>
                                    <div style="font-size: 11px; color: #94a3b8; margin-top: 1px;">Lock workspace when idle</div>
                                </div>
                                <div id="val-autolock-hud" style="font-size: 12px; font-weight: 600; color: #3b82f6;">${autoLockMinutes > 0 ? autoLockMinutes + 'm' : 'Off'}</div>
                            </div>

                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
                                ${[0, 2, 5, 10].map(m => `
                                    <button class="btn-autolock" data-min="${m}" style="padding: 6px 0; font-size: 12px; font-weight: 500; border-radius: 6px; border: 1px solid ${autoLockMinutes === m ? '#3b82f6' : '#334155'}; background: ${autoLockMinutes === m ? 'rgba(59, 130, 246, 0.15)' : '#1e293b'}; color: ${autoLockMinutes === m ? '#3b82f6' : '#94a3b8'}; cursor: pointer; transition: all 0.12s ease;">${m === 0 ? 'Off' : m + ' min'}</button>
                                `).join('')}
                            </div>

                            <!-- PIN configuration -->
                            <div style="display: flex; gap: 8px; align-items: center; padding-top: 10px; border-top: 1px solid #1e293b;">
                                <input id="input-pin-hud" type="password" maxlength="4" placeholder="${appPin ? 'Change PIN (4-digits)' : 'Set PIN (4-digits)'}" style="flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 8px 12px; color: #f1f5f9; font-size: 12px; outline: none;">
                                <button id="btn-save-pin-hud" style="background: #334155; color: #f1f5f9; border: none; border-radius: 6px; padding: 8px 14px; font-size: 12px; font-weight: 500; cursor: pointer;">Save</button>
                            </div>

                            <!-- Temporary Media & Storage Cache Purge -->
                            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #1e293b;">
                                <div>
                                    <div style="font-weight: 500; font-size: 13px; color: #f1f5f9;">Media & Storage Cache</div>
                                    <div id="val-cache-status" style="font-size: 11px; color: #94a3b8; margin-top: 1px;">Flush cache files & trim RAM (Safe)</div>
                                </div>
                                <button id="btn-purge-cache" style="background: #1e293b; border: 1px solid #334155; color: #f1f5f9; border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s ease;">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    Purge Cache
                                </button>
                            </div>

                            <!-- Action buttons -->
                            <div style="display: flex; gap: 8px; padding-top: 4px;">
                                <button id="btn-direct-chat" style="flex: 1; background: #1e293b; border: 1px solid #334155; color: #f1f5f9; border-radius: 6px; padding: 8px; font-size: 12px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    Direct Chat (Ctrl+M)
                                </button>
                                <button id="btn-lock-app" style="flex: 1; background: #1e293b; border: 1px solid #334155; color: #ef4444; border-radius: 6px; padding: 8px; font-size: 12px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    Lock Screen (Ctrl+L)
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

                <!-- Footer -->
                <div style="padding: 12px 20px; background: #0f172a; border-top: 1px solid #334155; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;">
                    <div>Shortcuts: <b>Ctrl+Shift+D</b> (Anti-Tarik) • <b>Ctrl+B</b> (Blur) • <b>Ctrl+Shift+P</b> (Pin)</div>
                    <div style="color: #64748b;">v3.8</div>
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
                el.style.background = isChecked ? 'rgba(59, 130, 246, 0.1)' : '#1e293b';
                el.style.borderColor = isChecked ? '#3b82f6' : '#334155';
                const box = el.querySelector('div:first-child');
                box.style.borderColor = isChecked ? '#3b82f6' : '#64748b';
                box.style.background = isChecked ? '#3b82f6' : 'transparent';
                box.innerHTML = isChecked ? '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '';
                const span = el.querySelector('span');
                if (span) span.style.color = isChecked ? '#f1f5f9' : '#94a3b8';
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
        modal.querySelector('#sw-antidelete').onclick = () => {
            window.__modstams_toggleAntiDelete();
            modal.querySelector('#sw-antidelete').innerHTML = renderSwitch('sw-btn-antidelete', antiDeleteActive, '#f43f5e');
        };
        modal.querySelector('#btn-view-revoked').onclick = () => {
            modal.remove();
            window.__modstams_openRevokedLogModal();
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
                    b.style.borderColor = bm === m ? '#3b82f6' : '#334155';
                    b.style.background = bm === m ? 'rgba(59, 130, 246, 0.15)' : '#1e293b';
                    b.style.color = bm === m ? '#3b82f6' : '#94a3b8';
                });
                const label = modal.querySelector('#val-autolock-hud');
                if (label) label.innerText = m > 0 ? `${m}m` : 'Off';
                showToast("Auto-Lock", m > 0 ? `Locked after ${m} minutes idle` : "Auto-lock disabled", null, '#3b82f6');
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

        // Purge Cache Button
        modal.querySelector('#btn-purge-cache').onclick = () => {
            window.__modstams_purgeCache();
        };

        // PIN Save
        modal.querySelector('#btn-save-pin-hud').onclick = () => {
            const val = modal.querySelector('#input-pin-hud').value.trim();
            if (val.length === 4 && /^\d{4}$/.test(val)) {
                appPin = val;
                safeSet('modstams_app_pin', val);
                modal.querySelector('#input-pin-hud').value = '';
                showToast("PIN Updated", "Press Ctrl+L to lock workspace", null, '#22c55e');
            } else {
                showToast("Invalid PIN", "Enter exactly 4 digits", null, '#ef4444');
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
        // Ctrl+Shift+M: Preferences Dialog
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
        // Ctrl+Shift+D: Toggle Anti-Tarik Pesan
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            window.__modstams_toggleAntiDelete();
        }
        // Ctrl+Shift+Delete: Purge Storage & Media Cache
        if (e.ctrlKey && e.shiftKey && (e.key === 'Delete' || e.key === 'Del')) {
            e.preventDefault();
            window.__modstams_purgeCache();
        }
    });

    /* ==========================================================================
       13. EVENT-DRIVEN LIFECYCLE INITIALIZATION
       ========================================================================== */
    function initSuite() {
        applyCurrentTheme();
        applyPrivacyStyles();
        injectNativeHeaderButton();
        bindMainChatObserver();
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

    const rootObserver = new MutationObserver((mutations) => {
        for (let m = 0; m < mutations.length; m++) {
            if (mutations[m].addedNodes.length > 0) {
                checkAndInjectMediaDownloader(document.body);
                injectNativeHeaderButton();
                bindMainChatObserver();
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
