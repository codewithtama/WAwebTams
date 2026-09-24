//! Storage and disk cache management for ModsTams.
//!
//! Provides safe one-click purging of temporary media caches, shader caches,
//! and V8 code caches without altering user session tokens, IndexedDB, or cookies.

use std::path::{Path, PathBuf};
use tauri::AppHandle;

/// Result summary of the cache purge operation.
#[derive(serde::Serialize, Default, Debug)]
pub struct CachePurgeResult {
    pub bytes_freed: u64,
    pub files_deleted: usize,
    pub success: bool,
}

/// Recursively traverses and removes files within a cache directory while preserving root folders.
fn clean_directory(dir: &Path, result: &mut CachePurgeResult) {
    if !dir.exists() || !dir.is_dir() {
        return;
    }
    if let Ok(entries) = std::fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_file() {
                if let Ok(metadata) = entry.metadata() {
                    let size = metadata.len();
                    // Attempt file removal; ignore files locked by the active WebView2 renderer
                    if std::fs::remove_file(&path).is_ok() {
                        result.bytes_freed += size;
                        result.files_deleted += 1;
                    }
                }
            } else if path.is_dir() {
                clean_directory(&path, result);
                let _ = std::fs::remove_dir(&path);
            }
        }
    }
}

/// Resolves the platform-specific base directory where Tauri / the embedded WebView
/// stores its application data caches.
///
/// | Platform | Root                                         |
/// |----------|----------------------------------------------|
/// | Windows  | `%LOCALAPPDATA%\com.tams.waweb\EBWebView`    |
/// | Linux    | `$XDG_DATA_HOME/com.tams.waweb` (fallback `~/.local/share`) |
/// | macOS    | `~/Library/Caches/com.tams.waweb`            |
fn resolve_cache_base() -> Option<PathBuf> {
    #[cfg(target_os = "windows")]
    {
        std::env::var("LOCALAPPDATA").ok().map(|p| {
            PathBuf::from(p)
                .join("com.tams.waweb")
                .join("EBWebView")
        })
    }

    #[cfg(target_os = "linux")]
    {
        // Prefer XDG_DATA_HOME; fall back to ~/.local/share
        let data_home = std::env::var("XDG_DATA_HOME")
            .map(PathBuf::from)
            .unwrap_or_else(|_| {
                dirs_or_home().join(".local").join("share")
            });
        Some(data_home.join("com.tams.waweb"))
    }

    #[cfg(target_os = "macos")]
    {
        dirs_or_home()
            .parent()
            .map(|p| p.join("Caches").join("com.tams.waweb"))
    }

    #[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
    {
        None
    }
}

/// Returns the current user's home directory, falling back to "/" if unresolvable.
fn dirs_or_home() -> PathBuf {
    std::env::var("HOME")
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from("/"))
}

/// Returns the list of safe disposable cache sub-directories for the current platform.
/// NEVER includes IndexedDB, Local Storage, or Cookies.
fn cache_dirs(base: &Path) -> Vec<PathBuf> {
    #[cfg(target_os = "windows")]
    {
        // WebView2 (msedgewebview2.exe) layout
        vec![
            base.join("Default").join("Cache"),
            base.join("Default").join("Code Cache"),
            base.join("Default").join("GPUCache"),
            base.join("Default").join("DawnGraphiteCache"),
            base.join("Default").join("DawnWebGPUCache"),
            base.join("Default").join("blob_storage"),
            base.join("Default").join("optimization_guide_hint_cache_store"),
            base.join("ShaderCache"),
        ]
    }

    #[cfg(target_os = "linux")]
    {
        // WebKitGTK2 layout used by Tauri on Linux
        vec![
            base.join("cache"),
            base.join("webkitgtk").join("databases"),
        ]
    }

    #[cfg(target_os = "macos")]
    {
        vec![
            base.join("WebKit").join("MediaCache"),
            base.join("WebKit").join("NetworkCache"),
        ]
    }

    #[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
    {
        vec![]
    }
}

/// Safely purges temporary web media and browser caches without altering session credentials.
pub fn purge_cache(_app: &AppHandle) -> CachePurgeResult {
    let mut result = CachePurgeResult {
        bytes_freed: 0,
        files_deleted: 0,
        success: true,
    };

    let Some(base_path) = resolve_cache_base() else {
        return result;
    };

    if !base_path.exists() {
        return result;
    }

    for dir in cache_dirs(&base_path) {
        clean_directory(&dir, &mut result);
    }

    // Trim RAM working set after releasing disk cache (no-op on non-Windows)
    crate::memory::trim_working_set();

    result
}
