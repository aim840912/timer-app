import type { Alarm, CurrentTime } from '@/types/alarm'

/**
 * 檢查鬧鈴是否應該響起
 */
export const shouldRing = (alarm: Alarm, current: CurrentTime): boolean => {
  // 檢查是否已啟用
  if (!alarm.enabled) return false

  // 檢查是否在貪睡延後時間內
  if (alarm.snoozedUntil && current.timestamp < alarm.snoozedUntil) {
    return false
  }

  // 檢查時間是否匹配
  if (alarm.time.hour !== current.hour || alarm.time.minute !== current.minute) {
    return false
  }

  // 檢查重複設定
  switch (alarm.repeat.type) {
    case 'once':
      return true // 一次性鬧鈴
    case 'daily':
      return true // 每天
    case 'weekdays':
      return current.day >= 1 && current.day <= 5 // 週一到週五
    case 'custom':
      return alarm.repeat.days?.includes(current.day) ?? false
    default:
      return false
  }
}

/**
 * 取得當前時間資訊
 */
export const getCurrentTime = (): CurrentTime => {
  const now = new Date()
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    day: now.getDay(), // 0-6 (週日-週六)
    timestamp: now.getTime(),
  }
}

/**
 * 格式化時間為顯示字串 (HH:MM)
 */
export const formatTime = (hour: number, minute: number): string => {
  const h = hour.toString().padStart(2, '0')
  const m = minute.toString().padStart(2, '0')
  return `${h}:${m}`
}

/**
 * 格式化時間為 12 小時制 (h:MM AM/PM)
 */
export const formatTime12Hour = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 || 12
  const m = minute.toString().padStart(2, '0')
  return `${h}:${m} ${period}`
}

/**
 * 取得重複類型的顯示文字
 */
export const getRepeatText = (repeat: Alarm['repeat']): string => {
  switch (repeat.type) {
    case 'once':
      return '一次'
    case 'daily':
      return '每天'
    case 'weekdays':
      return '週一至週五'
    case 'custom':
      if (!repeat.days || repeat.days.length === 0) return '自訂'
      return formatWeekdays(repeat.days)
    default:
      return '未知'
  }
}

/**
 * 格式化星期幾陣列為顯示文字
 */
export const formatWeekdays = (days: number[]): string => {
  const dayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
  const sortedDays = [...days].sort((a, b) => a - b)
  return sortedDays.map((d) => dayNames[d]).join('、')
}

/**
 * 生成唯一 ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 計算貪睡後的時間戳記
 */
export const calculateSnoozeTime = (minutes: number): number => {
  return Date.now() + minutes * 60 * 1000
}

/**
 * 檢查鬧鈴是否在貪睡中
 */
export const isSnoozing = (alarm: Alarm): boolean => {
  if (!alarm.snoozedUntil) return false
  return Date.now() < alarm.snoozedUntil
}

/**
 * 檢查是否應該發送提前提醒
 */
export const shouldSendEarlyNotification = (
  alarm: Alarm,
  current: CurrentTime
): boolean => {
  // 檢查是否已啟用
  if (!alarm.enabled) return false

  // 檢查是否啟用提前提醒
  if (!alarm.earlyNotification.enabled) return false

  // 檢查是否在貪睡延後時間內
  if (alarm.snoozedUntil && current.timestamp < alarm.snoozedUntil) {
    return false
  }

  // 計算提前提醒的目標時間
  const targetTime = new Date()
  targetTime.setHours(alarm.time.hour, alarm.time.minute, 0, 0)

  // 減去提前提醒的分鐘數
  const earlyTime = new Date(targetTime.getTime() - alarm.earlyNotification.minutesBefore * 60 * 1000)

  // 檢查提前提醒時間是否匹配
  if (earlyTime.getHours() !== current.hour || earlyTime.getMinutes() !== current.minute) {
    return false
  }

  // 檢查重複設定（與正式鬧鈴使用相同的邏輯）
  switch (alarm.repeat.type) {
    case 'once':
      return true // 一次性鬧鈴
    case 'daily':
      return true // 每天
    case 'weekdays':
      return current.day >= 1 && current.day <= 5 // 週一到週五
    case 'custom':
      return alarm.repeat.days?.includes(current.day) ?? false
    default:
      return false
  }
}

/**
 * 取得下次鬧鈴時間的描述
 */
export const getNextAlarmText = (alarm: Alarm): string => {
  const now = new Date()
  const alarmTime = new Date()
  alarmTime.setHours(alarm.time.hour, alarm.time.minute, 0, 0)

  // 如果鬧鈴時間已過，計算到明天
  if (alarmTime <= now) {
    alarmTime.setDate(alarmTime.getDate() + 1)
  }

  const diff = alarmTime.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days} 天後`
  } else if (hours > 0) {
    return `${hours} 小時 ${minutes} 分鐘後`
  } else {
    return `${minutes} 分鐘後`
  }
}
