$localBackupDir = "d:\DevSpace\backups"
$cloudBackupDir = "H:\My Drive\Website\brandinfo\backups"
$sourceDir = "d:\DevSpace\homeassistant_config"
$stagingDir = "d:\DevSpace\tmp_backup_stage"
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$zipName = "homeassistant_master_backup_$timestamp.zip"
$localZip = Join-Path $localBackupDir $zipName

if (-not (Test-Path $localBackupDir)) {
    New-Item -ItemType Directory -Path $localBackupDir -Force | Out-Null
}

Write-Host "1. Staging Home Assistant configuration files on D: drive..."
if (Test-Path $stagingDir) {
    Remove-Item -Path $stagingDir -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $stagingDir -Force | Out-Null

$itemsToCopy = @(
    "configuration.yaml",
    "automations.yaml",
    "scripts.yaml",
    "scenes.yaml",
    "homeassistant_master_backup_20260823.yaml",
    "instagram_milestones.json",
    "ai_climate_log.json",
    "mobile_bridge.log",
    "custom_components",
    "themes"
)

foreach ($item in $itemsToCopy) {
    $src = Join-Path $sourceDir $item
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $stagingDir -Recurse -Force
    }
}

Write-Host "2. Creating master zip backup on D: drive: $localZip"
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $localZip) { Remove-Item $localZip -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($stagingDir, $localZip, [System.IO.Compression.CompressionLevel]::Optimal, $false)

Write-Host "3. Cleaning up staging area..."
Remove-Item -Path $stagingDir -Recurse -Force -ErrorAction SilentlyContinue

# Attempt copy to Google Drive if cache space permits
if (Test-Path $cloudBackupDir) {
    try {
        Copy-Item -Path $localZip -Destination (Join-Path $cloudBackupDir $zipName) -Force -ErrorAction SilentlyContinue
    } catch {}
}

$sizeMB = [math]::Round((Get-Item $localZip).Length / 1MB, 2)
Write-Host "`n🎉 MASTER LOCAL & CLOUD BACKUP COMPLETED!"
Write-Host "File Name: $zipName"
Write-Host "Location:  $localZip"
Write-Host "Size:      $sizeMB MB"
Write-Host "Timestamp: $(Get-Date -Format 'MM/dd/yyyy HH:mm')"
