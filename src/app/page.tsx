'use client'

import { useState, useCallback } from 'react'
import type { Alarm, AlarmInput } from '@/types/alarm'
import { useAlarms } from '@/hooks/useAlarms'
import { useAlarmChecker } from '@/hooks/useAlarmChecker'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { AlarmList } from '@/components/AlarmList'
import { AlarmForm } from '@/components/AlarmForm'
import { AlarmRinging } from '@/components/AlarmRinging'
import { BatchImport } from '@/components/BatchImport'
import { EarlyNotification } from '@/components/EarlyNotification'
import { ALARM_SOUNDS } from '@/types/alarm'

export default function Home() {
  const {
    alarms,
    isLoaded,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    snoozeAlarm,
  } = useAlarms()

  const { play, stop } = useAudioPlayer()

  const [showForm, setShowForm] = useState(false)
  const [showBatchImport, setShowBatchImport] = useState(false)
  const [editingAlarm, setEditingAlarm] = useState<Alarm | undefined>()
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | undefined>()
  const [earlyNotificationAlarm, setEarlyNotificationAlarm] = useState<Alarm | undefined>()

  // 當提前提醒觸發時的處理
  const handleEarlyNotification = useCallback(
    (alarm: Alarm) => {
      setEarlyNotificationAlarm(alarm)
      play(ALARM_SOUNDS.GENTLE)
    },
    [play]
  )

  // 當鬧鈴觸發時的處理
  const handleAlarmTriggered = useCallback(
    (alarm: Alarm) => {
      // 關閉提前提醒（如果還在顯示）
      setEarlyNotificationAlarm(undefined)
      setRingingAlarm(alarm)
      play(alarm.sound)
    },
    [play]
  )

  // 關閉提前提醒
  const handleDismissEarlyNotification = () => {
    stop()
    setEarlyNotificationAlarm(undefined)
  }

  // 啟動背景檢查
  useAlarmChecker({
    alarms,
    onAlarmTriggered: handleAlarmTriggered,
    onEarlyNotification: handleEarlyNotification,
  })

  // 打開新增表單
  const handleAdd = () => {
    setEditingAlarm(undefined)
    setShowForm(true)
  }

  // 打開編輯表單
  const handleEdit = (alarm: Alarm) => {
    setEditingAlarm(alarm)
    setShowForm(true)
  }

  // 儲存鬧鈴
  const handleSave = (input: AlarmInput) => {
    if (editingAlarm) {
      // 編輯模式
      updateAlarm(editingAlarm.id, input)
    } else {
      // 新增模式
      addAlarm(input)
    }
    setShowForm(false)
    setEditingAlarm(undefined)
  }

  // 取消表單
  const handleCancel = () => {
    setShowForm(false)
    setEditingAlarm(undefined)
  }

  // 停止鬧鈴
  const handleStopAlarm = () => {
    stop()
    setRingingAlarm(undefined)
  }

  // 貪睡
  const handleSnooze = (minutes: number) => {
    if (ringingAlarm) {
      snoozeAlarm(ringingAlarm.id, minutes)
      stop()
      setRingingAlarm(undefined)
    }
  }

  // 打開批次匯入
  const handleBatchImport = () => {
    setShowBatchImport(true)
  }

  // 處理批次匯入
  const handleBatchImportConfirm = (alarmsToImport: AlarmInput[]) => {
    // 批次新增所有鬧鈴
    alarmsToImport.forEach((alarmInput) => {
      addAlarm(alarmInput)
    })
    setShowBatchImport(false)
  }

  // 取消批次匯入
  const handleBatchImportCancel = () => {
    setShowBatchImport(false)
  }

  // 等待載入完成
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* 鬧鈴列表 */}
      <AlarmList
        alarms={alarms}
        onToggle={toggleAlarm}
        onEdit={handleEdit}
        onDelete={deleteAlarm}
        onAdd={handleAdd}
        onBatchImport={handleBatchImport}
      />

      {/* 新增/編輯表單 */}
      {showForm && (
        <AlarmForm alarm={editingAlarm} onSave={handleSave} onCancel={handleCancel} />
      )}

      {/* 批次匯入 */}
      {showBatchImport && (
        <BatchImport
          onImport={handleBatchImportConfirm}
          onCancel={handleBatchImportCancel}
        />
      )}

      {/* 提前提醒 */}
      {earlyNotificationAlarm && (
        <EarlyNotification alarm={earlyNotificationAlarm} onDismiss={handleDismissEarlyNotification} />
      )}

      {/* 鬧鈴響起畫面 */}
      {ringingAlarm && (
        <AlarmRinging
          alarm={ringingAlarm}
          onStop={handleStopAlarm}
          onSnooze={handleSnooze}
        />
      )}
    </div>
  )
}
