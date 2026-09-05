@echo off
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
set "CARGO_TARGET_DIR=%USERPROFILE%\.cargo-target\waweb-tams"

taskkill /f /im ModsTams.exe >nul 2>&1

echo Menjalankan ModsTams (Dev Mode)...
npm run dev
