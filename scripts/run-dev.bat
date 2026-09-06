@echo off
setlocal
echo [ModsTams] Memulai Development Server...
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
cd /d "%~dp0.."
npm run dev
endlocal
