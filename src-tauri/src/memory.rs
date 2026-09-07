//! Memory management subsystem for ModsTams.
//!
//! Provides background working set trimming via native Windows API
//! for both the host process and all child WebView2 runtime processes.

use std::time::Duration;

/// Trims the working set of the current process and all descendant WebView2 child processes
/// to release unreferenced physical memory back to the OS.
#[cfg(target_os = "windows")]
pub fn trim_working_set() {
    extern "system" {
        fn GetCurrentProcess() -> isize;
        fn GetCurrentProcessId() -> u32;
        fn SetProcessWorkingSetSize(
            h_process: isize,
            dw_minimum_working_set_size: usize,
            dw_maximum_working_set_size: usize,
        ) -> i32;
        fn CreateToolhelp32Snapshot(dw_flags: u32, th32_process_id: u32) -> isize;
        fn Process32FirstW(h_snapshot: isize, lppe: *mut ProcessEntry32W) -> i32;
        fn Process32NextW(h_snapshot: isize, lppe: *mut ProcessEntry32W) -> i32;
        fn OpenProcess(dw_desired_access: u32, b_inherit_handle: i32, dw_process_id: u32) -> isize;
        fn CloseHandle(h_object: isize) -> i32;
    }

    #[repr(C)]
    struct ProcessEntry32W {
        dw_size: u32,
        cnt_usage: u32,
        th32_process_id: u32,
        th32_default_heap_id: usize,
        th32_module_id: u32,
        cnt_threads: u32,
        th32_parent_process_id: u32,
        pc_pri_class_base: i32,
        dw_flags: u32,
        sz_exe_file: [u16; 260],
    }

    const TH32CS_SNAPPROCESS: u32 = 0x00000002;
    const PROCESS_SET_QUOTA: u32 = 0x0100;
    const PROCESS_QUERY_INFORMATION: u32 = 0x0400;

    unsafe {
        // 1. Trim host application process
        let host_handle = GetCurrentProcess();
        SetProcessWorkingSetSize(host_handle, usize::MAX, usize::MAX);

        // 2. Snapshot system processes to identify all WebView2 child and grandchild processes
        let current_pid = GetCurrentProcessId();
        let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if snapshot != -1 && snapshot != 0 {
            let mut entry = ProcessEntry32W {
                dw_size: std::mem::size_of::<ProcessEntry32W>() as u32,
                cnt_usage: 0,
                th32_process_id: 0,
                th32_default_heap_id: 0,
                th32_module_id: 0,
                cnt_threads: 0,
                th32_parent_process_id: 0,
                pc_pri_class_base: 0,
                dw_flags: 0,
                sz_exe_file: [0; 260],
            };

            let mut proc_list = Vec::with_capacity(256);
            if Process32FirstW(snapshot, &mut entry) != 0 {
                loop {
                    proc_list.push((entry.th32_process_id, entry.th32_parent_process_id));
                    if Process32NextW(snapshot, &mut entry) == 0 {
                        break;
                    }
                }
            }
            CloseHandle(snapshot);

            // Recursively collect all descendants of current_pid
            let mut descendants = Vec::new();
            let mut queue = vec![current_pid];

            while let Some(parent) = queue.pop() {
                for &(pid, ppid) in &proc_list {
                    if ppid == parent && !descendants.contains(&pid) {
                        descendants.push(pid);
                        queue.push(pid);
                    }
                }
            }

            // 3. Trim each descendant process (msedgewebview2.exe renderer, GPU, broker)
            for child_pid in descendants {
                let child_handle =
                    OpenProcess(PROCESS_SET_QUOTA | PROCESS_QUERY_INFORMATION, 0, child_pid);
                if child_handle != 0 && child_handle != -1 {
                    SetProcessWorkingSetSize(child_handle, usize::MAX, usize::MAX);
                    CloseHandle(child_handle);
                }
            }
        }
    }
}

/// No-op on non-Windows platforms.
#[cfg(not(target_os = "windows"))]
pub fn trim_working_set() {}

/// Spawns a background worker thread that trims the application working set every 60 seconds.
pub fn start_memory_cleaner() {
    #[cfg(target_os = "windows")]
    std::thread::spawn(|| loop {
        std::thread::sleep(Duration::from_secs(60));
        trim_working_set();
    });
}
