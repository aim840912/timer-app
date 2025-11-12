'use client'

import { Plus, AlarmClock, FileText } from 'lucide-react'
import type { Alarm } from '@/types/alarm'
import { AlarmItem } from './AlarmItem'

interface AlarmListProps {
  alarms: Alarm[]
  onToggle: (id: string) => void
  onEdit: (alarm: Alarm) => void
  onDelete: (id: string) => void
  onAdd: () => void
  onBatchImport: () => void
}

export const AlarmList = ({
  alarms,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  onBatchImport,
}: AlarmListProps) => {
  // 按時間排序鬧鈴
  const sortedAlarms = [...alarms].sort((a, b) => {
    if (a.time.hour !== b.time.hour) {
      return a.time.hour - b.time.hour
    }
    return a.time.minute - b.time.minute
  })

  return (
    <div className="mx-auto w-full px-3 py-6 sm:px-4 lg:px-6">
      {/* 標題和按鈕 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black dark:text-white">鬧鈴</h1>
        <div className="flex gap-2">
          {/* 批次匯入按鈕 */}
          <button
            onClick={onBatchImport}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
            aria-label="批次匯入"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
          </button>
          {/* 新增鬧鈴按鈕 */}
          <button
            onClick={onAdd}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            aria-label="新增鬧鈴"
          >
            <Plus className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 鬧鈴列表 */}
      {sortedAlarms.length > 0 ? (
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
          {sortedAlarms.map((alarm) => (
            <AlarmItem
              key={alarm.id}
              alarm={alarm}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        /* 空狀態 */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
            <AlarmClock className="h-12 w-12 text-zinc-400 dark:text-zinc-600" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            尚無鬧鈴
          </h2>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            點擊右上角的 + 按鈕新增第一個鬧鈴
          </p>
          <button
            onClick={onAdd}
            className="rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            新增鬧鈴
          </button>
        </div>
      )}
    </div>
  )
}
