//! Window lifecycle and webview management for ModsTams.

use crate::memory;
use tauri::{WebviewWindow, WebviewWindowBuilder, WindowEvent};

/// Injected suite script embedded at compile time from assets.
const ENHANCEMENT_SCRIPT: &str = include_str!("../assets/enhancements.js");

/// Focuses and restores the main window if hidden or minimized.
pub fn focus_window(window: &WebviewWindow) {
    let _ = window.show();
    let _ = window.unminimize();
    let _ = window.set_focus();
}

/// Initializes the primary WebviewWindow with custom configuration and injected scripts.
pub fn create_main_window(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    if let Some(window_config) = app.config().app.windows.first() {
        let window = WebviewWindowBuilder::from_config(app.handle(), window_config)?
            .initialization_script(ENHANCEMENT_SCRIPT)
            .build()?;
        focus_window(&window);
    }
    Ok(())
}

/// Intercepts window events, such as close requests, routing them to minimize-to-tray.
pub fn handle_window_event(window: &tauri::Window, event: &WindowEvent) {
    if let WindowEvent::CloseRequested { api, .. } = event {
        api.prevent_close();
        let _ = window.hide();
        memory::trim_working_set();
    }
}
