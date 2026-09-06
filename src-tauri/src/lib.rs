//! WAwebTams Core Application Library.
//!
//! Orchestrates single-instance enforcement, window lifecycle management,
//! native memory optimization, and system tray integration.

pub mod memory;
pub mod tray;
pub mod window;

use tauri::Manager;

/// Entry point for running the Tauri application.
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(main_window) = app.get_webview_window("main") {
                window::focus_window(&main_window);
            }
        }))
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
