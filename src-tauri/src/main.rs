//! ModsTams Executable Entry Point.
//!
//! Applies platform-appropriate memory-saving and runtime flags, then launches
//! the core application orchestrator.

// On Windows non-debug builds, suppress the console window.
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    configure_runtime();
    waweb_tams_lib::run();
}

/// Applies platform-specific runtime tuning flags before the WebView engine starts.
fn configure_runtime() {
    #[cfg(target_os = "windows")]
    {
        // WebView2 (msedgewebview2.exe) accepts Chromium CLI flags via this env var.
        // Restricts heap, disables telemetry, caps disk/media caches to 32MB each.
        std::env::set_var(
            "WEBVIEW2_ADDITIONAL_BROWSER_ARGS",
            "--enable-low-end-device-mode \
             --js-flags=\"--max-old-space-size=256 --optimize-for-size\" \
             --disk-cache-size=33554432 \
             --media-cache-size=33554432 \
             --disable-gpu-shader-disk-cache \
             --disable-background-networking \
             --disable-domain-reliability \
             --disable-component-update \
             --disable-speech-api \
             --disable-speech-synthesis-api \
             --enable-gpu-rasterization \
             --enable-zero-copy \
             --disable-features=Translate,OptimizationHints,AutofillServerCommunication,MediaRouter",
        );
    }

    #[cfg(target_os = "linux")]
    {
        // WebKitGTK on some compositors has issues with hardware acceleration;
        // force software rendering if WEBKIT_DISABLE_COMPOSITING_MODE is not already set.
        if std::env::var("WEBKIT_DISABLE_COMPOSITING_MODE").is_err() {
            std::env::set_var("WEBKIT_DISABLE_COMPOSITING_MODE", "1");
        }
        // Reduce glibc malloc arena fragmentation to keep RSS low on long-running sessions.
        if std::env::var("MALLOC_ARENA_MAX").is_err() {
            std::env::set_var("MALLOC_ARENA_MAX", "2");
        }
    }
}
