//! Memory management subsystem for ModsTams.
//!
//! Provides background working set trimming via native Windows API
//! to keep RAM consumption at minimum footprint during idle and active usage.

use std::time::Duration;

/// Trims the working set of the current process to release unused physical memory.
#[cfg(target_os = "windows")]
pub fn trim_working_set() {
    extern "system" {
        fn GetCurrentProcess() -> isize;
        fn SetProcessWorkingSetSize(
            h_process: isize,
            dw_minimum_working_set_size: usize,
            dw_maximum_working_set_size: usize,
        ) -> i32;
    }
    // SAFETY: GetCurrentProcess returns a pseudo-handle for the current process.
    // Calling SetProcessWorkingSetSize with (MAX, MAX) asks Windows memory manager
    // to swap out unreferenced pages from the working set.
    unsafe {
        let handle = GetCurrentProcess();
        SetProcessWorkingSetSize(handle, usize::MAX, usize::MAX);
    }
}

/// No-op on non-Windows platforms.
#[cfg(not(target_os = "windows"))]
pub fn trim_working_set() {}

/// Spawns a background worker thread that trims the application working set every 3 minutes.
pub fn start_memory_cleaner() {
    #[cfg(target_os = "windows")]
    std::thread::spawn(|| loop {
        std::thread::sleep(Duration::from_secs(180));
        trim_working_set();
    });
}
