# Stop Hook 測試腳本 - 記錄觸發時間
param(
    [string]$Title = "Stop Hook 觸發",
    [string]$Message = "測試訊息"
)

# 記錄到文件
$logFile = Join-Path $PSScriptRoot "stop-hook.log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logEntry = "[$timestamp] Stop Hook 觸發 - Title: $Title, Message: $Message"
Add-Content -Path $logFile -Value $logEntry

# 同時發送 Toast 通知
& (Join-Path $PSScriptRoot "notify-toast.ps1") -Title $Title -Message $Message

Write-Host "Stop Hook 已觸發並記錄到: $logFile"
