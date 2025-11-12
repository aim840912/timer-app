import type { AlarmInput } from '@/types/alarm'
import { ALARM_SOUNDS } from '@/types/alarm'

/**
 * 解析活動時間表的單行文字
 * 格式：【活動名稱】HH:MM／HH:MM／HH:MM
 */
export interface ParsedActivity {
  name: string
  times: Array<{ hour: number; minute: number }>
  originalLine: string
}

/**
 * 解析結果
 */
export interface ParseResult {
  success: boolean
  activities: ParsedActivity[]
  alarms: AlarmInput[]
  errors: string[]
}

/**
 * 解析單行活動時間表
 */
function parseActivityLine(line: string): ParsedActivity | null {
  // 移除空白
  const trimmed = line.trim()
  if (!trimmed) return null

  // 解析格式：【活動名稱】時間1／時間2／時間3
  const match = trimmed.match(/^【(.+?)】(.+)$/)
  if (!match) return null

  const name = match[1].trim()
  const timesStr = match[2]

  // 分割時間（支援／和/）
  const timeTokens = timesStr.split(/[／\/]/).map((t) => t.trim())

  const times: Array<{ hour: number; minute: number }> = []

  for (const timeStr of timeTokens) {
    // 解析時間格式 HH:MM 或 H:MM
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/)
    if (!timeMatch) continue

    const hour = parseInt(timeMatch[1], 10)
    const minute = parseInt(timeMatch[2], 10)

    // 驗證時間範圍
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      continue
    }

    times.push({ hour, minute })
  }

  if (times.length === 0) return null

  return {
    name,
    times,
    originalLine: line,
  }
}

/**
 * 將 ParsedActivity 轉換為 AlarmInput
 */
function activityToAlarms(activity: ParsedActivity): AlarmInput[] {
  return activity.times.map((time) => ({
    time,
    enabled: true,
    label: activity.name,
    repeat: {
      type: 'daily' as const,
    },
    sound: ALARM_SOUNDS.DEFAULT,
    earlyNotification: {
      enabled: true,
      minutesBefore: 3,
    },
  }))
}

/**
 * 解析完整的活動時間表文字
 */
export function parseActivityText(text: string): ParseResult {
  const lines = text.split('\n')
  const activities: ParsedActivity[] = []
  const errors: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // 跳過空行

    const activity = parseActivityLine(line)
    if (activity) {
      activities.push(activity)
    } else {
      errors.push(`第 ${i + 1} 行解析失敗: ${line}`)
    }
  }

  // 將所有活動轉換為鬧鈴
  const alarms: AlarmInput[] = []
  for (const activity of activities) {
    alarms.push(...activityToAlarms(activity))
  }

  return {
    success: errors.length === 0,
    activities,
    alarms,
    errors,
  }
}

/**
 * 格式化時間為顯示字串
 */
export function formatActivityTime(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

/**
 * 取得活動統計資訊
 */
export function getActivityStats(activities: ParsedActivity[]): {
  totalActivities: number
  totalAlarms: number
  activityBreakdown: Array<{ name: string; count: number }>
} {
  const totalActivities = activities.length
  const totalAlarms = activities.reduce((sum, activity) => sum + activity.times.length, 0)

  const activityBreakdown = activities.map((activity) => ({
    name: activity.name,
    count: activity.times.length,
  }))

  return {
    totalActivities,
    totalAlarms,
    activityBreakdown,
  }
}
