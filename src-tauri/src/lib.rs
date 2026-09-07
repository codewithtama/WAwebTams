//! WAwebTams Core Application Library.
//!
//! Orchestrates single-instance enforcement, window lifecycle management,
//! native memory optimization, storage cache controls, and system tray integration.

pub mod memory;
pub mod storage;
pub mod tray;
pub mod window;

use tauri::{AppHandle, Manager};

/// Toggles the always-on-top state of the main window.
#[tauri::command]
fn toggle_always_on_top(window: tauri::WebviewWindow) -> Result<bool, String> {
    let current = window.is_always_on_top().map_err(|e| e.to_string())?;
    let next = !current;
    window.set_always_on_top(next).map_err(|e| e.to_string())?;
    Ok(next)
}

/// Retrieves the current always-on-top state of the main window.
#[tauri::command]
fn is_always_on_top(window: tauri::WebviewWindow) -> Result<bool, String> {
    window.is_always_on_top().map_err(|e| e.to_string())
}

/// Safely purges temporary web media and browser caches without altering user session tokens.
#[tauri::command]
fn purge_media_cache(app: AppHandle) -> Result<storage::CachePurgeResult, String> {
    Ok(storage::purge_cache(&app))
}

/// Entry point for running the Tauri application.
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(main_window) = app.get_webview_window("main") {
                window::focus_window(&main_window);
            }
        }))
        .invoke_handler(tauri::generate_handler![
            toggle_always_on_top,
            is_always_on_top,
            purge_media_cache
        ])
        .setup(|app| {
            window::create_main_window(app)?;
            memory::start_memory_cleaner();
            tray::setup_tray(app)?;
            Ok(())
        })
        .on_window_event(window::handle_window_event)
        .run(tauri::generate_context!())
        .expect("Fatal error while running ModsTams application");
}
