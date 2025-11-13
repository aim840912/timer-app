'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Timer, TimerInput } from '@/types/timer'
import { loadTimers, saveTimers } from '@/lib/timer-storage'
import { generateId } from '@/lib/utils'

export const useTimers = () => {
  const [timers, setTimers] = useState<Timer[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 客戶端載入（避免 SSR hydration 不匹配）
  useEffect(() => {
    const loadedTimers = loadTimers()
    setTimers(loadedTimers)
    setIsLoaded(true)
  }, [])

  // 自動儲存到 localStorage
  useEffect(() => {
    if (isLoaded) {
      saveTimers(timers)
    }
  }, [timers, isLoaded])

  /**
   * 新增計時器
   */
  const addTimer = useCallback((input: TimerInput) => {
    const newTimer: Timer = {
      ...input,
      id: generateId(),
      createdAt: Date.now(),
      remainingTime: input.duration,
      status: 'idle',
    }

    setTimers((prev) => [...prev, newTimer])
    return newTimer.id
  }, [])

  /**
   * 更新計時器
   */
  const updateTimer = useCallback((id: string, updates: Partial<Timer>) => {
    setTimers((prev) => prev.map((timer) => (timer.id === id ? { ...timer, ...updates } : timer)))
  }, [])

  /**
   * 刪除計時器
   */
  const deleteTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((timer) => timer.id !== id))
  }, [])

  /**
   * 重設計時器（恢復到初始狀態）
   */
  const resetTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? {
              ...timer,
              status: 'idle',
              remainingTime: timer.duration,
              startedAt: undefined,
              pausedAt: undefined,
            }
          : timer
      )
    )
  }, [])

  /**
   * 開始計時器
   */
  const startTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id !== id) return timer

        // 如果是從暫停恢復，計算暫停時長並調整 startedAt
        if (timer.status === 'paused' && timer.pausedAt && timer.startedAt) {
          const pausedDuration = Date.now() - timer.pausedAt
          return {
            ...timer,
            status: 'running',
            startedAt: timer.startedAt + pausedDuration,
            pausedAt: undefined,
          }
        }

        // 全新開始
        return {
          ...timer,
          status: 'running',
          startedAt: Date.now(),
          pausedAt: undefined,
        }
      })
    )
  }, [])

  /**
   * 暫停計時器
   */
  const pauseTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? {
              ...timer,
              status: 'paused',
              pausedAt: Date.now(),
            }
          : timer
      )
    )
  }, [])

  /**
   * 完成計時器
   */
  const finishTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id
          ? {
              ...timer,
              status: 'finished',
              remainingTime: 0,
            }
          : timer
      )
    )
  }, [])

  return {
    timers,
    isLoaded,
    addTimer,
    updateTimer,
    deleteTimer,
    resetTimer,
    startTimer,
    pauseTimer,
    finishTimer,
  }
}
