@echo off
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
set "CARGO_TARGET_DIR=%USERPROFILE%\.cargo-target\waweb-tams"
echo Mengompilasi WhatsApp Web Ultra-Light (Standalone EXE)...
npm run build
pause
