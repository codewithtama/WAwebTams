use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, WebviewWindowBuilder, WindowEvent,
};

const ENHANCEMENT_SCRIPT: &str = include_str!("enhancements.js");

#[cfg(target_os = "windows")]
fn trim_working_set() {
    extern "system" {
        fn GetCurrentProcess() -> isize;
        fn SetProcessWorkingSetSize(
            hProcess: isize,
            dwMinimumWorkingSetSize: usize,
            dwMaximumWorkingSetSize: usize,
        ) -> i32;
    }
    unsafe {
        let handle = GetCurrentProcess();
        SetProcessWorkingSetSize(handle, usize::MAX, usize::MAX);
    }
}

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
                let window = WebviewWindowBuilder::from_config(app.handle(), window_config)?
                    .initialization_script(ENHANCEMENT_SCRIPT)
                    .build()?;
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }

            // Background memory cleaner thread: trims unused RAM every 3 minutes
            #[cfg(target_os = "windows")]
            std::thread::spawn(|| loop {
                std::thread::sleep(std::time::Duration::from_secs(180));
                trim_working_set();
            });

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
            let control_item = MenuItem::with_id(
                app,
                "control",
                "⚡ Buka ModsTams Control Center",
                true,
                None::<&str>,
            )?;
            let lock_item = MenuItem::with_id(
                app,
                "lock",
                "🔒 Kunci ModsTams (Ctrl+L)",
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
            let blurmedia_item = MenuItem::with_id(
                app,
                "blurmedia",
                "🖼️ Toggle Auto-Blur Media (Ctrl+Shift+B)",
                true,
                None::<&str>,
            )?;
            let unread_item = MenuItem::with_id(
                app,
                "unread",
                "🔔 Toggle Filter Unread (Ctrl+Shift+U)",
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
                    &control_item,
                    &lock_item,
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
                        "control" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                                let _ = window.eval(
                                    "window.__waweb_toggleModCenter && window.__waweb_toggleModCenter()",
                                );
                            }
                        }
                        "lock" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.unminimize();
                                let _ = window.set_focus();
                                let _ = window.eval(
                                    "window.__modstams_lockApp && window.__modstams_lockApp()",
                                );
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
                        "blurmedia" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.eval(
                                    "window.__modstams_toggleBlurMedia && window.__modstams_toggleBlurMedia()",
                                );
                            }
                        }
                        "unread" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.eval(
                                    "window.__modstams_toggleUnreadFilter && window.__modstams_toggleUnreadFilter()",
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
                #[cfg(target_os = "windows")]
                trim_working_set();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
