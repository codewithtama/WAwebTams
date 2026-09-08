<#
.SYNOPSIS
    Enterprise Build & Release Automation Pipeline
.DESCRIPTION
    Builds the production-grade portable executable, calculates SHA-256 integrity hash,
    and reports binary metrics.
#>

[CmdletBinding()]
param(
    [switch]$SkipLint
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$cargoToml = Join-Path $projectRoot "src-tauri\Cargo.toml"
$targetExe = Join-Path $projectRoot "src-tauri\target\release\ModsTams.exe"
$distExe = Join-Path $projectRoot "ModsTams.exe"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "[ModsTams] Enterprise Build & Release Pipeline" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Verification of Injected Script Syntax
Write-Host "`n[1/5] Validating Injected JavaScript Syntax..." -ForegroundColor Yellow
$enhancementsJs = Join-Path $projectRoot "src-tauri\assets\enhancements.js"
& node --check $enhancementsJs
if ($LASTEXITCODE -ne 0) {
    Write-Error "JavaScript syntax check failed in $enhancementsJs"
}
Write-Host "  -> enhancements.js syntax is valid." -ForegroundColor Green

# 2. Rust Code Quality Checks
if (-not $SkipLint) {
    Write-Host "`n[2/5] Running Rustfmt & Clippy Linter..." -ForegroundColor Yellow
    & cargo fmt --manifest-path $cargoToml -- --check
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Code formatting check failed. Run 'cargo fmt --manifest-path $cargoToml' to fix."
    }
    & cargo clippy --manifest-path $cargoToml -- -D warnings
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Clippy linter found warnings/errors."
    }
    Write-Host "  -> Rust formatting and clippy passed cleanly." -ForegroundColor Green
} else {
    Write-Host "`n[2/5] Skipping Lint (--SkipLint specified)..." -ForegroundColor DarkGray
}

# 3. Terminate running instances
Write-Host "`n[3/5] Closing active ModsTams instances..." -ForegroundColor Yellow
Stop-Process -Name "ModsTams" -ErrorAction SilentlyContinue -Force
Start-Sleep -Milliseconds 500

# 4. Cargo Release Build
Write-Host "`n[4/5] Compiling Release Binary (opt-level=3, LTO=fat, strip=true)..." -ForegroundColor Yellow
$sw = [System.Diagnostics.Stopwatch]::StartNew()
& cargo build --manifest-path $cargoToml --release
if ($LASTEXITCODE -ne 0) {
    Write-Error "Cargo build failed."
}
$sw.Stop()
Write-Host "  -> Compilation completed in $($sw.Elapsed.TotalSeconds.ToString("F2")) seconds." -ForegroundColor Green

# 5. Package & Integrity Verification
Write-Host "`n[5/5] Deploying and Verifying Binary Integrity..." -ForegroundColor Yellow
if (Test-Path $targetExe) {
    Copy-Item -Path $targetExe -Destination $distExe -Force
    $fileInfo = Get-Item $distExe
    $fileSizeMB = ($fileInfo.Length / 1MB).ToString("F2")
    $sha256 = (Get-FileHash -Path $distExe -Algorithm SHA256).Hash

    Write-Host "`n===================================================" -ForegroundColor Green
    Write-Host "BUILD SUCCESSFUL" -ForegroundColor Green
    Write-Host "===================================================" -ForegroundColor Green
    Write-Host "  Binary Location : $distExe"
    Write-Host "  Binary Size     : $fileSizeMB MB ($($fileInfo.Length) bytes)"
    Write-Host "  SHA-256 Checksum: $sha256"
    Write-Host "===================================================" -ForegroundColor Green
} else {
    Write-Error "Release executable was not generated at $targetExe"
}
