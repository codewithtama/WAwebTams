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

/// Safely purges temporary web media and browser caches without altering session credentials.
pub fn purge_cache(_app: &AppHandle) -> CachePurgeResult {
    let mut result = CachePurgeResult {
        bytes_freed: 0,
        files_deleted: 0,
        success: true,
    };

    let base_path = match std::env::var("LOCALAPPDATA") {
        Ok(local_app_data) => PathBuf::from(local_app_data)
            .join("com.tams.waweb")
            .join("EBWebView"),
        Err(_) => return result,
    };

    if !base_path.exists() {
        return result;
    }

    // Explicit whitelist of safe disposable cache directories
    // NEVER includes IndexedDB, Local Storage, or Network (Cookies)
    let cache_dirs = [
        base_path.join("Default").join("Cache"),
        base_path.join("Default").join("Code Cache"),
        base_path.join("Default").join("GPUCache"),
        base_path.join("Default").join("DawnGraphiteCache"),
        base_path.join("Default").join("DawnWebGPUCache"),
        base_path.join("Default").join("blob_storage"),
        base_path
            .join("Default")
            .join("optimization_guide_hint_cache_store"),
        base_path.join("ShaderCache"),
    ];

    for cache_dir in &cache_dirs {
        clean_directory(cache_dir, &mut result);
    }

    // Trim RAM working set after releasing disk cache
    crate::memory::trim_working_set();

    result
}
