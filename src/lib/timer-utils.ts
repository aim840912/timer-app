import type { Timer } from '@/types/timer'

/**
 * 格式化秒數為 HH:MM:SS 或 MM:SS
 */
export const formatTimerTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

/**
 * 格式化秒數為簡短文字（例：25 分鐘、1 小時 30 分）
 */
export const formatDurationText = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours} 小時 ${minutes} 分鐘`
    }
    return `${hours} 小時`
  }

  if (minutes > 0) {
    if (secs > 0) {
      return `${minutes} 分鐘 ${secs} 秒`
    }
    return `${minutes} 分鐘`
  }

  return `${secs} 秒`
}


/**
 * 計算進度百分比（0-100）
 */
export const calculateProgress = (timer: Timer): number => {
  if (timer.duration === 0) return 0
  const elapsed = timer.duration - timer.remainingTime
  return Math.min(100, Math.max(0, (elapsed / timer.duration) * 100))
}

/**
 * 驗證計時器時間輸入
 */
export const validateTimerInput = (hours: number, minutes: number, seconds: number): boolean => {
  // 檢查範圍
  if (hours < 0 || hours > 23) return false
  if (minutes < 0 || minutes > 59) return false
  if (seconds < 0 || seconds > 59) return false

  // 至少要有 1 秒
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  if (totalSeconds < 1) return false

  return true
}

/**
 * 將時/分/秒轉換為總秒數
 */
export const convertToSeconds = (hours: number, minutes: number, seconds: number): number => {
  return hours * 3600 + minutes * 60 + seconds
}

/**
 * 將總秒數轉換為時/分/秒
 */
export const convertFromSeconds = (
  totalSeconds: number
): { hours: number; minutes: number; seconds: number } => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return { hours, minutes, seconds }
}

/**
 * 檢查計時器是否已完成
 */
export const isTimerFinished = (timer: Timer): boolean => {
  return timer.status === 'finished' || timer.remainingTime <= 0
}

/**
 * 檢查計時器是否正在執行
 */
export const isTimerRunning = (timer: Timer): boolean => {
  return timer.status === 'running'
}

/**
 * 檢查計時器是否暫停中
 */
export const isTimerPaused = (timer: Timer): boolean => {
  return timer.status === 'paused'
}
