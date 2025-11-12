'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Timer } from '@/types/timer'
import { TIMER_PRESETS, TIMER_SOUND } from '@/types/timer'
import {
  convertToSeconds,
  convertFromSeconds,
  validateTimerInput,
  formatDurationText,
} from '@/lib/timer-utils'

interface TimerFormProps {
  timer?: Timer | null
  onSave: (data: {
    name: string
    duration: number
    sound: string
  }) => void
  onCancel: () => void
}

export const TimerForm = ({ timer, onSave, onCancel }: TimerFormProps) => {
  const isEditMode = !!timer

  // 表單狀態
  const [name, setName] = useState(timer?.name ?? '')
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  // 初始化時間輸入
  useEffect(() => {
    if (timer) {
      const { hours: h, minutes: m, seconds: s } = convertFromSeconds(timer.duration)
      setHours(h)
      setMinutes(m)
      setSeconds(s)
    }
  }, [timer])

  // 防止背景滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  /**
   * 套用預設範本
   */
  const applyPreset = (presetDuration: number, presetName: string) => {
    const { hours: h, minutes: m, seconds: s } = convertFromSeconds(presetDuration)
    setHours(h)
    setMinutes(m)
    setSeconds(s)
    if (!name) {
      setName(presetName)
    }
  }

  /**
   * 處理儲存
   */
  const handleSave = () => {
    const duration = convertToSeconds(hours, minutes, seconds)

    // 驗證
    if (!validateTimerInput(hours, minutes, seconds)) {
      alert('請輸入有效的時間（至少 1 秒）')
      return
    }

    if (!name.trim()) {
      alert('請輸入計時器名稱')
      return
    }

    onSave({
      name: name.trim(),
      duration,
      sound: TIMER_SOUND,
    })
  }

  const totalSeconds = convertToSeconds(hours, minutes, seconds)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 標題列 */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {isEditMode ? '編輯計時器' : '新增計時器'}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="關閉"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* 表單內容 */}
        <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
          {/* 快速預設 */}
          {!isEditMode && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                快速預設
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIMER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.duration, preset.name)}
                    className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 名稱 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              計時器名稱
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：番茄鐘、休息時間"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* 時間設定 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              時間設定
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
                  小時
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-center text-lg tabular-nums text-zinc-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
                  分鐘
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-center text-lg tabular-nums text-zinc-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">
                  秒
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-center text-lg tabular-nums text-zinc-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>
            {totalSeconds > 0 && (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                總計：{formatDurationText(totalSeconds)}
              </p>
            )}
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="flex gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-zinc-300 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-2xl bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isEditMode ? '儲存' : '新增'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
