@echo off
if exist "%USERPROFILE%\.cargo-target\waweb-tams\debug\waweb-tams.exe" (
    echo Membuka WhatsApp Web Ultra-Light...
    start "" "%USERPROFILE%\.cargo-target\waweb-tams\debug\waweb-tams.exe"
) else (
    echo Biner belum tersedia, menjalankan dev server...
    call "%~dp0run-dev.bat"
)
