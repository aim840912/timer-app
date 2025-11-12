'use client'

import { Play, Pause, RotateCcw, Edit, Trash2 } from 'lucide-react'
import type { Timer } from '@/types/timer'
import { formatTimerTime, calculateProgress } from '@/lib/timer-utils'

interface TimerItemProps {
  timer: Timer
  onStart: (id: string) => void
  onPause: (id: string) => void
  onReset: (id: string) => void
  onEdit: (timer: Timer) => void
  onDelete: (id: string) => void
}

export const TimerItem = ({ timer, onStart, onPause, onReset, onEdit, onDelete }: TimerItemProps) => {
  const progress = calculateProgress(timer)
  const isRunning = timer.status === 'running'
  const isPaused = timer.status === 'paused'
  const isFinished = timer.status === 'finished'

  return (
    <div
      className={`
        rounded-xl border p-3 transition-all
        ${
          isFinished
            ? 'border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-950'
            : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        {/* 左側：名稱和時間 */}
        <div className="flex-1">
          {/* 名稱 */}
          <div className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {timer.name}
          </div>

          {/* 時間顯示 */}
          <div
            className={`
              mb-2 text-3xl font-light tabular-nums transition-colors
              ${
                isFinished
                  ? 'text-green-600 dark:text-green-400'
                  : isRunning
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-black dark:text-white'
              }
            `}
          >
            {formatTimerTime(timer.remainingTime)}
          </div>

          {/* 進度條 */}
          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className={`
                h-full transition-all duration-100
                ${
                  isFinished
                    ? 'bg-green-500 dark:bg-green-600'
                    : isRunning
                    ? 'bg-blue-500 dark:bg-blue-600'
                    : 'bg-zinc-400 dark:bg-zinc-500'
                }
              `}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 控制按鈕 */}
          <div className="flex gap-1">
            {/* 開始/暫停按鈕 */}
            {!isRunning ? (
              <button
                onClick={() => onStart(timer.id)}
                className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-xs font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                aria-label="開始計時"
              >
                <Play className="h-3 w-3" aria-hidden="true" />
                {isPaused ? '繼續' : '開始'}
              </button>
            ) : (
              <button
                onClick={() => onPause(timer.id)}
                className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-600 text-xs font-medium text-white transition-colors hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                aria-label="暫停計時"
              >
                <Pause className="h-3 w-3" aria-hidden="true" />
                暫停
              </button>
            )}

            {/* 重設按鈕 */}
            <button
              onClick={() => onReset(timer.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              aria-label="重設計時器"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 右側：編輯和刪除按鈕 */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onEdit(timer)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            aria-label="編輯計時器"
          >
            <Edit className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            onClick={() => onDelete(timer.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
            aria-label="刪除計時器"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
