'use client'

import { useState, useCallback, useEffect } from 'react'
import { Bell, Timer as TimerIcon } from 'lucide-react'
import type { Alarm, AlarmInput } from '@/types/alarm'
import type { Timer } from '@/types/timer'
import { useAlarms } from '@/hooks/useAlarms'
import { useAlarmChecker } from '@/hooks/useAlarmChecker'
import { useTimers } from '@/hooks/useTimers'
import { useTimerRunner } from '@/hooks/useTimerRunner'
import { useTimerNotifications } from '@/hooks/useTimerNotifications'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { AlarmList } from '@/components/AlarmList'
import { AlarmForm } from '@/components/AlarmForm'
import { AlarmRinging } from '@/components/AlarmRinging'
import { BatchImport } from '@/components/BatchImport'
import { EarlyNotification } from '@/components/EarlyNotification'
import { TimerList } from '@/components/TimerList'
import { TimerForm } from '@/components/TimerForm'
import { TimerRinging } from '@/components/TimerRinging'
import VolumeControl from '@/components/VolumeControl'
import { loadSettings, saveSettings } from '@/lib/settings-storage'
import { ALARM_SOUND } from '@/types/alarm'

export default function Home() {
  // Tab 切換狀態
  const [activeTab, setActiveTab] = useState<'alarms' | 'timers'>('alarms')

  // 音量狀態
  const [volume, setVolume] = useState(0.5) // 預設 50%

  // 載入音量設定
  useEffect(() => {
    const settings = loadSettings()
    setVolume(settings.volume)
  }, [])

  // 處理音量變更
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume)
    saveSettings({ volume: newVolume })
  }, [])

  // 鬧鈴相關
  const {
    alarms,
    isLoaded,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
  } = useAlarms()

  // 計時器相關
  const {
    timers,
    isLoaded: isTimersLoaded,
    addTimer,
    updateTimer,
    deleteTimer,
    resetTimer,
    startTimer,
    pauseTimer,
    finishTimer,
  } = useTimers()

  // 音效播放器（共用）
  const { play, stop, setVolume: setAudioVolume, resumeAudioContext } = useAudioPlayer(volume)

  // 同步音量到音效播放器
  useEffect(() => {
    setAudioVolume(volume)
  }, [volume, setAudioVolume])

  // 處理測試聲音（僅開發模式）
  const handleTestSound = useCallback(() => {
    resumeAudioContext()
    play(ALARM_SOUND)
  }, [resumeAudioContext, play])

  // 鬧鈴 UI 狀態
  const [showForm, setShowForm] = useState(false)
  const [showBatchImport, setShowBatchImport] = useState(false)
  const [editingAlarm, setEditingAlarm] = useState<Alarm | undefined>()
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | undefined>()
  const [earlyNotificationAlarm, setEarlyNotificationAlarm] = useState<Alarm | undefined>()

  // 計時器 UI 狀態
  const [showTimerForm, setShowTimerForm] = useState(false)
  const [editingTimer, setEditingTimer] = useState<Timer | null>(null)
  const [ringingTimer, setRingingTimer] = useState<Timer | undefined>()

  // 當提前提醒觸發時的處理
  const handleEarlyNotification = useCallback(
    (alarm: Alarm) => {
      setEarlyNotificationAlarm(alarm)
      play(ALARM_SOUND)
    },
    [play]
  )

  // 當鬧鈴觸發時的處理
  const handleAlarmTriggered = useCallback(
    (alarm: Alarm) => {
      // 關閉提前提醒（如果還在顯示）
      setEarlyNotificationAlarm(undefined)
      setRingingAlarm(alarm)
      // 不播放音效（只在提前提醒時播放）
    },
    []
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
    setRingingAlarm(undefined)
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

  // ==================== 計時器處理函數 ====================

  // 當計時器完成時的處理
  const handleTimerFinished = useCallback(
    (id: string) => {
      const timer = timers.find((t) => t.id === id)
      if (!timer) return

      finishTimer(id)
      setRingingTimer(timer)
      play(timer.sound)
    },
    [timers, finishTimer, play]
  )

  // 啟動計時器背景運行
  useTimerRunner({
    timers,
    onTimerFinished: handleTimerFinished,
    updateTimer,
  })

  // 計時器通知（頁面標題閃爍、瀏覽器通知）
  useTimerNotifications({
    isRinging: !!ringingTimer,
    timerName: ringingTimer?.name ?? '',
  })

  // 打開新增計時器表單
  const handleAddTimer = () => {
    setEditingTimer(null)
    setShowTimerForm(true)
  }

  // 打開編輯計時器表單
  const handleEditTimer = (timer: Timer) => {
    setEditingTimer(timer)
    setShowTimerForm(true)
  }

  // 儲存計時器
  const handleSaveTimer = (data: { name: string; duration: number; sound: string }) => {
    if (editingTimer) {
      // 編輯模式
      updateTimer(editingTimer.id, {
        name: data.name,
        duration: data.duration,
        sound: data.sound,
      })
    } else {
      // 新增模式
      addTimer({
        name: data.name,
        duration: data.duration,
        sound: data.sound,
      })
    }
    setShowTimerForm(false)
    setEditingTimer(null)
  }

  // 取消計時器表單
  const handleCancelTimerForm = () => {
    setShowTimerForm(false)
    setEditingTimer(null)
  }

  // 停止計時器提醒
  const handleStopTimer = () => {
    stop()
    setRingingTimer(undefined)
  }

  // 重新開始計時器
  const handleRestartTimer = () => {
    if (ringingTimer) {
      resetTimer(ringingTimer.id)
      startTimer(ringingTimer.id)
    }
    stop()
    setRingingTimer(undefined)
  }

  // 等待載入完成
  if (!isLoaded || !isTimersLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Tab 切換 */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            {/* Tab 按鈕 */}
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('alarms')}
                className={`
                  flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors
                  ${
                    activeTab === 'alarms'
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }
                `}
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span>鬧鈴</span>
              </button>
              <button
                onClick={() => setActiveTab('timers')}
                className={`
                  flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors
                  ${
                    activeTab === 'timers'
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }
                `}
              >
                <TimerIcon className="h-5 w-5" aria-hidden="true" />
                <span>計時器</span>
              </button>
            </div>

            {/* 音量控制和右側操作按鈕 */}
            <div className="flex items-center gap-3">
              <VolumeControl
                volume={volume}
                onChange={handleVolumeChange}
                onInteraction={resumeAudioContext}
                onTestSound={handleTestSound}
              />

              {/* 右側操作按鈕 */}
              <div className="flex gap-2">
                {activeTab === 'alarms' && (
                  <>
                    <button
                      onClick={handleBatchImport}
                      className="rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      批次匯入
                    </button>
                    <button
                      onClick={handleAdd}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      + 新增鬧鈴
                    </button>
                  </>
                )}
                {activeTab === 'timers' && (
                  <button
                    onClick={handleAddTimer}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    + 新增計時器
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 內容區域 */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* 鬧鈴列表 */}
        {activeTab === 'alarms' && (
          <AlarmList
            alarms={alarms}
            onToggle={toggleAlarm}
            onEdit={handleEdit}
            onDelete={deleteAlarm}
            onAdd={handleAdd}
            onBatchImport={handleBatchImport}
          />
        )}

        {/* 計時器列表 */}
        {activeTab === 'timers' && (
          <TimerList
            timers={timers}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
            onEdit={handleEditTimer}
            onDelete={deleteTimer}
          />
        )}
      </div>

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
        />
      )}

      {/* 計時器表單 */}
      {showTimerForm && (
        <TimerForm
          timer={editingTimer}
          onSave={handleSaveTimer}
          onCancel={handleCancelTimerForm}
        />
      )}

      {/* 計時器完成提醒 */}
      {ringingTimer && (
        <TimerRinging
          timer={ringingTimer}
          onStop={handleStopTimer}
          onRestart={handleRestartTimer}
        />
      )}
    </div>
  )
}
