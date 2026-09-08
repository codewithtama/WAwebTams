@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo [ModsTams] Enterprise Clean Pipeline
echo ===================================================

for %%I in ("%~dp0..") do set "PROJECT_ROOT=%%~fI"

echo [1/3] Menutup instance ModsTams yang sedang aktif...
taskkill /f /im ModsTams.exe >nul 2>&1

echo [2/3] Membersihkan direktori target Cargo...
if exist "%PROJECT_ROOT%\src-tauri\target" (
    rmdir /s /q "%PROJECT_ROOT%\src-tauri\target"
    echo Cargo target directory removed.
)

echo [3/3] Membersihkan file sementara dan cache...
del /f /q "%PROJECT_ROOT%\*.log" >nul 2>&1
del /f /q "%PROJECT_ROOT%\*.tmp" >nul 2>&1

echo ===================================================
echo [SUKSES] Lingkungan kerja berhasil dibersihkan!
echo ===================================================
endlocal
