use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, WebviewWindowBuilder, WindowEvent,
};

const ENHANCEMENT_SCRIPT: &str = include_str!("enhancements.js");

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .setup(|app| {
            // Build main window with initialization script
            if let Some(window_config) = app.config().app.windows.first() {
                let _window = WebviewWindowBuilder::from_config(app.handle(), window_config)?
                    .initialization_script(ENHANCEMENT_SCRIPT)
                    .build()?;
            }

            // Menu System Tray
            let show_item = MenuItem::with_id(
                app,
                "show",
                "Tampilkan ModsTams",
                true,
                None::<&str>,
            )?;
            let hide_item = MenuItem::with_id(
                app,
                "hide",
                "Sembunyikan ke Tray",
                true,
                None::<&str>,
            )?;
            let sep1 = PredefinedMenuItem::separator(app)?;

            let direct_item = MenuItem::with_id(
                app,
                "direct",
                "🚀 Chat Nomor Baru (Ctrl+M)",
                true,
                None::<&str>,
            )?;
            let privacy_item = MenuItem::with_id(
                app,
                "privacy",
                "🛡️ Toggle Privacy Mode (Ctrl+B)",
                true,
                None::<&str>,
            )?;
            let oled_item = MenuItem::with_id(
                app,
                "oled",
                "🖤 Toggle Ultra Dark OLED",
                true,
                None::<&str>,
            )?;
            let ghost_item = MenuItem::with_id(
                app,
                "ghost",
                "👻 Toggle Ghost Typing",
                true,
                None::<&str>,
            )?;
            let ghostread_item = MenuItem::with_id(
                app,
                "ghostread",
                "👁️ Toggle Anti-Centang Biru",
                true,
                None::<&str>,
            )?;

            let sep2 = PredefinedMenuItem::separator(app)?;
            let reload_item = MenuItem::with_id(
                app,
                "reload",
                "Muat Ulang (Reload)",
                true,
                None::<&str>,
            )?;
            let sep3 = PredefinedMenuItem::separator(app)?;
            let quit_item = MenuItem::with_id(
                app,
                "quit",
                "Keluar Sepenuhnya",
                true,
                None::<&str>,
            )?;

            let menu = Menu::with_items(
                app,
                &[
                    &show_item,
                    &hide_item,
                    &sep1,
                    &direct_item,
                    &privacy_item,
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
                    .on_menu_event(|app, event| match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                            }
                        }
                        "hide" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.hide();
                            }
                        }
                        "direct" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                                let _ = window.eval(
                                    "window.__waweb_openDirectChatModal && window.__waweb_openDirectChatModal()",
                                );
                            }
                        }
                        "privacy" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.eval(
                                    "window.__waweb_togglePrivacy && window.__waweb_togglePrivacy()",
                                );
                            }
                        }
                        "oled" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.eval(
                                    "window.__waweb_toggleOled && window.__waweb_toggleOled()",
                                );
                            }
                        }
                        "ghost" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.eval(
                                    "window.__waweb_toggleGhostTyping && window.__waweb_toggleGhostTyping()",
                                );
                            }
                        }
                        "ghostread" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.eval(
                                    "window.__waweb_toggleGhostRead && window.__waweb_toggleGhostRead()",
                                );
                            }
                        }
                        "reload" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.eval("window.location.reload()");
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    })
                    .on_tray_icon_event(|tray, event| {
                        if let TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } = event
                        {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                if window.is_visible().unwrap_or(false) {
                                    let _ = window.hide();
                                } else {
                                    let _ = window.show();
                                    let _ = window.unminimize();
                                    let _ = window.set_focus();
                                }
                            }
                        }
                    })
                    .build(app)?;
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                // Intercept tombol Close (X) -> minimize ke System Tray
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
