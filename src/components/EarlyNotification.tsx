'use client'

import { motion } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import type { Alarm } from '@/types/alarm'
import { formatTime } from '@/lib/alarm-utils'

interface EarlyNotificationProps {
  alarm: Alarm
  onDismiss: () => void
}

export const EarlyNotification = ({ alarm, onDismiss }: EarlyNotificationProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label="關閉提醒"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* 圖示 */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
            <Bell className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
        </div>

        {/* 標題 */}
        <h2 className="mb-2 text-center text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          即將響起
        </h2>

        {/* 時間 */}
        <div className="mb-4 text-center">
          <div className="text-4xl font-light tabular-nums text-blue-600 dark:text-blue-400">
            {formatTime(alarm.time.hour, alarm.time.minute)}
          </div>
          {alarm.label && (
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{alarm.label}</div>
          )}
        </div>

        {/* 提示訊息 */}
        <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
          還有 {alarm.earlyNotification.minutesBefore} 分鐘後鬧鈴將響起
        </p>

        {/* 按鈕 */}
        <button
          onClick={onDismiss}
          className="w-full rounded-2xl bg-blue-600 py-4 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          知道了
        </button>
      </motion.div>
    </div>
  )
}
