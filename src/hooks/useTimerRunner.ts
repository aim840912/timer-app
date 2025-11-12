'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import type { Timer } from '@/types/timer'

interface UseTimerRunnerProps {
  timers: Timer[]
  onTimerFinished: (id: string) => void
  updateTimer: (id: string, updates: Partial<Timer>) => void
}

export const useTimerRunner = ({ timers, onTimerFinished, updateTimer }: UseTimerRunnerProps) => {
  const finishedTimersRef = useRef<Set<string>>(new Set())
  const onTimerFinishedRef = useRef(onTimerFinished)
  const timersRef = useRef<Timer[]>([])
  const [hasRunningTimer, setHasRunningTimer] = useState(false)

  // 更新 onTimerFinished 的 ref 引用
  useEffect(() => {
    onTimerFinishedRef.current = onTimerFinished
  }, [onTimerFinished])

  // 更新 timers 的 ref 引用
  useEffect(() => {
    timersRef.current = timers
  }, [timers])

  // 監控 timers 變化，只更新 hasRunningTimer 狀態
  useEffect(() => {
    const hasRunning = timers.some((t) => t.status === 'running')
    setHasRunningTimer((prev) => {
      // 只有當值實際改變時才更新狀態
      if (prev !== hasRunning) {
        return hasRunning
      }
      return prev
    })
  }, [timers])

  /**
   * 更新所有執行中的計時器
   */
  const updateRunningTimers = useCallback(() => {
    const now = Date.now()

    timersRef.current.forEach((timer) => {
      if (timer.status !== 'running' || !timer.startedAt) return

      // 使用時間戳記計算精確的剩餘時間
      const elapsedSeconds = (now - timer.startedAt) / 1000
      const remaining = Math.max(0, timer.duration - elapsedSeconds)

      // 更新剩餘時間
      updateTimer(timer.id, { remainingTime: remaining })

      // 檢查是否完成
      if (remaining <= 0 && !finishedTimersRef.current.has(timer.id)) {
        finishedTimersRef.current.add(timer.id)
        onTimerFinishedRef.current(timer.id)
      }
    })
  }, [updateTimer])

  /**
   * 清理已完成計時器的記錄
   */
  useEffect(() => {
    // 移除不再執行中的計時器的記錄
    const runningIds = new Set(
      timers.filter((t) => t.status === 'running').map((t) => t.id)
    )

    finishedTimersRef.current.forEach((id) => {
      if (!runningIds.has(id)) {
        finishedTimersRef.current.delete(id)
      }
    })
  }, [timers])

  /**
   * 設定定時器（每 100ms 更新一次）
   */
  useEffect(() => {
    if (!hasRunningTimer) return

    updateRunningTimers() // 立即執行一次

    const interval = setInterval(updateRunningTimers, 100) // 100ms 更新頻率

    return () => clearInterval(interval)
  }, [hasRunningTimer, updateRunningTimers])
}
