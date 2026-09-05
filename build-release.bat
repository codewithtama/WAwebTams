@echo off
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
echo Mengompilasi WhatsApp Web Ultra-Light (Standalone EXE)...
npm run build
pause
