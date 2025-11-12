'use client'

import type { Timer } from '@/types/timer'
import { TimerItem } from './TimerItem'

interface TimerListProps {
  timers: Timer[]
  onStart: (id: string) => void
  onPause: (id: string) => void
  onReset: (id: string) => void
  onEdit: (timer: Timer) => void
  onDelete: (id: string) => void
}

export const TimerList = ({ timers, onStart, onPause, onReset, onEdit, onDelete }: TimerListProps) => {
  if (timers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 text-6xl text-zinc-300 dark:text-zinc-700">⏱️</div>
        <h3 className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          尚無計時器
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          點擊右上角的「+」按鈕新增計時器
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
      {timers.map((timer) => (
        <TimerItem
          key={timer.id}
          timer={timer}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
