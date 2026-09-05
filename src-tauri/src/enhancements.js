(function() {
    if (window.__waweb_initialized) return;
    window.__waweb_initialized = true;

    console.log("[WAwebTams] Mod Enhancements Suite loaded.");

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

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch(e) {}
    }

    function getToastContainer() {
        let container = document.getElementById('waweb-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'waweb-toast-container';
            container.style.cssText = [
                'position: fixed',
                'bottom: 24px',
                'right: 24px',
                'z-index: 9999999',
                'display: flex',
                'flex-direction: column',
                'gap: 10px',
                'pointer-events: none',
                'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
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

    /* Helper function to download Blob or URL */
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
       MOD 1: ANTI VIEW-ONCE (Bypass Foto/Video 1x Lihat & Unduh)
       ========================================================================== */
    // Re-enable context menu everywhere
    window.addEventListener('contextmenu', function(e) {
        e.stopPropagation();
    }, true);

    function injectViewOnceDownloader() {
        // Monitor full-screen media viewer overlay for View Once media
        const mediaOverlays = document.querySelectorAll('div[data-animate-modal-popup="true"], div[role="dialog"]');
        mediaOverlays.forEach(overlay => {
            if (overlay.querySelector('#waweb-viewonce-btn')) return;

            const img = overlay.querySelector('img[src]');
            const video = overlay.querySelector('video[src]');
            const media = img || video;

            if (media && media.src) {
                const btn = document.createElement('button');
                btn.id = 'waweb-viewonce-btn';
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
                    const filename = `WA_Media_${Date.now()}.${ext}`;
                    triggerDownload(media.src, filename);
                };
                overlay.appendChild(btn);
            }
        });
    }

    /* ==========================================================================
       MOD 2: DIRECT CHAT (Kirim Pesan Tanpa Simpan Nomor - Ctrl+M)
       ========================================================================== */
    window.__waweb_openDirectChatModal = function() {
        if (document.getElementById('waweb-direct-modal')) {
            document.getElementById('waweb-direct-modal').remove();
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'waweb-direct-modal';
        modal.style.cssText = [
            'position: fixed',
            'top: 0',
            'left: 0',
            'width: 100vw',
            'height: 100vh',
            'background: rgba(11, 20, 26, 0.75)',
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
                        <span>🚀 Direct Chat (Tanpa Simpan Kontak)</span>
                    </div>
                    <button id="waweb-direct-close" style="background: transparent; border: none; color: #8696a0; cursor: pointer; font-size: 18px;">✕</button>
                </div>
                <div style="font-size: 13px; color: #8696a0; margin-bottom: 12px;">Masukkan nomor HP tujuan (contoh: 08123456789 atau 62812...):</div>
                <input id="waweb-direct-phone" type="text" placeholder="08xxxxxxxxxx" style="width: 100%; box-sizing: border-box; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 12px; color: #e9edef; font-size: 14px; outline: none; margin-bottom: 12px;">
                <textarea id="waweb-direct-msg" placeholder="Pesan pembuka (opsional)..." rows="2" style="width: 100%; box-sizing: border-box; background: #202c33; border: 1px solid #2a3942; border-radius: 8px; padding: 10px; color: #e9edef; font-size: 13px; outline: none; margin-bottom: 16px; resize: none;"></textarea>
                <div style="display: flex; gap: 10px;">
                    <button id="waweb-direct-btn" style="flex: 1; background: #00a884; color: white; border: none; border-radius: 8px; padding: 12px; font-weight: 600; cursor: pointer; font-size: 14px;">Buka Obrolan</button>
                    <button id="waweb-direct-cancel" style="background: #202c33; color: #8696a0; border: none; border-radius: 8px; padding: 12px 18px; font-weight: 500; cursor: pointer;">Batal</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const inputPhone = modal.querySelector('#waweb-direct-phone');
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

            const msg = modal.querySelector('#waweb-direct-msg').value.trim();
            modal.remove();

            showToast("Membuka Chat", `Menghubungkan ke +${raw}...`);

            // Use hidden link click to navigate without full page reload
            const link = document.createElement('a');
            link.href = `https://web.whatsapp.com/send?phone=${raw}${msg ? '&text=' + encodeURIComponent(msg) : ''}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }

        modal.querySelector('#waweb-direct-btn').onclick = executeDirectChat;
        modal.querySelector('#waweb-direct-close').onclick = () => modal.remove();
        modal.querySelector('#waweb-direct-cancel').onclick = () => modal.remove();

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
       MOD 3: STATUS / STORY SAVER (Unduh Story Teman 1-Klik)
       ========================================================================== */
    function injectStatusDownloader() {
        // Status viewer overlay check
        const statusPanel = document.querySelector('div[role="region"][tabindex="-1"], div[data-animate-modal-body="true"]');
        if (statusPanel && !statusPanel.querySelector('#waweb-status-download-btn')) {
            const media = statusPanel.querySelector('img[src], video[src]');
            if (media && media.src) {
                const btn = document.createElement('button');
                btn.id = 'waweb-status-download-btn';
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
                    const filename = `WA_Story_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;
                    triggerDownload(src, filename);
                };
                statusPanel.appendChild(btn);
            }
        }
    }

    /* ==========================================================================
       MOD 4: HIDE "SEDANG MENGETIK..." (Ghost Typing Presence)
       ========================================================================== */
    let ghostTypingActive = true;
    window.__waweb_toggleGhostTyping = function() {
        ghostTypingActive = !ghostTypingActive;
        showToast(
            ghostTypingActive ? "👻 Ghost Typing Aktif" : "Typing Normal",
            ghostTypingActive ? "Status 'Sedang mengetik...' disembunyikan" : "Status 'Sedang mengetik...' terlihat lawan bicara"
        );
    };

    // Suppress typing trigger events from propagating presence signals
    document.addEventListener('input', function(e) {
        if (ghostTypingActive && e.target && e.target.getAttribute('contenteditable') === 'true') {
            // Prevent WhatsApp presence pulse dispatcher
            e.stopImmediatePropagation ? e.stopImmediatePropagation() : null;
        }
    }, true);

    /* ==========================================================================
       MOD 5: ANTI-DELETE MESSAGES (Pesan Ditarik Tetap Terlihat)
       ========================================================================== */
    const messageStore = new Map();

    function watchAndPreserveMessages() {
        // Cache visible message bubbles
        const chatBubbles = document.querySelectorAll('div[data-id], div.message-in, div.message-out');
        chatBubbles.forEach(bubble => {
            const id = bubble.getAttribute('data-id') || bubble.id;
            if (!id) return;

            const textEl = bubble.querySelector('.selectable-text');
            if (textEl && textEl.innerText && !textEl.innerText.includes('Pesan ini telah dihapus') && !textEl.innerText.includes('This message was deleted')) {
                if (!messageStore.has(id)) {
                    messageStore.set(id, {
                        text: textEl.innerText,
                        html: textEl.innerHTML,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });
                }
            }

            // Check if WhatsApp replaced this message with deleted placeholder
            const isDeleted = bubble.querySelector('span[data-icon="recalled"]') ||
                              (bubble.innerText && (bubble.innerText.includes('Pesan ini telah dihapus') || bubble.innerText.includes('This message was deleted')));

            if (isDeleted && !bubble.querySelector('.waweb-antidelete-preserved')) {
                const cached = messageStore.get(id);
                if (cached) {
                    const restoredBox = document.createElement('div');
                    restoredBox.className = 'waweb-antidelete-preserved';
                    restoredBox.style.cssText = [
                        'margin-top: 6px',
                        'padding: 8px 10px',
                        'background: rgba(255, 82, 82, 0.12)',
                        'border-left: 3px solid #ff5252',
                        'border-radius: 6px',
                        'font-size: 13px',
                        'color: #e9edef'
                    ].join(';');
                    restoredBox.innerHTML = `
                        <div style="color: #ff5252; font-size: 11px; font-weight: 600; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
                            <span>🚫 PESAN DITARIK PENGIRIM (${cached.time})</span>
                        </div>
                        <div style="font-style: italic; color: #ffffff;">${cached.text}</div>
                    `;
                    bubble.appendChild(restoredBox);
                }
            }
        });
    }

    /* ==========================================================================
       MOD 6: ULTRA DARK OLED MODE (Pure Black #000000)
       ========================================================================== */
    let oledActive = localStorage.getItem('waweb_oled_mode') === 'true';
    let oledStyle = null;

    function applyOledStyles() {
        if (!oledStyle) {
            oledStyle = document.createElement('style');
            oledStyle.id = 'waweb-oled-style';
            oledStyle.textContent = `
                /* Pure Black OLED Theme */
                body, #app, #app > div, #main, #pane-side,
                [data-testid="chat-list"],
                header, footer,
                [data-testid="conversation-panel-wrapper"],
                div[style*="background-color: rgb(17, 27, 33)"],
                div[style*="background-color: rgb(32, 44, 51)"] {
                    background-color: #000000 !important;
                    background: #000000 !important;
                }
                /* Chat bubble deep black styling */
                .message-in {
                    background-color: #0d1418 !important;
                    border: 1px solid #1a2329 !important;
                }
                .message-out {
                    background-color: #004436 !important;
                }
                /* Search bars and inputs */
                [data-testid="chat-list-search"],
                div[role="textbox"] {
                    background-color: #0d0d0d !important;
                    border-color: #222222 !important;
                }
                /* Borders */
                div, header, footer {
                    border-color: #161616 !important;
                }
            `;
            document.head.appendChild(oledStyle);
        }
    }

    window.__waweb_toggleOled = function() {
        oledActive = !oledActive;
        localStorage.setItem('waweb_oled_mode', oledActive ? 'true' : 'false');
        if (oledActive) {
            applyOledStyles();
            showToast("🖤 Ultra Dark OLED", "Mode hitam pekat hemat daya aktif");
        } else {
            if (oledStyle) {
                oledStyle.remove();
                oledStyle = null;
            }
            showToast("Ultra Dark Nonaktif", "Kembali ke tema gelap standar");
        }
    };

    if (oledActive) {
        applyOledStyles();
    }

    /* ==========================================================================
       PRIVACY MODE (Anti-Intip / Blur Chat - Ctrl+B)
       ========================================================================== */
    let privacyActive = false;
    let privacyStyle = null;

    window.__waweb_togglePrivacy = function() {
        privacyActive = !privacyActive;
        if (privacyActive) {
            if (!privacyStyle) {
                privacyStyle = document.createElement('style');
                privacyStyle.id = 'waweb-privacy-style';
                privacyStyle.textContent = `
                    #main [data-testid="conversation-panel-body"] span,
                    #main [data-testid="cell-frame-container"] span,
                    #main img, #main video,
                    #pane-side span[title] {
                        filter: blur(6px) !important;
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
       DOWNLOAD HOOK FOR STANDARD ATTACHMENTS
       ========================================================================== */
    const origClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
        try {
            const hasDownload = this.hasAttribute('download');
            const isBlob = this.href && (this.href.startsWith('blob:') || this.href.startsWith('data:'));
            if (hasDownload || isBlob) {
                const name = this.getAttribute('download') || this.download || 'Media WhatsApp';
                showToast("Download Berhasil", `${name} tersimpan di Downloads`);
            }
        } catch (err) {}
        return origClick.apply(this, arguments);
    };

    /* ==========================================================================
       MOD 7: GHOST READ / ANTI-CENTANG BIRU (Hide Blue Ticks / Read Receipts)
       ========================================================================== */
    let ghostReadActive = localStorage.getItem('waweb_ghost_read') !== 'false'; // Default: Aktif

    const originalHasFocus = document.hasFocus.bind(document);
    document.hasFocus = function() {
        if (ghostReadActive) {
            return false;
        }
        return originalHasFocus();
    };

    try {
        Object.defineProperty(document, 'visibilityState', {
            get: function() {
                return ghostReadActive ? 'hidden' : 'visible';
            },
            configurable: true
        });
        Object.defineProperty(document, 'hidden', {
            get: function() {
                return ghostReadActive ? true : false;
            },
            configurable: true
        });
    } catch(e) {}

    // Block focus events that trigger read receipts
    window.addEventListener('focus', function(e) {
        if (ghostReadActive) {
            e.stopImmediatePropagation();
        }
    }, true);

    window.__waweb_toggleGhostRead = function() {
        ghostReadActive = !ghostReadActive;
        localStorage.setItem('waweb_ghost_read', ghostReadActive ? 'true' : 'false');
        if (ghostReadActive) {
            showToast(
                "👻 Anti-Centang Biru Aktif",
                "Bebas baca chat tanpa memicu centang biru di pengirim!",
                null,
                "#00d2ff"
            );
        } else {
            showToast(
                "Centang Biru Normal",
                "Status membaca dikirim seperti biasa",
                null,
                "#8696a0"
            );
        }
    };

    /* ==========================================================================
       GLOBAL KEYBOARD SHORTCUTS
       ========================================================================== */
    window.addEventListener('keydown', function(e) {
        // F5 / Ctrl+R: Reload
        if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
            window.location.reload();
        }
        // Ctrl+M: Direct Chat (Kirim Pesan Tanpa Simpan Nomor)
        if (e.ctrlKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            window.__waweb_openDirectChatModal();
        }
        // Ctrl+B: Privacy Mode
        if (e.ctrlKey && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            window.__waweb_togglePrivacy();
        }
        // Ctrl+Shift+O: Ultra Dark OLED Mode
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'o') {
            e.preventDefault();
            window.__waweb_toggleOled();
        }
        // Ctrl+Shift+T: Ghost Typing Toggle
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
            e.preventDefault();
            window.__waweb_toggleGhostTyping();
        }
        // Ctrl+Shift+G: Ghost Read (Anti-Centang Biru) Toggle
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'g') {
            e.preventDefault();
            window.__waweb_toggleGhostRead();
        }
    });

    /* ==========================================================================
       CONTINUOUS DOM OBSERVER (Anti-Delete, Status Saver, View Once)
       ========================================================================== */
    setInterval(() => {
        try {
            injectViewOnceDownloader();
            injectStatusDownloader();
            watchAndPreserveMessages();
        } catch (err) {}
    }, 1200);

    // Request native desktop notification permission
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
})();
