import type { Alarm } from '@/types/alarm'
import { logger } from '@/lib/utils'

const STORAGE_KEY = 'alarms'

/**
 * 從 LocalStorage 載入所有鬧鈴
 */
export const loadAlarms = (): Alarm[] => {
  if (typeof window === 'undefined') return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const alarms: Alarm[] = JSON.parse(data)

    // 資料遷移：為舊資料補上 earlyNotification 欄位並修復音效檔名
    return alarms.map((alarm) => ({
      ...alarm,
      sound: 'sound-bell.mp3', // 統一使用固定音效
      earlyNotification: alarm.earlyNotification ?? {
        enabled: true,
        minutesBefore: 3,
      },
    }))
  } catch (error) {
    logger.error('載入鬧鈴失敗:', error)
    return []
  }
}

/**
 * 儲存所有鬧鈴到 LocalStorage
 */
export const saveAlarms = (alarms: Alarm[]): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms))
  } catch (error) {
    logger.error('儲存鬧鈴失敗:', error)
  }
}

/**
 * 清除所有鬧鈴資料
 */
export const clearAlarms = (): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    logger.error('清除鬧鈴失敗:', error)
  }
}
