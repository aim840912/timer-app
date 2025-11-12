# Enhanced Claude Code Toast Notification Script
# Features: Silent popup notifications with taskbar flashing (WSL support)

param(
    [string]$Title = "Claude Code",
    [string]$Message = "Notification"
)

# Environment variables take precedence
if ($env:NOTIFICATION_TITLE) { $Title = $env:NOTIFICATION_TITLE }
if ($env:NOTIFICATION_MESSAGE) { $Message = $env:NOTIFICATION_MESSAGE }

# Define FlashWindowEx API for taskbar flashing
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;

public class WindowFlasher {
    [StructLayout(LayoutKind.Sequential)]
    private struct FLASHWINFO {
        public uint cbSize;
        public IntPtr hwnd;
        public uint dwFlags;
        public uint uCount;
        public uint dwTimeout;
    }

    private const uint FLASHW_ALL = 3;

    [DllImport("user32.dll")]
    private static extern bool FlashWindowEx(ref FLASHWINFO pwfi);

    public static void Flash(IntPtr hWnd, uint timeout, uint count) {
        if (hWnd == IntPtr.Zero) return;

        FLASHWINFO fwi = new FLASHWINFO();
        fwi.cbSize = Convert.ToUInt32(Marshal.SizeOf(fwi));
        fwi.hwnd = hWnd;
        fwi.dwFlags = FLASHW_ALL;
        fwi.uCount = count;
        fwi.dwTimeout = timeout;
        FlashWindowEx(ref fwi);
    }
}
"@ -ErrorAction SilentlyContinue

# Define WindowFinder for title-based window searching
Add-Type -TypeDefinition @"
using System;
using System.Text;
using System.Runtime.InteropServices;

public class WindowFinder {
    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);

    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    public static IntPtr FindByTitle(string[] keywords) {
        IntPtr found = IntPtr.Zero;
        EnumWindows((hWnd, lParam) => {
            if (!IsWindowVisible(hWnd)) return true;

            StringBuilder title = new StringBuilder(256);
            GetWindowText(hWnd, title, title.Capacity);
            string titleStr = title.ToString().ToLower();

            foreach (string keyword in keywords) {
                if (titleStr.Contains(keyword.ToLower())) {
                    found = hWnd;
                    return false;
                }
            }
            return true;
        }, IntPtr.Zero);
        return found;
    }
}
"@ -ErrorAction SilentlyContinue

# Function to find terminal window handle
function Find-TerminalWindow {
    # Strategy 1: Find VS Code (PRIORITY - most common for Claude Code)
    $vscode = Get-Process -Name "Code" -ErrorAction SilentlyContinue |
              Where-Object { $_.MainWindowHandle -ne 0 } |
              Select-Object -First 1
    if ($vscode) {
        return $vscode.MainWindowHandle
    }

    # Strategy 2: Find Windows Terminal
    $windowsTerminal = Get-Process -Name "WindowsTerminal" -ErrorAction SilentlyContinue |
                       Where-Object { $_.MainWindowHandle -ne 0 } |
                       Select-Object -First 1
    if ($windowsTerminal) {
        return $windowsTerminal.MainWindowHandle
    }

    # Strategy 3: Find Ubuntu app
    $ubuntu = Get-Process -Name "ubuntu*" -ErrorAction SilentlyContinue |
              Where-Object { $_.MainWindowHandle -ne 0 } |
              Select-Object -First 1
    if ($ubuntu) {
        return $ubuntu.MainWindowHandle
    }

    # Strategy 4: Find ConEmu
    $conemu = Get-Process -Name "ConEmu*" -ErrorAction SilentlyContinue |
              Where-Object { $_.MainWindowHandle -ne 0 } |
              Select-Object -First 1
    if ($conemu) {
        return $conemu.MainWindowHandle
    }

    # Strategy 5: Find by window title (fallback)
    try {
        $keywords = @("Visual Studio Code", "Ubuntu", "WSL", "bash", "Windows Terminal", "PowerShell")
        $handle = [WindowFinder]::FindByTitle($keywords)
        if ($handle -ne [IntPtr]::Zero) {
            return $handle
        }
    }
    catch {
        # Silently continue if title search fails
    }

    return [IntPtr]::Zero
}

try {
    # Load Windows Runtime Toast Notification APIs
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
    [Windows.UI.Notifications.ToastNotification, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
    [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

    # Build enhanced Toast XML with silent audio
    $toastXml = @"
<?xml version="1.0" encoding="utf-8"?>
<toast scenario="reminder" duration="long">
  <visual lang="zh-TW">
    <binding template="ToastGeneric">
      <text hint-style="title">$([Security.SecurityElement]::Escape($Title))</text>
      <text hint-wrap="true">$([Security.SecurityElement]::Escape($Message))</text>
    </binding>
  </visual>
  <audio silent="true" />
  <actions>
    <action activationType="system" arguments="dismiss" content="關閉"/>
  </actions>
</toast>
"@

    # Load XML into XmlDocument
    $doc = New-Object Windows.Data.Xml.Dom.XmlDocument
    $doc.LoadXml($toastXml)

    # Create and display toast notification
    $APP_ID = 'Claude Code'
    $toast = New-Object Windows.UI.Notifications.ToastNotification $doc
    $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($APP_ID)
    $notifier.Show($toast)

    # Flash taskbar (works in both Windows and WSL environments)
    try {
        $windowHandle = Find-TerminalWindow
        if ($windowHandle -ne [IntPtr]::Zero) {
            [WindowFlasher]::Flash($windowHandle, 150, 5)
        }
    }
    catch {
        # Silently continue if flashing fails
    }

    exit 0
}
catch {
    Write-Error "Failed to display toast notification: $_"
    exit 1
}
