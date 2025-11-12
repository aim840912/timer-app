'use client'

import { Tag, Repeat, Edit, Trash2 } from 'lucide-react'
import type { Alarm } from '@/types/alarm'
import { formatTime, getRepeatText, isSnoozing } from '@/lib/alarm-utils'

interface AlarmItemProps {
  alarm: Alarm
  onToggle: (id: string) => void
  onEdit: (alarm: Alarm) => void
  onDelete: (id: string) => void
}

export const AlarmItem = ({ alarm, onToggle, onEdit, onDelete }: AlarmItemProps) => {
  const isSnoozed = isSnoozing(alarm)

  // 根據標籤內容判斷顏色
  const getLabelColor = (label: string) => {
    const lowerLabel = label.toLowerCase()
    if (lowerLabel.includes('工作') || lowerLabel.includes('會議')) {
      return 'text-blue-600 dark:text-blue-400'
    }
    if (lowerLabel.includes('運動') || lowerLabel.includes('健身')) {
      return 'text-green-600 dark:text-green-400'
    }
    if (lowerLabel.includes('吃藥') || lowerLabel.includes('健康') || lowerLabel.includes('醫療')) {
      return 'text-red-600 dark:text-red-400'
    }
    if (lowerLabel.includes('休息') || lowerLabel.includes('睡覺')) {
      return 'text-purple-600 dark:text-purple-400'
    }
    if (lowerLabel.includes('遊戲') || lowerLabel.includes('娛樂') || lowerLabel.includes('活動')) {
      return 'text-orange-600 dark:text-orange-400'
    }
    if (lowerLabel.includes('學習') || lowerLabel.includes('讀書')) {
      return 'text-indigo-600 dark:text-indigo-400'
    }
    if (lowerLabel.includes('吃飯') || lowerLabel.includes('用餐')) {
      return 'text-amber-600 dark:text-amber-400'
    }
    return 'text-zinc-600 dark:text-zinc-400' // 預設灰色
  }

  return (
    <div
      className={`
        rounded-xl border p-3 transition-all
        ${
          alarm.enabled
            ? 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
            : 'border-zinc-100 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        {/* 左側：時間和資訊 */}
        <div>
          {/* 時間 */}
          <div
            className={`
            mb-2 flex items-baseline gap-2 text-3xl font-light tabular-nums
            ${alarm.enabled ? 'text-black dark:text-white' : 'text-zinc-400 dark:text-zinc-600'}
          `}
          >
            {formatTime(alarm.time.hour, alarm.time.minute)}
            {isSnoozed && (
              <span className="text-sm text-orange-600 dark:text-orange-400">
                貪睡中
              </span>
            )}
          </div>

          {/* 標籤 */}
          {alarm.label && (
            <div className={`mb-1 flex items-center gap-1.5 text-xs ${getLabelColor(alarm.label)}`}>
              <Tag className="h-3 w-3" aria-hidden="true" />
              <span>{alarm.label}</span>
            </div>
          )}

          {/* 重複設定 */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
            <Repeat className="h-3 w-3" aria-hidden="true" />
            <span>{getRepeatText(alarm.repeat)}</span>
          </div>
        </div>

        {/* 右側：開關和操作按鈕 */}
        <div className="flex flex-col gap-2">
          {/* Toggle 開關 */}
          <button
            onClick={() => onToggle(alarm.id)}
            className={`
              relative h-8 w-14 rounded-full transition-colors
              ${
                alarm.enabled
                  ? 'bg-green-500 dark:bg-green-600'
                  : 'bg-zinc-200 dark:bg-zinc-700'
              }
            `}
            aria-label={alarm.enabled ? '停用鬧鈴' : '啟用鬧鈴'}
            aria-pressed={alarm.enabled}
          >
            <span
              className={`
                absolute top-1 h-6 w-6 rounded-full bg-white transition-all
                ${alarm.enabled ? 'right-1' : 'left-1'}
              `}
            />
          </button>

          {/* 編輯和刪除按鈕 */}
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(alarm)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              aria-label="編輯鬧鈴"
            >
              <Edit className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => onDelete(alarm.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
              aria-label="刪除鬧鈴"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
