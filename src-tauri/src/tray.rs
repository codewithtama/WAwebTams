//! System Tray subsystem for ModsTams.
//!
//! Provides background system tray icon, context menu items for quick mod suite actions,
//! and click event dispatching.

use crate::window::focus_window;
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager,
};

/// Builds and registers the system tray icon and its context menu.
pub fn setup_tray(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let show_item = MenuItem::with_id(app, "show", "Open ModsTams", true, None::<&str>)?;
    let hide_item = MenuItem::with_id(app, "hide", "Hide to Tray", true, None::<&str>)?;
    let control_item = MenuItem::with_id(
        app,
        "control",
        "Preferences (Ctrl+Shift+M)",
        true,
        None::<&str>,
    )?;
    let lock_item = MenuItem::with_id(app, "lock", "Lock Workspace (Ctrl+L)", true, None::<&str>)?;
    let pin_item = MenuItem::with_id(app, "pin", "Pin Window (Ctrl+Shift+P)", true, None::<&str>)?;
    let sep1 = PredefinedMenuItem::separator(app)?;

    let direct_item = MenuItem::with_id(app, "direct", "Direct Chat (Ctrl+M)", true, None::<&str>)?;
    let privacy_item = MenuItem::with_id(
        app,
        "privacy",
        "Toggle Privacy Blur (Ctrl+B)",
        true,
        None::<&str>,
    )?;
    let blurmedia_item = MenuItem::with_id(
        app,
        "blurmedia",
        "Toggle Media Blur (Ctrl+Shift+B)",
        true,
        None::<&str>,
    )?;
    let unread_item = MenuItem::with_id(
        app,
        "unread",
        "Toggle Unread Filter (Ctrl+Shift+U)",
        true,
        None::<&str>,
    )?;
    let oled_item = MenuItem::with_id(
        app,
        "oled",
        "Toggle OLED Black (Ctrl+Shift+O)",
        true,
        None::<&str>,
    )?;
    let ghost_item = MenuItem::with_id(
        app,
        "ghost",
        "Toggle Ghost Typing (Ctrl+Shift+T)",
        true,
        None::<&str>,
    )?;
    let ghostread_item = MenuItem::with_id(
        app,
        "ghostread",
        "Toggle Ghost Read (Ctrl+Shift+G)",
        true,
        None::<&str>,
    )?;

    let sep2 = PredefinedMenuItem::separator(app)?;
    let reload_item = MenuItem::with_id(app, "reload", "Reload Window", true, None::<&str>)?;
    let sep3 = PredefinedMenuItem::separator(app)?;
    let quit_item = MenuItem::with_id(app, "quit", "Quit Application", true, None::<&str>)?;

    let menu = Menu::with_items(
        app,
        &[
            &show_item,
            &hide_item,
            &control_item,
            &lock_item,
            &pin_item,
            &sep1,
            &direct_item,
            &privacy_item,
            &blurmedia_item,
            &unread_item,
            &oled_item,
            &ghost_item,
            &ghostread_item,
            &sep2,
            &reload_item,
            &sep3,
            &quit_item,
        ],
    )?;

    if let Some(icon) = app.default_window_icon() {
        let _tray = TrayIconBuilder::with_id("modstams-tray")
            .icon(icon.clone())
            .tooltip("ModsTams (Ultra-Light)")
            .menu(&menu)
            .show_menu_on_left_click(false)
            .on_menu_event(|app, event| handle_menu_action(app, event.id.as_ref()))
            .on_tray_icon_event(|tray, event| {
                if let TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    ..
                } = event
                {
                    toggle_window_visibility(tray.app_handle());
                }
            })
            .build(app)?;
    }

    Ok(())
}

/// Dispatches tray menu item selection to appropriate window actions or injected scripts.
fn handle_menu_action(app: &AppHandle, action_id: &str) {
    let main_window = app.get_webview_window("main");

    match action_id {
        "show" => {
            if let Some(window) = main_window {
                focus_window(&window);
            }
        }
        "hide" => {
            if let Some(window) = main_window {
                let _ = window.hide();
            }
        }
        "control" => {
            if let Some(window) = main_window {
                focus_window(&window);
                let _ = window
                    .eval("window.__waweb_toggleModCenter && window.__waweb_toggleModCenter()");
            }
        }
        "lock" => {
            if let Some(window) = main_window {
                focus_window(&window);
                let _ = window.eval("window.__modstams_lockApp && window.__modstams_lockApp()");
            }
        }
        "pin" => {
            if let Some(window) = main_window {
                if let Ok(current) = window.is_always_on_top() {
                    let next = !current;
                    let _ = window.set_always_on_top(next);
                    let js = format!(
                        "window.__modstams_onPinToggled && window.__modstams_onPinToggled({})",
                        next
                    );
                    let _ = window.eval(&js);
                }
            }
        }
        "direct" => {
            if let Some(window) = main_window {
                focus_window(&window);
                let _ = window.eval(
                    "window.__waweb_openDirectChatModal && window.__waweb_openDirectChatModal()",
                );
            }
        }
        "privacy" => {
            if let Some(window) = main_window {
                let _ =
                    window.eval("window.__waweb_togglePrivacy && window.__waweb_togglePrivacy()");
            }
        }
        "blurmedia" => {
            if let Some(window) = main_window {
                let _ = window.eval(
                    "window.__modstams_toggleBlurMedia && window.__modstams_toggleBlurMedia()",
                );
            }
        }
        "unread" => {
            if let Some(window) = main_window {
                let _ = window.eval("window.__modstams_toggleUnreadFilter && window.__modstams_toggleUnreadFilter()");
            }
        }
        "oled" => {
            if let Some(window) = main_window {
                let _ = window.eval("window.__waweb_toggleOled && window.__waweb_toggleOled()");
            }
        }
        "ghost" => {
            if let Some(window) = main_window {
                let _ = window
                    .eval("window.__waweb_toggleGhostTyping && window.__waweb_toggleGhostTyping()");
            }
        }
        "ghostread" => {
            if let Some(window) = main_window {
                let _ = window
                    .eval("window.__waweb_toggleGhostRead && window.__waweb_toggleGhostRead()");
            }
        }
        "reload" => {
            if let Some(window) = main_window {
                let _ = window.eval("window.location.reload()");
            }
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}

/// Toggles the main window between visible/focused and hidden.
fn toggle_window_visibility(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            focus_window(&window);
        }
    }
}
