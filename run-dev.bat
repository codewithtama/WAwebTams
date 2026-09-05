@echo off
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
set "CARGO_TARGET_DIR=%USERPROFILE%\.cargo-target\waweb-tams"
echo Menjalankan WhatsApp Web Ultra-Light (Dev Mode)...
npm run dev
