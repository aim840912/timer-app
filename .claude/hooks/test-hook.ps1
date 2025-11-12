# Test Hook Script - Verifies hook execution
param(
    [string]$HookName = "Unknown"
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logMessage = "[$timestamp] Hook '$HookName' was triggered"

# Write to log file
$logMessage | Out-File -FilePath "hook-test.log" -Append -Encoding UTF8

# Also try to show a simple message box (as backup notification)
Add-Type -AssemblyName PresentationFramework
[System.Windows.MessageBox]::Show("Hook '$HookName' triggered at $timestamp", "Hook Test", "OK", "Information")

exit 0
