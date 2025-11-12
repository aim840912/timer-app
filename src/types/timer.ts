/**
 * 計時器狀態
 */
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

/**
 * 計時器介面
 */
export interface Timer {
  id: string
  name: string // 計時器名稱（例：「番茄鐘」）
  duration: number // 總時長（秒）
  remainingTime: number // 剩餘時間（秒）
  status: TimerStatus
  sound: string // 音效檔案
  createdAt: number
  startedAt?: number // 開始時間戳記（用於精確計算）
  pausedAt?: number // 暫停時間戳記
}

/**
 * 計時器預設範本
 */
export interface TimerPreset {
  name: string
  duration: number // 秒
  icon?: string
}

/**
 * 計時器輸入（新增時使用）
 */
export type TimerInput = Omit<Timer, 'id' | 'createdAt' | 'remainingTime' | 'status'>

/**
 * 常用計時器預設
 */
export const TIMER_PRESETS: TimerPreset[] = [
  { name: '番茄鐘', duration: 25 * 60 }, // 25 分鐘
  { name: '短休息', duration: 5 * 60 }, // 5 分鐘
  { name: '長休息', duration: 15 * 60 }, // 15 分鐘
  { name: '10 分鐘', duration: 10 * 60 },
  { name: '30 分鐘', duration: 30 * 60 },
  { name: '1 小時', duration: 60 * 60 },
]

/**
 * 計時器音效（固定使用輕快鐘聲）
 */
export const TIMER_SOUND = 'sound-bell.mp3'
