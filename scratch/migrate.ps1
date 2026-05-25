$tools = @(
    "avurudu-games",
    "avurudu-greetings",
    "avurudu-nakath",
    "digital-dansala",
    "digital-pandal",
    "exam-wishers",
    "resolution-card",
    "santa-letter",
    "secret-santa",
    "valentine-notes",
    "verse-book"
)

# 1. Update tecsub solutions
$solutionsPath = "c:\Users\ASUS\Desktop\tecsub current works\github new file web\tecsub solutions\public\seasonal"
foreach ($tool in $tools) {
    $src = "$solutionsPath\$tool.html"
    $destDir = "$solutionsPath\$tool"
    $dest = "$destDir\index.html"
    if (Test-Path $src) {
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Move-Item -Path $src -Destination $dest -Force
        Write-Host "Moved $src -> $dest"
    }
}

# 2. Update tecsub auto post
$autoPostPath = "c:\Users\ASUS\Desktop\tecsub current works\github new file web\tecsub auto post\seasonal"
foreach ($tool in $tools) {
    $src = "$autoPostPath\$tool.html"
    $destDir = "$autoPostPath\$tool"
    $dest = "$destDir\index.html"
    if (Test-Path $src) {
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Move-Item -Path $src -Destination $dest -Force
        Write-Host "Moved $src -> $dest"
    }
}
