'use client'

import { useEffect, useCallback, useRef } from 'react'
import type { Alarm } from '@/types/alarm'
import { shouldRing, shouldSendEarlyNotification, getCurrentTime } from '@/lib/alarm-utils'

interface UseAlarmCheckerProps {
  alarms: Alarm[]
  onAlarmTriggered: (alarm: Alarm) => void
  onEarlyNotification?: (alarm: Alarm) => void
}

export const useAlarmChecker = ({
  alarms,
  onAlarmTriggered,
  onEarlyNotification,
}: UseAlarmCheckerProps) => {
  // 記錄已經觸發過的鬧鈴 (在同一分鐘內不重複觸發)
  const triggeredAlarmsRef = useRef<Set<string>>(new Set())
  // 記錄已經發送過提前提醒的鬧鈴
  const earlyNotifiedAlarmsRef = useRef<Set<string>>(new Set())
  const lastMinuteRef = useRef<number>(-1)

  /**
   * 檢查所有鬧鈴
   */
  const checkAlarms = useCallback(() => {
    const current = getCurrentTime()

    // 如果分鐘改變了，清除已觸發記錄
    if (current.minute !== lastMinuteRef.current) {
      triggeredAlarmsRef.current.clear()
      earlyNotifiedAlarmsRef.current.clear()
      lastMinuteRef.current = current.minute
    }

    // 檢查每個鬧鈴
    alarms.forEach((alarm) => {
      // 檢查提前提醒
      if (
        onEarlyNotification &&
        !earlyNotifiedAlarmsRef.current.has(alarm.id) &&
        shouldSendEarlyNotification(alarm, current)
      ) {
        // 標記為已發送提前提醒
        earlyNotifiedAlarmsRef.current.add(alarm.id)
        // 觸發提前提醒回調
        onEarlyNotification(alarm)
      }

      // 檢查正式鬧鈴
      // 如果這個鬧鈴已經在本分鐘內觸發過，跳過
      if (triggeredAlarmsRef.current.has(alarm.id)) {
        return
      }

      // 如果已發送提前提醒且啟用提前提醒，跳過正式鬧鈴
      if (
        alarm.earlyNotification.enabled &&
        earlyNotifiedAlarmsRef.current.has(alarm.id)
      ) {
        return
      }

      // 檢查是否應該響起
      if (shouldRing(alarm, current)) {
        // 標記為已觸發
        triggeredAlarmsRef.current.add(alarm.id)
        // 觸發回調
        onAlarmTriggered(alarm)
      }
    })
  }, [alarms, onAlarmTriggered, onEarlyNotification])

  /**
   * 啟動背景檢查
   */
  useEffect(() => {
    // 立即檢查一次
    checkAlarms()

    // 每秒檢查一次
    const interval = setInterval(checkAlarms, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [checkAlarms])

  /**
   * 手動觸發檢查（用於測試）
   */
  const triggerCheck = useCallback(() => {
    checkAlarms()
  }, [checkAlarms])

  return {
    triggerCheck,
  }
}
