'use client'

import { useEffect } from 'react'
import { Bell, X, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Alarm } from '@/types/alarm'
import { formatTime } from '@/lib/alarm-utils'

interface AlarmRingingProps {
  alarm: Alarm
  onStop: () => void
  onSnooze: (minutes: number) => void
}

export const AlarmRinging = ({ alarm, onStop, onSnooze }: AlarmRingingProps) => {
  // 防止背景滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // 監聽鍵盤事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        onStop()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onStop])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md px-6 text-center"
      >
        {/* 鈴鐺圖示動畫 */}
        <motion.div
          animate={{
            rotate: [0, -15, 15, -15, 15, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          className="mb-8 inline-block"
        >
          <div className="rounded-full bg-white/10 p-8">
            <Bell className="h-16 w-16 text-white" aria-hidden="true" />
          </div>
        </motion.div>

        {/* 時間顯示 */}
        <div className="mb-6">
          <div className="mb-2 text-8xl font-light tabular-nums text-white">
            {formatTime(alarm.time.hour, alarm.time.minute)}
          </div>
          {alarm.label && (
            <div className="text-xl text-white/80">{alarm.label}</div>
          )}
        </div>

        {/* 操作按鈕 */}
        <div className="space-y-3">
          {/* 貪睡按鈕 */}
          <div className="flex gap-2">
            <button
              onClick={() => onSnooze(5)}
              className="flex-1 rounded-2xl bg-white/10 py-4 font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <Clock className="mx-auto mb-1 h-5 w-5" aria-hidden="true" />
              貪睡 5 分鐘
            </button>
            <button
              onClick={() => onSnooze(10)}
              className="flex-1 rounded-2xl bg-white/10 py-4 font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <Clock className="mx-auto mb-1 h-5 w-5" aria-hidden="true" />
              貪睡 10 分鐘
            </button>
          </div>

          {/* 停止按鈕 */}
          <button
            onClick={onStop}
            className="w-full rounded-2xl bg-white py-5 text-lg font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            <X className="mx-auto mb-1 h-6 w-6" aria-hidden="true" />
            停止鬧鈴
          </button>
        </div>

        {/* 提示文字 */}
        <p className="mt-6 text-sm text-white/60">
          按下 ESC 或空白鍵也可停止鬧鈴
        </p>
      </motion.div>
    </div>
  )
}
