use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, WindowEvent,
};

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
            // Menu System Tray
            let show_item = MenuItem::with_id(
                app,
                "show",
                "Tampilkan WhatsApp",
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
            let reload_item = MenuItem::with_id(
                app,
                "reload",
                "Muat Ulang (Reload)",
                true,
                None::<&str>,
            )?;
            let sep1 = PredefinedMenuItem::separator(app)?;
            let sep2 = PredefinedMenuItem::separator(app)?;
            let quit_item = MenuItem::with_id(
                app,
                "quit",
                "Keluar Sepenuhnya",
                true,
                None::<&str>,
            )?;

            let menu = Menu::with_items(
                app,
                &[&show_item, &hide_item, &sep1, &reload_item, &sep2, &quit_item],
            )?;

            if let Some(icon) = app.default_window_icon() {
                let _tray = TrayIconBuilder::with_id("waweb-tray")
                    .icon(icon.clone())
                    .tooltip("WhatsApp Web (Ultra-Light)")
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

            // Injeksi skrip klien: shortcut keyboard tambahan & observer
            if let Some(window) = app.get_webview_window("main") {
                let init_script = r#"
                    (function() {
                        // Shortcut F5 / Ctrl+R untuk reload
                        window.addEventListener('keydown', function(e) {
                            if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
                                window.location.reload();
                            }
                        });
                        console.log("[WAwebTams] Ultra-light WhatsApp Web wrapper active.");
                    })();
                "#;
                let _ = window.eval(init_script);
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
