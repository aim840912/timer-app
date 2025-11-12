import type { Alarm } from '@/types/alarm'

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

    // 資料遷移：為舊資料補上 earlyNotification 欄位
    return alarms.map((alarm) => ({
      ...alarm,
      earlyNotification: alarm.earlyNotification ?? {
        enabled: true,
        minutesBefore: 3,
      },
    }))
  } catch (error) {
    console.error('載入鬧鈴失敗:', error)
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
    console.error('儲存鬧鈴失敗:', error)
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
    console.error('清除鬧鈴失敗:', error)
  }
}
