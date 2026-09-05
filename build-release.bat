@echo off
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
set "CARGO_TARGET_DIR=%USERPROFILE%\.cargo-target\waweb-tams"

echo Menutup instance ModsTams yang sedang berjalan...
taskkill /f /im ModsTams.exe >nul 2>&1

echo Mengompilasi ModsTams Release...
cargo build --manifest-path src-tauri/Cargo.toml --target-dir "%CARGO_TARGET_DIR%" --release -j 2

if exist "%CARGO_TARGET_DIR%\release\ModsTams.exe" (
    echo Menyalin binary ke folder utama...
    copy /y "%CARGO_TARGET_DIR%\release\ModsTams.exe" "%~dp0ModsTams.exe" >nul
    echo.
    echo ============================================
    echo [SUKSES] ModsTams.exe berhasil dikompilasi!
    echo ============================================
) else (
    echo.
    echo [ERROR] Kompilasi gagal. Silakan periksa pesan error di atas.
)

pause
