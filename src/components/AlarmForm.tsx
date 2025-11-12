'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Alarm, AlarmInput } from '@/types/alarm'
import { ALARM_SOUND } from '@/types/alarm'

interface AlarmFormProps {
  alarm?: Alarm // 如果提供則為編輯模式
  onSave: (input: AlarmInput) => void
  onCancel: () => void
}

export const AlarmForm = ({ alarm, onSave, onCancel }: AlarmFormProps) => {
  const [hour, setHour] = useState(alarm?.time.hour ?? 7)
  const [minute, setMinute] = useState(alarm?.time.minute ?? 0)
  const [label, setLabel] = useState(alarm?.label ?? '')
  const [repeatType, setRepeatType] = useState<'once' | 'daily' | 'weekdays' | 'custom'>(
    alarm?.repeat.type ?? 'daily'
  )
  const [customDays, setCustomDays] = useState<number[]>(alarm?.repeat.days ?? [])
  const [earlyNotificationEnabled, setEarlyNotificationEnabled] = useState(
    alarm?.earlyNotification?.enabled ?? true
  )
  const [earlyNotificationMinutes, setEarlyNotificationMinutes] = useState(
    alarm?.earlyNotification?.minutesBefore ?? 3
  )
  const enabled = alarm?.enabled ?? true

  // 防止背景滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // 處理儲存
  const handleSave = () => {
    const input: AlarmInput = {
      time: { hour, minute },
      enabled,
      label,
      repeat: {
        type: repeatType,
        days: repeatType === 'custom' ? customDays : undefined,
      },
      sound: ALARM_SOUND,
      earlyNotification: {
        enabled: earlyNotificationEnabled,
        minutesBefore: earlyNotificationMinutes,
      },
    }
    onSave(input)
  }

  // 切換自訂星期幾
  const toggleCustomDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  const weekdayNames = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 dark:bg-zinc-900"
      >
        {/* 標題 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {alarm ? '編輯鬧鈴' : '新增鬧鈴'}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="關閉"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* 時間選擇 */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            時間
          </label>
          <div className="flex items-center justify-center gap-2">
            {/* 小時 */}
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-24 rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-center text-3xl font-light tabular-nums text-black focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
              ))}
            </select>

            <span className="text-3xl font-light text-zinc-400">:</span>

            {/* 分鐘 */}
            <select
              value={minute}
              onChange={(e) => setMinute(Number(e.target.value))}
              className="w-24 rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-center text-3xl font-light tabular-nums text-black focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 標籤 */}
        <div className="mb-6">
          <label
            htmlFor="alarm-label"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            標籤（選填）
          </label>
          <input
            id="alarm-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="例：起床、午餐、運動"
            className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-black placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-600"
          />
        </div>

        {/* 重複設定 */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            重複
          </label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setRepeatType('once')}
              className={`rounded-2xl py-2.5 text-sm font-medium transition-colors ${
                repeatType === 'once'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              一次
            </button>
            <button
              onClick={() => setRepeatType('daily')}
              className={`rounded-2xl py-2.5 text-sm font-medium transition-colors ${
                repeatType === 'daily'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              每天
            </button>
            <button
              onClick={() => setRepeatType('weekdays')}
              className={`rounded-2xl py-2.5 text-sm font-medium transition-colors ${
                repeatType === 'weekdays'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              工作日
            </button>
            <button
              onClick={() => setRepeatType('custom')}
              className={`rounded-2xl py-2.5 text-sm font-medium transition-colors ${
                repeatType === 'custom'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              自訂
            </button>
          </div>

          {/* 自訂星期幾 */}
          {repeatType === 'custom' && (
            <div className="mt-3 grid grid-cols-7 gap-2">
              {weekdayNames.map((name, index) => (
                <button
                  key={index}
                  onClick={() => toggleCustomDay(index)}
                  className={`rounded-2xl py-2 text-sm font-medium transition-colors ${
                    customDays.includes(index)
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 提前提醒 */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              提前提醒
            </label>
            <button
              onClick={() => setEarlyNotificationEnabled(!earlyNotificationEnabled)}
              className={`
                relative h-8 w-14 rounded-full transition-colors
                ${
                  earlyNotificationEnabled
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-zinc-200 dark:bg-zinc-700'
                }
              `}
              aria-label={earlyNotificationEnabled ? '停用提前提醒' : '啟用提前提醒'}
              aria-pressed={earlyNotificationEnabled}
            >
              <span
                className={`
                  absolute top-1 h-6 w-6 rounded-full bg-white transition-all
                  ${earlyNotificationEnabled ? 'right-1' : 'left-1'}
                `}
              />
            </button>
          </div>
          {earlyNotificationEnabled && (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setEarlyNotificationMinutes(3)}
                className={`rounded-2xl py-2.5 text-sm font-medium transition-colors ${
                  earlyNotificationMinutes === 3
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                3 分鐘
              </button>
              <button
                onClick={() => setEarlyNotificationMinutes(5)}
                className={`rounded-2xl py-2.5 text-sm font-medium transition-colors ${
                  earlyNotificationMinutes === 5
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                5 分鐘
              </button>
              <button
                onClick={() => setEarlyNotificationMinutes(10)}
                className={`rounded-2xl py-2.5 text-sm font-medium transition-colors ${
                  earlyNotificationMinutes === 10
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                }`}
              >
                10 分鐘
              </button>
            </div>
          )}
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-zinc-100 py-3.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-2xl bg-blue-600 py-3.5 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            儲存
          </button>
        </div>
      </motion.div>
    </div>
  )
}
