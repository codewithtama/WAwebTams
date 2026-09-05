(function() {
    if (window.__waweb_initialized) return;
    window.__waweb_initialized = true;

    console.log("[ModsTams] Super Suite v2.0 initialized.");

    /* ==========================================================================
       1. AUDIO SYNTHESIZER & TOAST NOTIFICATION SYSTEM
       ========================================================================== */
    function playChime(success = true) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            if (success) {
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.1); // A5
            } else {
                osc.frequency.setValueAtTime(440.00, now);
                osc.frequency.exponentialRampToValueAtTime(330.00, now + 0.15);
            }

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch(e) {}
    }

    function getToastContainer() {
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
                'gap: 10px',
                'pointer-events: none',
                'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            ].join(';');
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(title, subtitle, iconSvg = null, borderColor = '#00a884') {
        const container = getToastContainer();
        const toast = document.createElement('div');
        toast.style.cssText = [
            'pointer-events: auto',
            'display: flex',
            'align-items: center',
            'gap: 14px',
            'background: rgba(17, 27, 33, 0.95)',
            'color: #e9edef',
            'padding: 12px 18px',
            'border-radius: 12px',
            `border-left: 4px solid ${borderColor}`,
            'box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55), 0 0 1px rgba(255, 255, 255, 0.15)',
            'backdrop-filter: blur(16px)',
            'min-width: 260px',
            'max-width: 380px',
            'transform: translateY(20px)',
            'opacity: 0',
            'transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
        ].join(';');

        const defaultSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${borderColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

        toast.innerHTML = `
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(0, 168, 132, 0.15); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${iconSvg || defaultSvg}
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 13px; color: ${borderColor}; margin-bottom: 2px;">${title}</div>
                <div style="font-size: 12px; color: #e9edef; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${subtitle || ''}</div>
            </div>
        `;

        container.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        playChime(true);

        setTimeout(() => {
            toast.style.transform = 'translateY(15px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    function triggerDownload(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast("Download Berhasil", filename);
    }

    /* ==========================================================================
       2. MOD: ANTI VIEW-ONCE & CONTEXT MENU
       ========================================================================== */
    window.addEventListener('contextmenu', function(e) {
        e.stopPropagation();
    }, true);

    function injectViewOnceDownloader() {
        const mediaOverlays = document.querySelectorAll('div[data-animate-modal-popup="true"], div[role="dialog"]');
        mediaOverlays.forEach(overlay => {
            if (overlay.querySelector('#modstams-viewonce-btn')) return;

            const img = overlay.querySelector('img[src]');
            const video = overlay.querySelector('video[src]');
            const media = img || video;

            if (media && media.src) {
                const btn = document.createElement('button');
                btn.id = 'modstams-viewonce-btn';
                btn.style.cssText = [
                    'position: absolute',
                    'top: 20px',
                    'right: 80px',
                    'z-index: 9999',
                    'background: #00a884',
                    'color: #ffffff',
                    'border: none',
                    'border-radius: 8px',
                    'padding: 8px 14px',
                    'font-size: 12px',
                    'font-weight: 600',
                    'cursor: pointer',
                    'display: flex',
                    'align-items: center',
                    'gap: 6px',
                    'box-shadow: 0 4px 14px rgba(0,0,0,0.4)',
                    'transition: transform 0.15s ease'
                ].join(';');
                btn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Simpan Media</span>
                `;
                btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
                btn.onmouseleave = () => btn.style.transform = 'scale(1)';
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const ext = video ? 'mp4' : 'jpg';
                    const filename = `Media_${Date.now()}.${ext}`;
                    triggerDownload(media.src, filename);
                };
                overlay.appendChild(btn);
            }
        });
    }

    /* ==========================================================================
       3. MOD: DIRECT CHAT (Kirim Pesan Tanpa Simpan Kontak - Ctrl+M)
       ========================================================================== */
    window.__waweb_openDirectChatModal = function() {
        if (document.getElementById('modstams-direct-modal')) {
            document.getElementById('modstams-direct-modal').remove();
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
            'background: rgba(11, 20, 26, 0.78)',
            'backdrop-filter: blur(8px)',
            'z-index: 999999',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        ].join(';');

        modal.innerHTML = `
            <div style="background: #111b21; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 24px; width: 380px; box-shadow: 0 16px 40px rgba(0,0,0,0.6);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div style="font-weight: 600; font-size: 16px; color: #00a884; display: flex; align-items: center; gap: 8px;">
                        <span>🚀 Direct Chat (Tanpa Simpan Nomor)</span>
                    </div>
                    <button id="modstams-direct-close" style="background: transparent; border: none; color: #8696a0; cursor: pointer; font-size: 18px;">✕</button>
                </div>
                <div style="font-size: 13px; color: #8696a0; margin-bottom: 12px;">Masukkan nomor HP tujuan (contoh: 08123456789 atau 62812...):</div>
                <input id="modstams-direct-phone" type="text" placeholder="08xxxxxxxxxx" style="width: 100%; box-sizing: border-box; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 12px; color: #e9edef; font-size: 14px; outline: none; margin-bottom: 12px;">
                <textarea id="modstams-direct-msg" placeholder="Pesan pembuka (opsional)..." rows="2" style="width: 100%; box-sizing: border-box; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 10px; color: #e9edef; font-size: 13px; outline: none; margin-bottom: 16px; resize: none;"></textarea>
                <div style="display: flex; gap: 10px;">
                    <button id="modstams-direct-btn" style="flex: 1; background: #00a884; color: white; border: none; border-radius: 8px; padding: 12px; font-weight: 600; cursor: pointer; font-size: 14px;">Buka Obrolan</button>
                    <button id="modstams-direct-cancel" style="background: #202c33; color: #8696a0; border: none; border-radius: 8px; padding: 12px 18px; font-weight: 500; cursor: pointer;">Batal</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const inputPhone = modal.querySelector('#modstams-direct-phone');
        inputPhone.focus();

        function executeDirectChat() {
            let raw = inputPhone.value.trim().replace(/[^0-9+]/g, '');
            if (!raw) {
                showToast("Nomor Kosong", "Silakan ketik nomor HP tujuan", null, '#ff5252');
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
       4. MOD: STATUS / STORY SAVER
       ========================================================================== */
    function injectStatusDownloader() {
        const statusPanel = document.querySelector('div[role="region"][tabindex="-1"], div[data-animate-modal-body="true"]');
        if (statusPanel && !statusPanel.querySelector('#modstams-status-download-btn')) {
            const media = statusPanel.querySelector('img[src], video[src]');
            if (media && media.src) {
                const btn = document.createElement('button');
                btn.id = 'modstams-status-download-btn';
                btn.style.cssText = [
                    'position: absolute',
                    'bottom: 30px',
                    'right: 30px',
                    'z-index: 99999',
                    'background: rgba(0, 168, 132, 0.95)',
                    'color: #ffffff',
                    'border: none',
                    'border-radius: 30px',
                    'padding: 10px 18px',
                    'font-size: 13px',
                    'font-weight: 600',
                    'cursor: pointer',
                    'display: flex',
                    'align-items: center',
                    'gap: 8px',
                    'box-shadow: 0 6px 20px rgba(0,0,0,0.5)',
                    'backdrop-filter: blur(8px)'
                ].join(';');
                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Unduh Story Ini</span>
                `;
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const isVideo = statusPanel.querySelector('video[src]') !== null;
                    const src = (statusPanel.querySelector('video[src]') || statusPanel.querySelector('img[src]')).src;
                    const filename = `Story_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;
                    triggerDownload(src, filename);
                };
                statusPanel.appendChild(btn);
            }
        }
    }

    /* ==========================================================================
       5. MOD: GHOST TYPING (Sembunyikan Status Sedang Mengetik)
       ========================================================================== */
    let ghostTypingActive = localStorage.getItem('modstams_ghost_typing') !== 'false';
    window.__waweb_toggleGhostTyping = function() {
        ghostTypingActive = !ghostTypingActive;
        localStorage.setItem('modstams_ghost_typing', ghostTypingActive ? 'true' : 'false');
        showToast(
            ghostTypingActive ? "👻 Ghost Typing Aktif" : "Typing Normal",
            ghostTypingActive ? "Status 'Sedang mengetik...' disembunyikan" : "Status 'Sedang mengetik...' terlihat lawan bicara",
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
       6. MOD: ANTI-CENTANG BIRU / GHOST READ
       ========================================================================== */
    let ghostReadActive = localStorage.getItem('modstams_ghost_read') !== 'false';

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
        localStorage.setItem('modstams_ghost_read', ghostReadActive ? 'true' : 'false');
        showToast(
            ghostReadActive ? "👻 Anti-Centang Biru Aktif" : "Centang Biru Normal",
            ghostReadActive ? "Bebas baca chat tanpa memicu centang biru di pengirim" : "Status baca dikirim seperti biasa",
            null,
            ghostReadActive ? "#00d2ff" : "#8696a0"
        );
    };

    /* ==========================================================================
       7. MOD: ANTI-DELETE & PUSAT LOG RIWAYAT PESAN DITARIK
       ========================================================================== */
    const messageStore = new Map();
    let deletedLogs = [];
    try {
        deletedLogs = JSON.parse(localStorage.getItem('modstams_deleted_log') || '[]');
    } catch(e) { deletedLogs = []; }

    function saveDeletedLog(sender, text, time) {
        // Prevent duplicates
        const exists = deletedLogs.some(item => item.text === text && Math.abs(new Date(item.timestamp).getTime() - new Date().getTime()) < 60000);
        if (!exists) {
            deletedLogs.unshift({
                id: 'del_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                sender: sender || 'Kontak',
                text: text,
                time: time,
                timestamp: new Date().toISOString()
            });
            if (deletedLogs.length > 100) deletedLogs.pop(); // Max 100 entries
            localStorage.setItem('modstams_deleted_log', JSON.stringify(deletedLogs));

            showToast(
                "🚫 Pesan Ditarik Terdeteksi!",
                `${sender || 'Seseorang'}: "${text.length > 28 ? text.substring(0, 28) + '...' : text}"`,
                `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`,
                '#ff5252'
            );
        }
    }

    function watchAndPreserveMessages() {
        const chatBubbles = document.querySelectorAll('div[data-id], div.message-in, div.message-out');
        chatBubbles.forEach(bubble => {
            const id = bubble.getAttribute('data-id') || bubble.id;
            if (!id) return;

            const textEl = bubble.querySelector('.selectable-text');
            if (textEl && textEl.innerText && !textEl.innerText.includes('Pesan ini telah dihapus') && !textEl.innerText.includes('This message was deleted')) {
                if (!messageStore.has(id)) {
                    // Try getting sender name
                    const senderEl = bubble.querySelector('span[aria-label], div[data-pre-plain-text]');
                    let sender = 'Kontak';
                    if (senderEl) {
                        const raw = senderEl.getAttribute('data-pre-plain-text') || senderEl.getAttribute('aria-label') || '';
                        const match = raw.match(/\]\s*([^:]+):/);
                        if (match && match[1]) sender = match[1].trim();
                    }
                    messageStore.set(id, {
                        sender: sender,
                        text: textEl.innerText,
                        html: textEl.innerHTML,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });
                }
            }

            const isDeleted = bubble.querySelector('span[data-icon="recalled"]') ||
                              (bubble.innerText && (bubble.innerText.includes('Pesan ini telah dihapus') || bubble.innerText.includes('This message was deleted')));

            if (isDeleted && !bubble.querySelector('.modstams-antidelete-preserved')) {
                const cached = messageStore.get(id);
                if (cached) {
                    const restoredBox = document.createElement('div');
                    restoredBox.className = 'modstams-antidelete-preserved';
                    restoredBox.style.cssText = [
                        'margin-top: 6px',
                        'padding: 8px 10px',
                        'background: rgba(255, 82, 82, 0.14)',
                        'border-left: 3px solid #ff5252',
                        'border-radius: 6px',
                        'font-size: 13px',
                        'color: #e9edef'
                    ].join(';');
                    restoredBox.innerHTML = `
                        <div style="color: #ff5252; font-size: 11px; font-weight: 700; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
                            <span>🚫 PESAN DITARIK (${cached.time})</span>
                        </div>
                        <div style="font-style: italic; color: #ffffff;">${cached.text}</div>
                    `;
                    bubble.appendChild(restoredBox);
                    saveDeletedLog(cached.sender, cached.text, cached.time);
                }
            }
        });
    }

    /* ==========================================================================
       8. MOD: MULTI-THEME & ACCENT COLOR SYSTEM
       ========================================================================== */
    const THEMES = {
        emerald: {
            name: "Emerald ModsTams",
            accent: "#00a884",
            css: ""
        },
        cyberpunk: {
            name: "Cyberpunk Neon",
            accent: "#00e5ff",
            css: `
                :root {
                    --accent: #00e5ff !important;
                    --teal: #00e5ff !important;
                    --primary-strong: #ff007f !important;
                }
                #waweb-mod-launcher { background: linear-gradient(135deg, #00e5ff, #ff007f) !important; color: #000 !important; }
                header, [data-testid="chat-list-search"] { border-color: rgba(0, 229, 255, 0.25) !important; }
                .message-out { background-color: #0b3d42 !important; border-right: 2px solid #00e5ff !important; }
                span[data-icon="status-unread"] { fill: #ff007f !important; }
                span[data-icon="msg-dblcheck-ack"] svg { fill: #00e5ff !important; }
            `
        },
        midnight: {
            name: "Midnight Sapphire",
            accent: "#3b82f6",
            css: `
                body, #app, #app > div, #main, #pane-side { background-color: #0b1120 !important; }
                .message-out { background-color: #1e3a8a !important; border-left: 2px solid #3b82f6 !important; }
                .message-in { background-color: #0f172a !important; }
                header, footer { background-color: #0b1329 !important; }
                #waweb-mod-launcher { background: #2563eb !important; }
            `
        },
        crimson: {
            name: "Sunset Crimson",
            accent: "#f97316",
            css: `
                .message-out { background-color: #7c2d12 !important; border-left: 2px solid #f97316 !important; }
                .message-in { background-color: #1c1917 !important; }
                header, footer { background-color: #12100e !important; }
                #waweb-mod-launcher { background: linear-gradient(135deg, #f97316, #ef4444) !important; }
            `
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

    let currentTheme = localStorage.getItem('modstams_theme') || 'emerald';
    let themeStyleElement = null;

    function applyCurrentTheme() {
        if (!themeStyleElement) {
            themeStyleElement = document.createElement('style');
            themeStyleElement.id = 'modstams-theme-style';
            document.head.appendChild(themeStyleElement);
        }
        const themeObj = THEMES[currentTheme] || THEMES.emerald;
        themeStyleElement.textContent = themeObj.css;
    }

    window.__modstams_setTheme = function(themeKey) {
        if (!THEMES[themeKey]) return;
        currentTheme = themeKey;
        localStorage.setItem('modstams_theme', themeKey);
        applyCurrentTheme();
        showToast("🎨 Tema Diubah", THEMES[themeKey].name, null, THEMES[themeKey].accent || '#00a884');
    };

    applyCurrentTheme();

    /* ==========================================================================
       9. MOD: PRIVACY MODE (Blur Chat / Anti-Intip - Ctrl+B)
       ========================================================================== */
    let privacyActive = false;
    let privacyStyle = null;

    window.__waweb_togglePrivacy = function() {
        privacyActive = !privacyActive;
        if (privacyActive) {
            if (!privacyStyle) {
                privacyStyle = document.createElement('style');
                privacyStyle.id = 'modstams-privacy-style';
                privacyStyle.textContent = `
                    #main [data-testid="conversation-panel-body"] span,
                    #main [data-testid="cell-frame-container"] span,
                    #main img, #main video,
                    #pane-side span[title] {
                        filter: blur(7px) !important;
                        transition: filter 0.15s ease-in-out !important;
                    }
                    #main [data-testid="conversation-panel-body"]:hover span,
                    #main [data-testid="cell-frame-container"]:hover span,
                    #main img:hover, #main video:hover,
                    #pane-side div:hover span[title] {
                        filter: none !important;
                    }
                `;
                document.head.appendChild(privacyStyle);
            }
            showToast("🛡️ Privacy Mode Aktif", "Arahkan mouse ke chat untuk melihat");
        } else {
            if (privacyStyle) {
                privacyStyle.remove();
                privacyStyle = null;
            }
            showToast("👁️ Privacy Mode Nonaktif", "Tampilan chat normal");
        }
    };

    /* ==========================================================================
       10. MOD: APP LOCK & PIN SECURITY (Kunci Aplikasi - Ctrl+L)
       ========================================================================== */
    let appPin = localStorage.getItem('modstams_app_pin') || ''; // Default: no PIN set yet
    let isAppLocked = false;

    function renderLockOverlay() {
        if (document.getElementById('modstams-lock-screen')) return;

        const overlay = document.createElement('div');
        overlay.id = 'modstams-lock-screen';
        overlay.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100vw',
            'height: 100vh',
            'background: rgba(11, 20, 26, 0.96)',
            'backdrop-filter: blur(24px)',
            'z-index: 99999999',
            'display: flex',
            'flex-direction: column',
            'align-items: center',
            'justify-content: center',
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'color: #e9edef',
            'user-select: none'
        ].join(';');

        let enteredPin = "";

        overlay.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; max-width: 320px; width: 100%;">
                <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(0, 168, 132, 0.18); border: 2px solid #00a884; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 0 24px rgba(0, 168, 132, 0.35);">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00a884" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div style="font-size: 20px; font-weight: 700; color: #e9edef; margin-bottom: 6px;">ModsTams Terkunci</div>
                <div style="font-size: 13px; color: #8696a0; margin-bottom: 24px;">Masukkan PIN 4-digit untuk membuka</div>

                <div id="pin-dots" style="display: flex; gap: 14px; margin-bottom: 28px;">
                    <div class="pin-dot" style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid #8696a0; transition: all 0.15s ease;"></div>
                    <div class="pin-dot" style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid #8696a0; transition: all 0.15s ease;"></div>
                    <div class="pin-dot" style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid #8696a0; transition: all 0.15s ease;"></div>
                    <div class="pin-dot" style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid #8696a0; transition: all 0.15s ease;"></div>
                </div>

                <!-- Keypad -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; width: 240px;">
                    ${[1,2,3,4,5,6,7,8,9].map(n => `
                        <button class="pin-btn" data-val="${n}" style="height: 56px; border-radius: 28px; border: 1px solid rgba(255,255,255,0.08); background: #1f2c34; color: #e9edef; font-size: 20px; font-weight: 600; cursor: pointer; transition: all 0.1s ease;">${n}</button>
                    `).join('')}
                    <button id="pin-clear" style="height: 56px; border-radius: 28px; border: none; background: transparent; color: #8696a0; font-size: 13px; font-weight: 600; cursor: pointer;">C</button>
                    <button class="pin-btn" data-val="0" style="height: 56px; border-radius: 28px; border: 1px solid rgba(255,255,255,0.08); background: #1f2c34; color: #e9edef; font-size: 20px; font-weight: 600; cursor: pointer;">0</button>
                    <button id="pin-back" style="height: 56px; border-radius: 28px; border: none; background: transparent; color: #8696a0; font-size: 18px; font-weight: 600; cursor: pointer;">⌫</button>
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
                    dot.style.transform = 'scale(1.15)';
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
                    showToast("🔓 ModsTams Terbuka", "Selamat datang kembali!");
                } else {
                    playChime(false);
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
                    if (enteredPin.length === 4) setTimeout(checkPin, 100);
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
                    if (enteredPin.length === 4) setTimeout(checkPin, 100);
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
            showToast("PIN Belum Diatur", "Buka Control Center > Keamanan untuk mengatur PIN", null, '#ffaa00');
            return;
        }
        isAppLocked = true;
        renderLockOverlay();
    };

    /* ==========================================================================
       11. MOD: VOICE NOTE SUPER SPEED & AUDIO BOOSTER
       ========================================================================== */
    function injectAudioSuperController() {
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            if (audio.__modstams_controlled) return;
            audio.__modstams_controlled = true;

            audio.addEventListener('play', () => {
                let bar = document.getElementById('modstams-audio-bar');
                if (!bar) {
                    bar = document.createElement('div');
                    bar.id = 'modstams-audio-bar';
                    bar.style.cssText = [
                        'position: fixed',
                        'bottom: 80px',
                        'left: 50%',
                        'transform: translateX(-50%)',
                        'z-index: 99999',
                        'background: rgba(17, 27, 33, 0.95)',
                        'border: 1px solid rgba(0, 168, 132, 0.3)',
                        'border-radius: 30px',
                        'padding: 8px 16px',
                        'display: flex',
                        'align-items: center',
                        'gap: 10px',
                        'box-shadow: 0 10px 30px rgba(0,0,0,0.6)',
                        'backdrop-filter: blur(12px)',
                        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    ].join(';');

                    bar.innerHTML = `
                        <div style="font-size: 11px; font-weight: 700; color: #00a884; display: flex; align-items: center; gap: 4px;">
                            <span>🎙️ VN Speed:</span>
                        </div>
                        <div style="display: flex; gap: 4px;">
                            <button class="vn-spd-btn" data-spd="1.0" style="background:#202c33;color:#e9edef;border:none;border-radius:12px;padding:4px 8px;font-size:11px;font-weight:600;cursor:pointer;">1.0x</button>
                            <button class="vn-spd-btn" data-spd="1.5" style="background:#202c33;color:#e9edef;border:none;border-radius:12px;padding:4px 8px;font-size:11px;font-weight:600;cursor:pointer;">1.5x</button>
                            <button class="vn-spd-btn" data-spd="2.0" style="background:#202c33;color:#e9edef;border:none;border-radius:12px;padding:4px 8px;font-size:11px;font-weight:600;cursor:pointer;">2.0x</button>
                            <button class="vn-spd-btn" data-spd="2.5" style="background:#00a884;color:white;border:none;border-radius:12px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;">2.5x</button>
                            <button class="vn-spd-btn" data-spd="3.0" style="background:#00a884;color:white;border:none;border-radius:12px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;">3.0x</button>
                        </div>
                        <div style="width: 1px; height: 16px; background: rgba(255,255,255,0.12);"></div>
                        <button id="vn-boost-btn" style="background: rgba(255,170,0,0.15); color: #ffaa00; border: 1px solid rgba(255,170,0,0.4); border-radius: 12px; padding: 4px 10px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                            <span>📢 Boost +200%</span>
                        </button>
                    `;
                    document.body.appendChild(bar);

                    bar.querySelectorAll('.vn-spd-btn').forEach(b => {
                        b.onclick = () => {
                            const speed = parseFloat(b.getAttribute('data-spd'));
                            audio.playbackRate = speed;
                            showToast("Kecepatan VN", `${speed}x Aktif`);
                        };
                    });

                    let boosted = false;
                    bar.querySelector('#vn-boost-btn').onclick = () => {
                        boosted = !boosted;
                        audio.volume = boosted ? 1.0 : 0.8;
                        showToast(boosted ? "📢 Volume Boost Max" : "Volume Normal", boosted ? "Suara diperkeras maksimal" : "Volume audio normal", null, '#ffaa00');
                    };
                }
            });

            audio.addEventListener('ended', () => {
                const bar = document.getElementById('modstams-audio-bar');
                if (bar) bar.remove();
            });
            audio.addEventListener('pause', () => {
                setTimeout(() => {
                    if (audio.paused) {
                        const bar = document.getElementById('modstams-audio-bar');
                        if (bar) bar.remove();
                    }
                }, 4000);
            });
        });
    }

    /* ==========================================================================
       12. MOD: TEXT REPEATER (BOOM TEXT) & FANCY FONT GENERATOR
       ========================================================================== */
    function insertTextIntoChat(text) {
        const input = document.querySelector('footer div[contenteditable="true"]') ||
                      document.querySelector('div[contenteditable="true"][data-tab="10"]') ||
                      document.querySelector('div[contenteditable="true"]');
        if (!input) {
            showToast("Chat Belum Terbuka", "Buka ruang obrolan terlebih dahulu!", null, '#ff5252');
            return false;
        }
        input.focus();
        const success = document.execCommand('insertText', false, text);
        if (!success) {
            input.innerText = text;
            input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
        }
        showToast("Teks Dimasukkan", "Teks berhasil disalin ke kolom chat!");
        return true;
    }

    const FANCY_STYLES = {
        bold: text => text.replace(/[a-zA-Z0-9]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97);
            if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + code - 48);
            return c;
        }),
        italic: text => text.replace(/[a-zA-Z]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + code - 97);
            return c;
        }),
        mono: text => text.replace(/[a-zA-Z0-9]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + code - 97);
            if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + code - 48);
            return c;
        }),
        bubble: text => text.replace(/[a-zA-Z0-9]/g, c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65);
            if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97);
            if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
            if (code === 48) return '⓪';
            return c;
        })
    };

    /* ==========================================================================
       13. MOD: ANTI-CALL AUTO-MUTE
       ========================================================================== */
    let antiCallActive = localStorage.getItem('modstams_anti_call') === 'true';

    window.__modstams_toggleAntiCall = function() {
        antiCallActive = !antiCallActive;
        localStorage.setItem('modstams_anti_call', antiCallActive ? 'true' : 'false');
        showToast(
            antiCallActive ? "🔕 Anti-Call Aktif" : "Panggilan Normal",
            antiCallActive ? "Panggilan masuk otomatis diredam / diabaikan" : "Panggilan masuk akan berdering normal",
            null,
            antiCallActive ? "#ff5252" : "#8696a0"
        );
    };

    function watchAndSuppressCalls() {
        if (!antiCallActive) return;
        // Check for incoming call popups
        const callDeclines = document.querySelectorAll('button[data-testid="decline-call-btn"], div[role="dialog"] button[aria-label*="Decline"], div[role="dialog"] button[aria-label*="Tolak"]');
        callDeclines.forEach(btn => {
            btn.click();
            showToast("🔕 Panggilan Ditolak Otomatis", "Fitur Anti-Call ModsTams aktif", null, "#ff5252");
        });
    }

    /* ==========================================================================
       14. MODSTAMS CONTROL CENTER v2.0 (MODAL WITH TABS)
       ========================================================================== */
    window.__waweb_toggleModCenter = function() {
        const existing = document.getElementById('modstams-mod-center-modal');
        if (existing) {
            existing.remove();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'modstams-mod-center-modal';
        modal.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100vw',
            'height: 100vh',
            'background: rgba(11, 20, 26, 0.78)',
            'backdrop-filter: blur(10px)',
            'z-index: 999999',
            'display: flex',
            'align-items: center',
            'justify-content: center',
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        ].join(';');

        function renderSwitch(id, active) {
            return `
                <div id="${id}" style="width: 44px; height: 24px; border-radius: 12px; background: ${active ? '#00a884' : '#374248'}; position: relative; cursor: pointer; transition: background 0.2s ease;">
                    <div style="width: 18px; height: 18px; border-radius: 50%; background: #ffffff; position: absolute; top: 3px; left: ${active ? '23px' : '3px'}; transition: left 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
                </div>
            `;
        }

        modal.innerHTML = `
            <div style="background: #111b21; border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; width: 480px; max-width: 95vw; box-shadow: 0 24px 60px rgba(0,0,0,0.7); color: #e9edef; overflow: hidden; display: flex; flex-direction: column; max-height: 85vh;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.08); background: #182229;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(0, 168, 132, 0.2); display: flex; align-items: center; justify-content: center;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#00a884"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        </div>
                        <div>
                            <div style="font-weight: 700; font-size: 16px; color: #00a884;">ModsTams Control Center</div>
                            <div style="font-size: 11px; color: #8696a0;">Super Suite v2.0 • Ultra-Light Desktop Wrapper</div>
                        </div>
                    </div>
                    <button id="modstams-close-btn" style="background: transparent; border: none; color: #8696a0; cursor: pointer; font-size: 20px; line-height: 1;">✕</button>
                </div>

                <!-- Tabs Navigation -->
                <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.08); background: #111b21;">
                    <button class="tab-nav active" data-tab="tab-privacy" style="flex: 1; padding: 12px 6px; background: transparent; border: none; border-bottom: 2px solid #00a884; color: #00a884; font-size: 12px; font-weight: 600; cursor: pointer;">🛡️ Privasi</button>
                    <button class="tab-nav" data-tab="tab-theme" style="flex: 1; padding: 12px 6px; background: transparent; border: none; border-bottom: 2px solid transparent; color: #8696a0; font-size: 12px; font-weight: 600; cursor: pointer;">🎨 Tema</button>
                    <button class="tab-nav" data-tab="tab-deleted" style="flex: 1; padding: 12px 6px; background: transparent; border: none; border-bottom: 2px solid transparent; color: #8696a0; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                        <span>🚫 Log Ditarik</span>
                        <span id="tab-del-badge" style="background: #ff5252; color: white; font-size: 10px; padding: 1px 6px; border-radius: 10px;">${deletedLogs.length}</span>
                    </button>
                    <button class="tab-nav" data-tab="tab-tools" style="flex: 1; padding: 12px 6px; background: transparent; border: none; border-bottom: 2px solid transparent; color: #8696a0; font-size: 12px; font-weight: 600; cursor: pointer;">⚡ Alat Super</button>
                </div>

                <!-- Tab Contents -->
                <div style="padding: 20px 24px; overflow-y: auto; flex: 1;">
                    
                    <!-- TAB 1: PRIVASI & KEAMANAN -->
                    <div id="tab-privacy" class="tab-content" style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; background: #182229; padding: 12px 14px; border-radius: 12px;">
                            <div>
                                <div style="font-weight: 600; font-size: 13px; color: #e9edef;">👁️ Anti-Centang Biru (Ghost Read)</div>
                                <div style="font-size: 11px; color: #8696a0; margin-top: 2px;">Bebas baca chat tanpa memicu centang biru di pengirim</div>
                            </div>
                            <div id="switch-ghostread">${renderSwitch('sw-btn-ghostread', ghostReadActive)}</div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; background: #182229; padding: 12px 14px; border-radius: 12px;">
                            <div>
                                <div style="font-weight: 600; font-size: 13px; color: #e9edef;">👻 Sembunyikan Sedang Mengetik</div>
                                <div style="font-size: 11px; color: #8696a0; margin-top: 2px;">Lawan bicara tidak melihat status mengetik Anda</div>
                            </div>
                            <div id="switch-ghosttyping">${renderSwitch('sw-btn-ghosttyping', ghostTypingActive)}</div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; background: #182229; padding: 12px 14px; border-radius: 12px;">
                            <div>
                                <div style="font-weight: 600; font-size: 13px; color: #e9edef;">🛡️ Privacy Mode (Blur Chat)</div>
                                <div style="font-size: 11px; color: #8696a0; margin-top: 2px;">Blur semua pesan sampai kursor diarahkan (Ctrl+B)</div>
                            </div>
                            <div id="switch-privacy">${renderSwitch('sw-btn-privacy', privacyActive)}</div>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; background: #182229; padding: 12px 14px; border-radius: 12px;">
                            <div>
                                <div style="font-weight: 600; font-size: 13px; color: #e9edef;">🔕 Anti-Call (Auto-Mute Panggilan)</div>
                                <div style="font-size: 11px; color: #8696a0; margin-top: 2px;">Otomatis redam/tolak panggilan masuk agar tidak mengganggu</div>
                            </div>
                            <div id="switch-anticall">${renderSwitch('sw-btn-anticall', antiCallActive)}</div>
                        </div>

                        <!-- PIN Security Section -->
                        <div style="background: #182229; padding: 14px; border-radius: 12px; border: 1px solid rgba(0, 168, 132, 0.2);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <div style="font-weight: 600; font-size: 13px; color: #e9edef; display: flex; align-items: center; gap: 6px;">
                                        <span>🔒 Kunci Aplikasi (App Lock)</span>
                                    </div>
                                    <div style="font-size: 11px; color: #8696a0; margin-top: 2px;">Lindungi chat dengan PIN 4-digit (Ctrl+L)</div>
                                </div>
                                <button id="btn-lock-now" style="background: #00a884; color: white; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer;">Kunci Sekarang</button>
                            </div>
                            <div style="display: flex; gap: 8px; align-items: center; margin-top: 10px;">
                                <input id="input-new-pin" type="password" maxlength="4" placeholder="${appPin ? 'Ganti PIN (4 angka)' : 'Atur PIN (4 angka)'}" style="flex: 1; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 8px 12px; color: #e9edef; font-size: 13px; outline: none;">
                                <button id="btn-save-pin" style="background: #2a3942; color: #00a884; border: none; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer;">Simpan PIN</button>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 2: TEMA & TAMPILAN -->
                    <div id="tab-theme" class="tab-content" style="display: none; flex-direction: column; gap: 12px;">
                        <div style="font-size: 12px; color: #8696a0; margin-bottom: 4px;">Pilih tema dan aksen warna favorit Anda:</div>

                        <div class="theme-card" data-theme="emerald" style="display: flex; align-items: center; justify-content: space-between; background: #182229; padding: 12px 14px; border-radius: 12px; cursor: pointer; border: 1px solid ${currentTheme === 'emerald' ? '#00a884' : 'transparent'};">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 20px; height: 20px; border-radius: 50%; background: #00a884;"></div>
                                <div>
                                    <div style="font-weight: 600; font-size: 13px;">Emerald ModsTams (Klasik)</div>
                                    <div style="font-size: 11px; color: #8696a0;">Aksen hijau khas ModsTams yang elegan</div>
                                </div>
                            </div>
                            ${currentTheme === 'emerald' ? '<span style="color:#00a884; font-size:14px; font-weight:700;">✓</span>' : ''}
                        </div>

                        <div class="theme-card" data-theme="cyberpunk" style="display: flex; align-items: center; justify-content: space-between; background: #182229; padding: 12px 14px; border-radius: 12px; cursor: pointer; border: 1px solid ${currentTheme === 'cyberpunk' ? '#00e5ff' : 'transparent'};">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg, #00e5ff, #ff007f);"></div>
                                <div>
                                    <div style="font-weight: 600; font-size: 13px;">Cyberpunk Neon</div>
                                    <div style="font-size: 11px; color: #8696a0;">Kombinasi Cyan menyala & Neon Magenta futuristik</div>
                                </div>
                            </div>
                            ${currentTheme === 'cyberpunk' ? '<span style="color:#00e5ff; font-size:14px; font-weight:700;">✓</span>' : ''}
                        </div>

                        <div class="theme-card" data-theme="midnight" style="display: flex; align-items: center; justify-content: space-between; background: #182229; padding: 12px 14px; border-radius: 12px; cursor: pointer; border: 1px solid ${currentTheme === 'midnight' ? '#3b82f6' : 'transparent'};">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 20px; height: 20px; border-radius: 50%; background: #3b82f6;"></div>
                                <div>
                                    <div style="font-weight: 600; font-size: 13px;">Midnight Sapphire</div>
                                    <div style="font-size: 11px; color: #8696a0;">Navy gelap menenangkan dengan aksen Ice Blue</div>
                                </div>
                            </div>
                            ${currentTheme === 'midnight' ? '<span style="color:#3b82f6; font-size:14px; font-weight:700;">✓</span>' : ''}
                        </div>

                        <div class="theme-card" data-theme="crimson" style="display: flex; align-items: center; justify-content: space-between; background: #182229; padding: 12px 14px; border-radius: 12px; cursor: pointer; border: 1px solid ${currentTheme === 'crimson' ? '#f97316' : 'transparent'};">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 20px; height: 20px; border-radius: 50%; background: #f97316;"></div>
                                <div>
                                    <div style="font-weight: 600; font-size: 13px;">Sunset Crimson</div>
                                    <div style="font-size: 11px; color: #8696a0;">Nuansa arang hangat dengan aksen merah membara</div>
                                </div>
                            </div>
                            ${currentTheme === 'crimson' ? '<span style="color:#f97316; font-size:14px; font-weight:700;">✓</span>' : ''}
                        </div>

                        <div class="theme-card" data-theme="oled" style="display: flex; align-items: center; justify-content: space-between; background: #182229; padding: 12px 14px; border-radius: 12px; cursor: pointer; border: 1px solid ${currentTheme === 'oled' ? '#00a884' : 'transparent'};">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 20px; height: 20px; border-radius: 50%; background: #000000; border: 1px solid #333;"></div>
                                <div>
                                    <div style="font-weight: 600; font-size: 13px;">Ultra Dark OLED (Pitch Black)</div>
                                    <div style="font-size: 11px; color: #8696a0;">Hitam pekat murni #000000 hemat daya baterai</div>
                                </div>
                            </div>
                            ${currentTheme === 'oled' ? '<span style="color:#00a884; font-size:14px; font-weight:700;">✓</span>' : ''}
                        </div>
                    </div>

                    <!-- TAB 3: LOG PESAN DITARIK -->
                    <div id="tab-deleted" class="tab-content" style="display: none; flex-direction: column; gap: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="font-size: 12px; color: #8696a0;">Riwayat pesan yang ditarik selama sesi:</div>
                            <button id="btn-clear-del-logs" style="background: transparent; color: #ff5252; border: 1px solid rgba(255,82,82,0.3); border-radius: 6px; padding: 4px 10px; font-size: 11px; cursor: pointer;">Bersihkan Log</button>
                        </div>

                        <div id="del-logs-list" style="display: flex; flex-direction: column; gap: 10px; max-height: 48vh; overflow-y: auto; padding-right: 4px;">
                            ${deletedLogs.length === 0 ? `
                                <div style="text-align: center; padding: 36px 12px; color: #8696a0; font-size: 13px;">
                                    <div style="font-size: 28px; margin-bottom: 8px;">✨</div>
                                    Belum ada pesan yang ditarik.<br>Setiap pesan yang dihapus pengirim akan otomatis dicatat di sini!
                                </div>
                            ` : deletedLogs.map(item => `
                                <div style="background: #182229; border-left: 3px solid #ff5252; border-radius: 8px; padding: 10px 14px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <div style="font-weight: 700; font-size: 12px; color: #ff5252;">${item.sender}</div>
                                        <div style="font-size: 10px; color: #8696a0;">${item.time}</div>
                                    </div>
                                    <div style="font-size: 13px; color: #e9edef; word-break: break-word; margin-bottom: 8px;">${item.text}</div>
                                    <button class="btn-copy-del" data-text="${encodeURIComponent(item.text)}" style="background: #202c33; color: #8696a0; border: none; border-radius: 6px; padding: 4px 10px; font-size: 11px; cursor: pointer;">Salin Teks</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- TAB 4: ALAT CHAT SUPER -->
                    <div id="tab-tools" class="tab-content" style="display: none; flex-direction: column; gap: 16px;">
                        
                        <!-- Direct Chat Quick Action -->
                        <div style="background: #182229; padding: 14px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: 600; font-size: 13px; color: #e9edef;">🚀 Direct Chat Tanpa Simpan Nomor</div>
                                <div style="font-size: 11px; color: #8696a0; margin-top: 2px;">Kirim pesan langsung via nomor HP (Ctrl+M)</div>
                            </div>
                            <button id="btn-tab-direct" style="background: #00a884; color: white; border: none; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer;">Buka Direct Chat</button>
                        </div>

                        <!-- Text Repeater (Boom Text) -->
                        <div style="background: #182229; padding: 14px; border-radius: 12px;">
                            <div style="font-weight: 600; font-size: 13px; color: #e9edef; margin-bottom: 4px;">💥 Text Repeater (Boom Text)</div>
                            <div style="font-size: 11px; color: #8696a0; margin-bottom: 10px;">Duplikasi pesan N kali dan masukkan langsung ke kolom chat:</div>
                            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
                                <input id="boom-text-input" type="text" placeholder="Ketik kata/pesan..." style="flex: 2; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 8px 12px; color: #e9edef; font-size: 13px; outline: none;">
                                <input id="boom-count-input" type="number" min="1" max="100" value="5" style="width: 60px; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 8px 10px; color: #e9edef; font-size: 13px; outline: none; text-align: center;">
                                <button id="btn-boom-send" style="flex: 1; background: #00a884; color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; font-weight: 600; cursor: pointer;">Kirim ke Chat</button>
                            </div>
                        </div>

                        <!-- Aesthetic Fancy Font Generator -->
                        <div style="background: #182229; padding: 14px; border-radius: 12px;">
                            <div style="font-weight: 600; font-size: 13px; color: #e9edef; margin-bottom: 4px;">✨ Fancy Font Generator</div>
                            <div style="font-size: 11px; color: #8696a0; margin-bottom: 10px;">Ketik kata untuk mengubahnya menjadi font aesthetic unik:</div>
                            <input id="fancy-font-input" type="text" placeholder="Ketik teks di sini..." style="width: 100%; box-sizing: border-box; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 8px 12px; color: #e9edef; font-size: 13px; outline: none; margin-bottom: 10px;">
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="btn-fancy" data-style="bold" style="background: #202c33; border: 1px solid #2a3942; color: #e9edef; border-radius: 8px; padding: 8px; font-size: 12px; cursor: pointer; text-align: left;">𝗕𝗼𝗹𝗱 (𝗧𝗲𝗯𝗮𝗹)</button>
                                <button class="btn-fancy" data-style="italic" style="background: #202c33; border: 1px solid #2a3942; color: #e9edef; border-radius: 8px; padding: 8px; font-size: 12px; cursor: pointer; text-align: left;">𝘐𝘵𝘢𝘭𝘪𝘤 (𝘔𝘪𝘳𝘪𝘯𝘨)</button>
                                <button class="btn-fancy" data-style="mono" style="background: #202c33; border: 1px solid #2a3942; color: #e9edef; border-radius: 8px; padding: 8px; font-size: 12px; cursor: pointer; text-align: left;">𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎</button>
                                <button class="btn-fancy" data-style="bubble" style="background: #202c33; border: 1px solid #2a3942; color: #e9edef; border-radius: 8px; padding: 8px; font-size: 12px; cursor: pointer; text-align: left;">Ⓑⓤⓑⓑⓛⓔ</button>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Footer Shortcut Help -->
                <div style="padding: 12px 24px; background: #141d22; border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: #8696a0; display: flex; justify-content: space-between; align-items: center;">
                    <div>Shortcuts: <b>Ctrl+M</b> (Direct Chat) • <b>Ctrl+B</b> (Blur) • <b>Ctrl+L</b> (Lock)</div>
                    <div style="color: #00a884; font-weight: 600;">ModsTams v2.0</div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Tab Switching Logic
        const tabNavs = modal.querySelectorAll('.tab-nav');
        const tabContents = modal.querySelectorAll('.tab-content');
        tabNavs.forEach(nav => {
            nav.onclick = () => {
                tabNavs.forEach(n => {
                    n.style.borderBottomColor = 'transparent';
                    n.style.color = '#8696a0';
                });
                tabContents.forEach(c => c.style.display = 'none');

                nav.style.borderBottomColor = '#00a884';
                nav.style.color = '#00a884';
                const targetId = nav.getAttribute('data-tab');
                const targetEl = modal.querySelector('#' + targetId);
                if (targetEl) targetEl.style.display = 'flex';
            };
        });

        // Toggle switches
        modal.querySelector('#switch-ghostread').onclick = () => {
            window.__waweb_toggleGhostRead();
            modal.querySelector('#switch-ghostread').innerHTML = renderSwitch('sw-btn-ghostread', ghostReadActive);
        };
        modal.querySelector('#switch-ghosttyping').onclick = () => {
            window.__waweb_toggleGhostTyping();
            modal.querySelector('#switch-ghosttyping').innerHTML = renderSwitch('sw-btn-ghosttyping', ghostTypingActive);
        };
        modal.querySelector('#switch-privacy').onclick = () => {
            window.__waweb_togglePrivacy();
            modal.querySelector('#switch-privacy').innerHTML = renderSwitch('sw-btn-privacy', privacyActive);
        };
        modal.querySelector('#switch-anticall').onclick = () => {
            window.__modstams_toggleAntiCall();
            modal.querySelector('#switch-anticall').innerHTML = renderSwitch('sw-btn-anticall', antiCallActive);
        };

        // PIN Lock controls
        modal.querySelector('#btn-lock-now').onclick = () => {
            modal.remove();
            window.__modstams_lockApp();
        };
        modal.querySelector('#btn-save-pin').onclick = () => {
            const val = modal.querySelector('#input-new-pin').value.trim();
            if (val.length === 4 && /^\d{4}$/.test(val)) {
                appPin = val;
                localStorage.setItem('modstams_app_pin', val);
                modal.querySelector('#input-new-pin').value = '';
                showToast("PIN Tersimpan", "Gunakan Ctrl+L untuk mengunci aplikasi");
            } else {
                showToast("PIN Tidak Valid", "Harus berupa 4 digit angka (misal: 1234)", null, '#ff5252');
            }
        };

        // Theme switching
        modal.querySelectorAll('.theme-card').forEach(card => {
            card.onclick = () => {
                const themeKey = card.getAttribute('data-theme');
                window.__modstams_setTheme(themeKey);
                modal.remove();
                window.__waweb_toggleModCenter(); // Reopen to refresh active theme check
            };
        });

        // Deleted log actions
        modal.querySelectorAll('.btn-copy-del').forEach(btn => {
            btn.onclick = () => {
                const text = decodeURIComponent(btn.getAttribute('data-text'));
                navigator.clipboard.writeText(text);
                showToast("Teks Disalin", text);
            };
        });
        modal.querySelector('#btn-clear-del-logs').onclick = () => {
            deletedLogs = [];
            localStorage.removeItem('modstams_deleted_log');
            modal.querySelector('#del-logs-list').innerHTML = `
                <div style="text-align: center; padding: 36px 12px; color: #8696a0; font-size: 13px;">
                    ✨ Riwayat log telah dibersihkan.
                </div>
            `;
            modal.querySelector('#tab-del-badge').innerText = '0';
            showToast("Log Dibersihkan", "Riwayat pesan ditarik kosong");
        };

        // Tools tab actions
        modal.querySelector('#btn-tab-direct').onclick = () => {
            modal.remove();
            window.__waweb_openDirectChatModal();
        };

        // Boom Text
        modal.querySelector('#btn-boom-send').onclick = () => {
            const text = modal.querySelector('#boom-text-input').value.trim();
            const count = Math.min(100, Math.max(1, parseInt(modal.querySelector('#boom-count-input').value) || 5));
            if (!text) {
                showToast("Teks Kosong", "Masukkan kata atau pesan terlebih dahulu", null, '#ff5252');
                return;
            }
            const repeated = Array(count).fill(text).join('\n');
            modal.remove();
            insertTextIntoChat(repeated);
        };

        // Fancy Font buttons
        modal.querySelectorAll('.btn-fancy').forEach(b => {
            b.onclick = () => {
                const raw = modal.querySelector('#fancy-font-input').value.trim();
                if (!raw) {
                    showToast("Teks Kosong", "Ketik teks di kolom fancy font!", null, '#ff5252');
                    return;
                }
                const styleName = b.getAttribute('data-style');
                const fn = FANCY_STYLES[styleName];
                if (fn) {
                    const styled = fn(raw);
                    modal.remove();
                    insertTextIntoChat(styled);
                }
            };
        });

        modal.querySelector('#modstams-close-btn').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        modal.onkeydown = (e) => {
            if (e.key === 'Escape') modal.remove();
        };
    };

    /* ==========================================================================
       15. FLOATING MOD LAUNCHER BUTTON (⚡ ModsTams)
       ========================================================================== */
    function injectModLauncher() {
        if (document.getElementById('waweb-mod-launcher')) return;
        const btn = document.createElement('div');
        btn.id = 'waweb-mod-launcher';
        btn.title = 'Buka Panel Kontrol ModsTams (Ctrl+Shift+M)';
        btn.style.cssText = [
            'position: fixed',
            'top: 10px',
            'right: 80px',
            'z-index: 99999',
            'cursor: pointer',
            'display: flex',
            'align-items: center',
            'gap: 6px',
            'background: rgba(0, 168, 132, 0.92)',
            'color: #ffffff',
            'padding: 7px 14px',
            'border-radius: 20px',
            'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            'font-size: 12px',
            'font-weight: 700',
            'letter-spacing: 0.3px',
            'box-shadow: 0 4px 16px rgba(0,0,0,0.35)',
            'backdrop-filter: blur(8px)',
            'transition: transform 0.15s ease, background 0.15s ease',
            'user-select: none'
        ].join(';');
        btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <span>⚡ ModsTams</span>
        `;
        btn.onmouseenter = () => {
            btn.style.transform = 'scale(1.06)';
            btn.style.background = '#00c59b';
        };
        btn.onmouseleave = () => {
            btn.style.transform = 'scale(1)';
            btn.style.background = 'rgba(0, 168, 132, 0.92)';
        };
        btn.onclick = () => window.__waweb_toggleModCenter();
        document.body.appendChild(btn);
    }

    /* ==========================================================================
       16. GLOBAL SHORTCUTS
       ========================================================================== */
    window.addEventListener('keydown', function(e) {
        // F5 / Ctrl+R: Reload
        if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
            window.location.reload();
        }
        // Ctrl+M: Direct Chat
        if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            window.__waweb_openDirectChatModal();
        }
        // Ctrl+B: Privacy Blur
        if (e.ctrlKey && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            window.__waweb_togglePrivacy();
        }
        // Ctrl+L: Lock App with PIN
        if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            window.__modstams_lockApp();
        }
        // Ctrl+Shift+M: Open ModsTams Control Center
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            window.__waweb_toggleModCenter();
        }
        // Ctrl+Shift+O: OLED Theme Toggle
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') {
            e.preventDefault();
            window.__modstams_setTheme(currentTheme === 'oled' ? 'emerald' : 'oled');
        }
        // Ctrl+Shift+T: Ghost Typing Toggle
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            window.__waweb_toggleGhostTyping();
        }
        // Ctrl+Shift+G: Ghost Read Toggle
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g') {
            e.preventDefault();
            window.__waweb_toggleGhostRead();
        }
    });

    /* ==========================================================================
       17. CONTINUOUS OBSERVERS & HOOKS
       ========================================================================== */
    setInterval(() => {
        try {
            injectModLauncher();
            injectViewOnceDownloader();
            injectStatusDownloader();
            watchAndPreserveMessages();
            injectAudioSuperController();
            watchAndSuppressCalls();
        } catch (err) {}
    }, 1200);

    // Request native desktop notification permission
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
})();
