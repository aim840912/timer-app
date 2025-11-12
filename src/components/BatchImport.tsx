'use client'

import { useState, useEffect } from 'react'
import { X, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { AlarmInput } from '@/types/alarm'
import {
  parseActivityText,
  formatActivityTime,
  getActivityStats,
  type ParsedActivity,
} from '@/lib/activity-parser'

interface BatchImportProps {
  onImport: (alarms: AlarmInput[]) => void
  onCancel: () => void
}

export const BatchImport = ({ onImport, onCancel }: BatchImportProps) => {
  const [text, setText] = useState('')
  const [activities, setActivities] = useState<ParsedActivity[]>([])
  const [alarms, setAlarms] = useState<AlarmInput[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isParsed, setIsParsed] = useState(false)

  // 防止背景滾動
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // 解析時間表
  const handleParse = () => {
    const result = parseActivityText(text)
    setActivities(result.activities)
    setAlarms(result.alarms)
    setErrors(result.errors)
    setIsParsed(true)
  }

  // 確認匯入
  const handleImport = () => {
    if (alarms.length > 0) {
      onImport(alarms)
    }
  }

  // 重置
  const handleReset = () => {
    setText('')
    setActivities([])
    setAlarms([])
    setErrors([])
    setIsParsed(false)
  }

  const stats = activities.length > 0 ? getActivityStats(activities) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel()
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white p-6 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 標題 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-black dark:text-white">
              批次匯入遊戲活動鬧鈴
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-2 bg-zinc-100 text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            aria-label="關閉"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* 內容區域（可滾動） */}
        <div className="flex-1 overflow-y-auto">
          {!isParsed ? (
            /* 輸入階段 */
            <div className="space-y-4">
              {/* 說明 */}
              <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
                <p className="mb-2 font-medium">輸入格式範例：</p>
                <code className="block whitespace-pre font-mono text-xs">
                  【少數決】01:00／12:00／22:30{'\n'}
                  【極速快感】04:00／09:00／20:00{'\n'}
                  【炸彈波利】16:00／22:00
                </code>
              </div>

              {/* 文字輸入框 */}
              <div>
                <label
                  htmlFor="activity-text"
                  className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  貼上活動時間表
                </label>
                <textarea
                  id="activity-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="請貼上活動時間表..."
                  className="h-96 w-full resize-none rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 font-mono text-sm text-black placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-600"
                />
              </div>

              {/* 解析按鈕 */}
              <button
                onClick={handleParse}
                disabled={!text.trim()}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
              >
                解析時間表
              </button>
            </div>
          ) : (
            /* 預覽階段 */
            <div className="space-y-4">
              {/* 統計資訊 */}
              {stats && (
                <div className="rounded-xl bg-green-50 p-4 dark:bg-green-950">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-green-900 dark:text-green-100">
                      解析成功！將建立 {stats.totalAlarms} 個鬧鈴
                    </span>
                  </div>
                  <div className="text-sm text-green-800 dark:text-green-200">
                    {stats.totalActivities} 個活動：
                    {stats.activityBreakdown.map((item, index) => (
                      <span key={index}>
                        {item.name} ({item.count})
                        {index < stats.activityBreakdown.length - 1 && '、'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 錯誤訊息 */}
              {errors.length > 0 && (
                <div className="rounded-xl bg-red-50 p-4 dark:bg-red-950">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle
                      className="h-5 w-5 text-red-600 dark:text-red-400"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-red-900 dark:text-red-100">
                      部分內容解析失敗
                    </span>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-red-800 dark:text-red-200">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 預覽清單 */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  預覽將建立的鬧鈴（共 {alarms.length} 個）
                </h3>
                <div className="space-y-2">
                  {activities.map((activity, activityIndex) => (
                    <div
                      key={activityIndex}
                      className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700"
                    >
                      <div className="mb-2 font-medium text-black dark:text-white">
                        {activity.name}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activity.times.map((time, timeIndex) => (
                          <div
                            key={timeIndex}
                            className="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-mono text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                          >
                            {formatActivityTime(time.hour, time.minute)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-2xl bg-zinc-100 py-3.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  重新輸入
                </button>
                <button
                  onClick={handleImport}
                  disabled={alarms.length === 0}
                  className="flex-1 rounded-2xl bg-blue-600 py-3.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-zinc-300 disabled:text-zinc-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
                >
                  確認匯入 ({alarms.length})
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
