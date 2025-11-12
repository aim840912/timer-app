'use client'

import { useEffect } from 'react'
import { X, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Timer } from '@/types/timer'

interface TimerRingingProps {
  timer: Timer
  onStop: () => void
  onRestart: () => void
}

export const TimerRinging = ({ timer, onStop, onRestart }: TimerRingingProps) => {
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
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          className="mb-8 inline-block"
        >
          <div className="rounded-full bg-white/10 p-8">
            <div className="text-8xl">⏰</div>
          </div>
        </motion.div>

        {/* 計時器名稱 */}
        <div className="mb-4">
          <div className="mb-2 text-4xl font-semibold text-white">{timer.name}</div>
          <div className="text-xl text-white/80">時間到！</div>
        </div>

        {/* 操作按鈕 */}
        <div className="space-y-3">
          {/* 重新開始按鈕 */}
          <button
            onClick={onRestart}
            className="w-full rounded-2xl bg-white/10 py-4 font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <RotateCcw className="mx-auto mb-1 h-5 w-5" aria-hidden="true" />
            重新開始
          </button>

          {/* 停止按鈕 */}
          <button
            onClick={onStop}
            className="w-full rounded-2xl bg-white py-5 text-lg font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            <X className="mx-auto mb-1 h-6 w-6" aria-hidden="true" />
            關閉
          </button>
        </div>

        {/* 提示文字 */}
        <p className="mt-6 text-sm text-white/60">按下 ESC 或空白鍵也可關閉</p>
      </motion.div>
    </div>
  )
}
