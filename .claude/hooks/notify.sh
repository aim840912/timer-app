#!/bin/bash
# 手動觸發通知的便捷腳本
# 使用方式: bash .claude/hooks/notify.sh "標題" "訊息"

TITLE="${1:-任務完成}"
MESSAGE="${2:-Claude Code 任務已完成}"

powershell.exe -ExecutionPolicy Bypass -File .claude/hooks/notify-toast.ps1 -Title "$TITLE" -Message "$MESSAGE"
