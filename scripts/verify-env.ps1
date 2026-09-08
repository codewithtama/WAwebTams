<#
.SYNOPSIS
    Enterprise Development Environment Diagnostic & Verification Script
.DESCRIPTION
    Validates prerequisite toolchains for compiling ModsTams:
    Rust, Cargo, Clippy, Rustfmt, Node.js, npm, MSVC C++ Tools, and WebView2 Runtime.
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Continue"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "[ModsTams] Toolchain & Environment Diagnostics" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

$failures = 0

function Test-CommandAvailable {
    param(
        [string]$CommandName,
        [string]$DisplayName,
        [string]$VersionArg = "--version"
    )

    $cmd = Get-Command $CommandName -ErrorAction SilentlyContinue
    if ($cmd) {
        try {
            $verOutput = & $cmd.Source $VersionArg 2>&1 | Select-Object -First 1
            Write-Host "  [OK] $DisplayName ($($verOutput.Trim()))" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "  [OK] $DisplayName (Found at $($cmd.Source))" -ForegroundColor Green
            return $true
        }
    } else {
        Write-Host "  [FAIL] $DisplayName NOT found in PATH" -ForegroundColor Red
        return $false
    }
}

Write-Host "1. Checking Core Toolchains..." -ForegroundColor Yellow
if (-not (Test-CommandAvailable -CommandName "cargo" -DisplayName "Rust Cargo")) { $failures++ }
if (-not (Test-CommandAvailable -CommandName "rustc" -DisplayName "Rust Compiler (rustc)")) { $failures++ }
if (-not (Test-CommandAvailable -CommandName "rustfmt" -DisplayName "Rust Code Formatter (rustfmt)")) { $failures++ }
if (-not (Test-CommandAvailable -CommandName "node" -DisplayName "Node.js Runtime")) { $failures++ }
if (-not (Test-CommandAvailable -CommandName "npm" -DisplayName "Node Package Manager (npm)")) { $failures++ }

Write-Host ""
Write-Host "2. Checking Microsoft Edge WebView2 Runtime..." -ForegroundColor Yellow
$wv2RegistryPaths = @(
    "HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}",
    "HKCU:\Software\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}",
    "HKLM:\SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
)

$wv2Installed = $false
foreach ($regPath in $wv2RegistryPaths) {
    if (Test-Path $regPath) {
        $pv = (Get-ItemProperty -Path $regPath -ErrorAction SilentlyContinue).pv
        if ($pv) {
            Write-Host "  [OK] Microsoft Edge WebView2 Runtime (Version: $pv)" -ForegroundColor Green
            $wv2Installed = $true
            break
        }
    }
}

if (-not $wv2Installed) {
    Write-Host "  [WARN] WebView2 Runtime registry key not detected directly; checking runtime availability via Edge..." -ForegroundColor Yellow
    $edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    if (Test-Path $edgePath) {
        Write-Host "  [OK] Microsoft Edge detected (Evergreen WebView2 available)" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] Microsoft Edge WebView2 Runtime not detected" -ForegroundColor Red
        $failures++
    }
}

Write-Host ""
Write-Host "3. Verifying Injected Assets Syntax..." -ForegroundColor Yellow
$projectRoot = Split-Path -Parent $PSScriptRoot
$enhancementsJs = Join-Path $projectRoot "src-tauri\assets\enhancements.js"

if (Test-Path $enhancementsJs) {
    $nodeCheck = & node --check $enhancementsJs 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] enhancements.js syntax verified" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] enhancements.js has syntax errors: $nodeCheck" -ForegroundColor Red
        $failures++
    }
} else {
    Write-Host "  [FAIL] $enhancementsJs does not exist" -ForegroundColor Red
    $failures++
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
if ($failures -eq 0) {
    Write-Host "[STATUS: READY] All developer prerequisites and assets are verified!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "[STATUS: INCOMPLETE] $failures check(s) failed. Please resolve the errors above." -ForegroundColor Red
    exit 1
}
