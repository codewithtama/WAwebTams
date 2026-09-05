// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Ultra-Low Memory Chromium & V8 Profile for WebView2
    // Restricts JS heap to 256MB, enables low-end device mode, caps disk/media caches to 32MB
    std::env::set_var(
        "WEBVIEW2_ADDITIONAL_BROWSER_ARGS",
        "--enable-low-end-device-mode --js-flags=\"--max-old-space-size=256 --optimize-for-size\" --disk-cache-size=33554432 --media-cache-size=33554432 --disable-gpu-shader-disk-cache --disable-features=Translate,OptimizationHints"
    );

    waweb_tams_lib::run();
}
