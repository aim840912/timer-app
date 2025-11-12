'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Alarm, AlarmInput } from '@/types/alarm'
import { loadAlarms, saveAlarms } from '@/lib/alarm-storage'
import { generateId } from '@/lib/alarm-utils'

export const useAlarms = () => {
  // 初始狀態始終為空陣列，避免 SSR hydration 不匹配
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 在客戶端 mount 後載入資料
  // 這是必要的，以避免 SSR hydration 不匹配
  useEffect(() => {
    const loadedAlarms = loadAlarms()
    setAlarms(loadedAlarms)
    setIsLoaded(true)
  }, [])

  // 當鬧鈴變更時儲存到 LocalStorage
  useEffect(() => {
    if (isLoaded) {
      saveAlarms(alarms)
    }
  }, [alarms, isLoaded])

  /**
   * 新增鬧鈴
   */
  const addAlarm = useCallback((input: AlarmInput): Alarm => {
    const newAlarm: Alarm = {
      ...input,
      id: generateId(),
      createdAt: Date.now(),
    }

    setAlarms((prev) => [...prev, newAlarm])
    return newAlarm
  }, [])

  /**
   * 更新鬧鈴
   */
  const updateAlarm = useCallback((id: string, updates: Partial<Alarm>): void => {
    setAlarms((prev) =>
      prev.map((alarm) => (alarm.id === id ? { ...alarm, ...updates } : alarm))
    )
  }, [])

  /**
   * 刪除鬧鈴
   */
  const deleteAlarm = useCallback((id: string): void => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id))
  }, [])

  /**
   * 切換鬧鈴啟用狀態
   */
  const toggleAlarm = useCallback((id: string): void => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    )
  }, [])

  /**
   * 取得單個鬧鈴
   */
  const getAlarm = useCallback(
    (id: string): Alarm | undefined => {
      return alarms.find((alarm) => alarm.id === id)
    },
    [alarms]
  )

  /**
   * 取得已啟用的鬧鈴
   */
  const getEnabledAlarms = useCallback((): Alarm[] => {
    return alarms.filter((alarm) => alarm.enabled)
  }, [alarms])

  /**
   * 清除所有鬧鈴
   */
  const clearAll = useCallback((): void => {
    setAlarms([])
  }, [])

  return {
    alarms,
    isLoaded,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    getAlarm,
    getEnabledAlarms,
    clearAll,
  }
}
