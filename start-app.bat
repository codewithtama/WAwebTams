@echo off
if exist "%~dp0ModsTams.exe" (
    echo Membuka ModsTams Standalone...
    start "" "%~dp0ModsTams.exe"
) else if exist "%USERPROFILE%\.cargo-target\waweb-tams\release\ModsTams.exe" (
    echo Membuka ModsTams...
    start "" "%USERPROFILE%\.cargo-target\waweb-tams\release\ModsTams.exe"
) else (
    echo Menjalankan dev server...
    call "%~dp0run-dev.bat"
)
