@echo off
setlocal
set "PROJECT_ROOT=%~dp0.."
set "EXE_PATH=%PROJECT_ROOT%\ModsTams.exe"

if not exist "%EXE_PATH%" (
    echo [INFO] ModsTams.exe belum dikompilasi. Memulai build release terlebih dahulu...
    call "%~dp0build-release.bat"
)

if exist "%EXE_PATH%" (
    echo [ModsTams] Meluncurkan aplikasi...
    start "" "%EXE_PATH%"
)
endlocal
