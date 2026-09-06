//! ModsTams Executable Entry Point.
//!
//! Applies aggressive memory-saving flags to the Microsoft Edge WebView2 runtime
//! and launches the core application orchestrator.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Configure WebView2 Chromium runtime for ultra-low memory footprint:
    // - Restricts V8 JavaScript heap to 256MB
    // - Enables low-end device optimizations
    // - Caps disk and media caches to 32MB each
    // - Disables superfluous background browser telemetry & features
    std::env::set_var(
        "WEBVIEW2_ADDITIONAL_BROWSER_ARGS",
        "--enable-low-end-device-mode \
         --js-flags=\"--max-old-space-size=256 --optimize-for-size\" \
         --disk-cache-size=33554432 \
         --media-cache-size=33554432 \
         --disable-gpu-shader-disk-cache \
         --disable-features=Translate,OptimizationHints",
    );

    waweb_tams_lib::run();
}
