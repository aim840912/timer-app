'use client'

import { Volume, Volume1, Volume2, VolumeX, Play } from 'lucide-react'

interface VolumeControlProps {
  /** 音量大小 (0.0 - 1.0) */
  volume: number
  /** 音量變更回調 */
  onChange: (volume: number) => void
  /** 用戶互動回調（用於啟動 AudioContext） */
  onInteraction?: () => void
  /** 測試聲音回調（僅開發模式） */
  onTestSound?: () => void
}

export default function VolumeControl({ volume, onChange, onInteraction, onTestSound }: VolumeControlProps) {
  // 將 0-1 轉換為 0-100 顯示
  const displayVolume = Math.round(volume * 100)

  // 根據音量大小選擇圖示
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.33 ? Volume : volume < 0.66 ? Volume1 : Volume2

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 啟動 AudioContext（解決 autoplay 限制）
    onInteraction?.()

    const newVolume = parseInt(e.target.value, 10) / 100
    onChange(newVolume)
  }

  return (
    <div className="flex items-center gap-2">
      <VolumeIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-label="音量" />
      <input
        type="range"
        min="0"
        max="100"
        value={displayVolume}
        onChange={handleChange}
        className="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${displayVolume}%, rgb(229 231 235) ${displayVolume}%, rgb(229 231 235) 100%)`,
        }}
        aria-label={`調整音量: ${displayVolume}%`}
      />
      <span className="w-10 text-right text-sm text-gray-700 dark:text-gray-300">{displayVolume}%</span>

      {/* 測試聲音按鈕（僅開發模式） */}
      {process.env.NODE_ENV === 'development' && onTestSound && (
        <button
          onClick={onTestSound}
          className="rounded-md bg-blue-100 p-1.5 text-blue-600 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          aria-label="測試聲音"
          title="測試聲音"
        >
          <Play className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
