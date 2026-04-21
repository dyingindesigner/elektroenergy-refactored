param(
  [ValidateSet("pull", "diff", "hash")]
  [string]$Action = "diff",
  [string]$Root = "C:\Users\admin\Desktop\XML import\scratch\elektroenergy-scripts-local",
  [string]$CurrentDir = "current",
  [switch]$WriteManifest
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$manifestPath = Join-Path $Root "manifest.json"
$currentPath = Join-Path $Root $CurrentDir

if (!(Test-Path $manifestPath)) { throw "Manifest not found: $manifestPath" }
if (!(Test-Path $currentPath)) { throw "Current dir not found: $currentPath" }

$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
if (-not $manifest) { throw "Manifest is empty." }

function Get-FileSha256([string]$Path) {
  if (!(Test-Path $Path)) { return $null }
  return (Get-FileHash $Path -Algorithm SHA256).Hash.ToLower()
}

function Update-ManifestHashes {
  param([array]$Items)
  $ts = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
  foreach ($it in $Items) {
    $localPath = Join-Path $currentPath $it.name
    $sha = Get-FileSha256 $localPath
    if ($sha) {
      $it.sha256 = $sha
      $it.downloaded_at = $ts
    }
  }
  $Items | ConvertTo-Json -Depth 5 | Set-Content $manifestPath -Encoding UTF8
  Write-Host "Manifest updated: $manifestPath"
}

switch ($Action) {
  "pull" {
    foreach ($item in $manifest) {
      $target = Join-Path $currentPath $item.name
      Write-Host "Pull: $($item.url) -> $target"
      Invoke-WebRequest -Uri $item.url -OutFile $target
    }
    if ($WriteManifest) { Update-ManifestHashes -Items $manifest }
  }
  "diff" {
    $rows = @()
    foreach ($item in $manifest) {
      $local = Join-Path $currentPath $item.name
      $localSha = Get-FileSha256 $local
      $expected = if ($item.sha256) { "$($item.sha256)".ToLower() } else { "" }
      $state = if (!$localSha) { "missing" } elseif ($expected -and $localSha -eq $expected) { "same" } else { "changed" }
      $rows += [PSCustomObject]@{
        name = $item.name
        state = $state
        local_sha256 = $localSha
        manifest_sha256 = $expected
      }
    }
    $rows | Format-Table -AutoSize
  }
  "hash" {
    $rows = @()
    foreach ($item in $manifest) {
      $local = Join-Path $currentPath $item.name
      $rows += [PSCustomObject]@{
        name = $item.name
        sha256 = Get-FileSha256 $local
      }
    }
    $rows | Format-Table -AutoSize
    if ($WriteManifest) { Update-ManifestHashes -Items $manifest }
  }
}
