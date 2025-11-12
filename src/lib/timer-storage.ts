import type { Timer } from '@/types/timer'

const STORAGE_KEY = 'timers'

/**
 * 從 localStorage 載入計時器列表
 */
export const loadTimers = (): Timer[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const timers = JSON.parse(stored) as Timer[]

    // 重置所有計時器狀態（避免頁面關閉後狀態不一致）並修復音效檔名
    return timers.map((timer) => ({
      ...timer,
      sound: 'sound-bell.mp3', // 統一使用固定音效
      status: 'idle',
      remainingTime: timer.duration,
      startedAt: undefined,
      pausedAt: undefined,
    }))
  } catch (error) {
    console.error('載入計時器失敗:', error)
    return []
  }
}

/**
 * 儲存計時器列表到 localStorage
 */
export const saveTimers = (timers: Timer[]): void => {
  if (typeof window === 'undefined') return

  try {
    // 只儲存範本資訊，不儲存執行狀態
    const timersToSave = timers.map((timer) => ({
      ...timer,
      status: 'idle' as const,
      remainingTime: timer.duration,
      startedAt: undefined,
      pausedAt: undefined,
    }))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(timersToSave))
  } catch (error) {
    console.error('儲存計時器失敗:', error)
  }
}

/**
 * 清除所有計時器
 */
export const clearTimers = (): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('清除計時器失敗:', error)
  }
}
