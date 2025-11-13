'use client'

import { Bell, Timer as TimerIcon } from 'lucide-react'
import VolumeControl from '@/components/VolumeControl'

type TabType = 'alarms' | 'timers'

interface AppHeaderProps {
  /** 當前啟用的 Tab */
  activeTab: TabType
  /** Tab 切換回調 */
  onTabChange: (tab: TabType) => void
  /** 音量大小 (0.0 - 1.0) */
  volume: number
  /** 音量變更回調 */
  onVolumeChange: (volume: number) => void
  /** AudioContext 互動回調 */
  onAudioInteraction: () => void
  /** 測試聲音回調（僅開發模式） */
  onTestSound?: () => void
  /** 右側操作按鈕 */
  rightActions?: React.ReactNode
}

export default function AppHeader({
  activeTab,
  onTabChange,
  volume,
  onVolumeChange,
  onAudioInteraction,
  onTestSound,
  rightActions,
}: AppHeaderProps) {
  const isAlarmsActive = activeTab === 'alarms'
  const isTimersActive = activeTab === 'timers'

  return (
    <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between">
          {/* Tab 按鈕 */}
          <div className="flex gap-1">
            <button
              onClick={() => onTabChange('alarms')}
              className={`
                flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors
                ${
                  isAlarmsActive
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }
              `}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span>鬧鈴</span>
            </button>
            <button
              onClick={() => onTabChange('timers')}
              className={`
                flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors
                ${
                  isTimersActive
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
              onChange={onVolumeChange}
              onInteraction={onAudioInteraction}
              onTestSound={onTestSound}
            />

            {/* 右側操作按鈕 */}
            {rightActions && <div className="flex gap-2">{rightActions}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
