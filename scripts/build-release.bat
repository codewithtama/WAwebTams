@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo [ModsTams] Enterprise Release Build Pipeline
echo ===================================================

:: Ensure cargo is in PATH
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"

where cargo >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Rust toolchain (cargo) tidak ditemukan di PATH.
    echo Pastikan Rust telah terpasang melalui https://rustup.rs/
    pause
    exit /b 1
)

:: Project paths
set "PROJECT_ROOT=%~dp0.."
set "CARGO_TOML=%PROJECT_ROOT%\src-tauri\Cargo.toml"
set "OUTPUT_DIR=%PROJECT_ROOT%\src-tauri\target\release"

echo [1/3] Menutup instance ModsTams yang sedang aktif...
taskkill /f /im ModsTams.exe >nul 2>&1

echo [2/3] Mengompilasi binary release dengan profil produksi...
cargo build --manifest-path "%CARGO_TOML%" --release -j 2
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Kompilasi gagal! Silakan periksa log error di atas.
    pause
    exit /b %ERRORLEVEL%
)

echo [3/3] Menyalin binary executable ke root repositori...
if exist "%OUTPUT_DIR%\ModsTams.exe" (
    copy /y "%OUTPUT_DIR%\ModsTams.exe" "%PROJECT_ROOT%\ModsTams.exe" >nul
    echo.
    echo ===================================================
    echo [SUKSES] ModsTams.exe berhasil dibuat!
    echo Lokasi: %PROJECT_ROOT%\ModsTams.exe
    echo ===================================================
) else (
    echo [ERROR] Binary hasil kompilasi tidak ditemukan di "%OUTPUT_DIR%\ModsTams.exe".
    pause
    exit /b 1
)

endlocal
pause
