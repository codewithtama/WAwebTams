(function() {
    if (window.__waweb_initialized) return;
    window.__waweb_initialized = true;

    console.log("[WAwebTams] Enhancements script active.");

    // 1. Audio Chime Synthesizer via Web Audio API (Zero asset, lightweight)
    function playDownloadSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.1); // A5
            
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now);
            osc.stop(now + 0.3);
        } catch(e) {
            // AudioContext may need user interaction first
        }
    }

    // 2. Glassmorphic Toast Notification Container & Creator
    function getToastContainer() {
        let container = document.getElementById('waweb-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'waweb-toast-container';
            container.style.cssText = [
                'position: fixed',
                'bottom: 24px',
                'right: 24px',
                'z-index: 999999',
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

    function showDownloadToast(fileName) {
        let displayName = fileName || 'Media WhatsApp';
        if (displayName.length > 35) {
            displayName = displayName.substring(0, 32) + '...';
        }

        const container = getToastContainer();
        const toast = document.createElement('div');
        toast.style.cssText = [
            'pointer-events: auto',
            'display: flex',
            'align-items: center',
            'gap: 14px',
            'background: rgba(17, 27, 33, 0.94)',
            'color: #e9edef',
            'padding: 14px 18px',
            'border-radius: 12px',
            'border-left: 4px solid #00a884',
            'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.2)',
            'backdrop-filter: blur(16px)',
            'min-width: 280px',
            'max-width: 380px',
            'transform: translateY(20px)',
            'opacity: 0',
            'transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
        ].join(';');

        toast.innerHTML = `
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(0, 168, 132, 0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00a884" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            </div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 13px; color: #00a884; margin-bottom: 2px;">Download Berhasil</div>
                <div style="font-size: 13px; color: #e9edef; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${displayName}</div>
                <div style="font-size: 11px; color: #8696a0; margin-top: 2px;">Tersimpan di folder Downloads</div>
            </div>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        playDownloadSound();

        // Native Notification API if permitted
        try {
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Download Berhasil", {
                    body: displayName + " tersimpan di folder Downloads.",
                    icon: "https://web.whatsapp.com/favicon.ico"
                });
            }
        } catch(e) {}

        // Auto dismiss after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateY(15px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // 3. Intercept Media Downloads
    const origClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
        try {
            const hasDownload = this.hasAttribute('download');
            const isBlob = this.href && (this.href.startsWith('blob:') || this.href.startsWith('data:'));
            if (hasDownload || isBlob) {
                const name = this.getAttribute('download') || this.download || 'Media WhatsApp';
                showDownloadToast(name);
            }
        } catch (err) {
            console.error(err);
        }
        return origClick.apply(this, arguments);
    };

    // 4. Privacy Mode (Anti-Intip / Blur Chat)
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
            showTemporaryToast('🛡️ Privacy Mode Aktif (Arahkan kursor untuk melihat)');
        } else {
            if (privacyStyle) {
                privacyStyle.remove();
                privacyStyle = null;
            }
            showTemporaryToast('👁️ Privacy Mode Nonaktif');
        }
    };

    function showTemporaryToast(message) {
        const container = getToastContainer();
        const toast = document.createElement('div');
        toast.style.cssText = [
            'pointer-events: auto',
            'background: rgba(17, 27, 33, 0.94)',
            'color: #e9edef',
            'padding: 10px 16px',
            'border-radius: 10px',
            'border-left: 4px solid #00a884',
            'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4)',
            'backdrop-filter: blur(12px)',
            'font-size: 13px',
            'transform: translateY(15px)',
            'opacity: 0',
            'transition: all 0.25s ease'
        ].join(';');
        toast.textContent = message;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        setTimeout(() => {
            toast.style.transform = 'translateY(10px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 250);
        }, 2500);
    }

    // 5. Global Keyboard Shortcuts
    window.addEventListener('keydown', function(e) {
        // F5 or Ctrl+R: Reload
        if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
            window.location.reload();
        }
        // Ctrl+B: Toggle Privacy Mode
        if (e.ctrlKey && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            window.__waweb_togglePrivacy();
        }
    });

    // Request native notification permission if default
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }
})();
