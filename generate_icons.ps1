Add-Type -AssemblyName System.Drawing

$iconsDir = Join-Path $PSScriptRoot "src-tauri\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

function New-WaIcon {
    param(
        [int]$size,
        [string]$filePath
    )

    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    # WhatsApp Green circle
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 37, 211, 102))
    $padding = [int]($size * 0.06)
    $innerSize = $size - (2 * $padding)
    $g.FillEllipse($brush, $padding, $padding, $innerSize, $innerSize)

    # White Phone Icon
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $fontSize = [float]($size * 0.46)
    $font = New-Object System.Drawing.Font ("Segoe UI Emoji", $fontSize, [System.Drawing.FontStyle]::Bold)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $rect = New-Object System.Drawing.RectangleF 0, 0, $size, $size
    $g.DrawString([char]::ConvertFromUtf32(0x1F4DE), $font, $whiteBrush, $rect, $sf)

    $bmp.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $brush.Dispose()
    $whiteBrush.Dispose()
    $font.Dispose()
}

New-WaIcon -size 32 -filePath (Join-Path $iconsDir "32x32.png")
New-WaIcon -size 128 -filePath (Join-Path $iconsDir "128x128.png")
New-WaIcon -size 256 -filePath (Join-Path $iconsDir "128x128@2x.png")
New-WaIcon -size 512 -filePath (Join-Path $iconsDir "icon.png")

# Generate .ico
$bmp256 = [System.Drawing.Bitmap]::FromFile((Join-Path $iconsDir "128x128@2x.png"))
$hIcon = $bmp256.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$icoPath = Join-Path $iconsDir "icon.ico"
$fs = New-Object System.IO.FileStream $icoPath, ([System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$bmp256.Dispose()

# Copy dummy icns for Mac compat in bundle schema
Copy-Item (Join-Path $iconsDir "128x128.png") (Join-Path $iconsDir "icon.icns") -Force

Write-Host "Icons generated successfully in $iconsDir"
