/**
 * 鬧鈴資料結構
 */
export interface Alarm {
  /** 唯一識別碼 (UUID) */
  id: string

  /** 鬧鈴時間 */
  time: {
    /** 小時 (0-23) */
    hour: number
    /** 分鐘 (0-59) */
    minute: number
  }

  /** 是否啟用 */
  enabled: boolean

  /** 鬧鈴標籤/名稱 */
  label: string

  /** 重複設定 */
  repeat: {
    /** 重複類型 */
    type: 'once' | 'daily' | 'weekdays' | 'custom'
    /** 自訂星期幾 (0-6, 週日-週六) */
    days?: number[]
  }

  /** 音效檔案名稱 */
  sound: string

  /** 建立時間戳記 */
  createdAt: number

  /** 貪睡延後至此時間戳記 */
  snoozedUntil?: number

  /** 提前提醒設定 */
  earlyNotification: {
    /** 是否啟用提前提醒 */
    enabled: boolean
    /** 提前幾分鐘提醒 (3, 5, 或 10) */
    minutesBefore: number
  }
}

/**
 * 新增鬧鈴的輸入資料 (不需要 id 和 createdAt)
 */
export type AlarmInput = Omit<Alarm, 'id' | 'createdAt'>

/**
 * 當前時間資訊 (用於比對鬧鈴時間)
 */
export interface CurrentTime {
  hour: number
  minute: number
  day: number
  timestamp: number
}

/**
 * 可用的鬧鈴音效
 */
export const ALARM_SOUNDS = {
  DEFAULT: 'alarm-default.mp3',
  GENTLE: 'alarm-gentle.mp3',
  CLASSIC: 'alarm-classic.mp3',
} as const

export type AlarmSoundType = typeof ALARM_SOUNDS[keyof typeof ALARM_SOUNDS]
