'use client'

import { useCallback, useRef } from 'react'
import { Howl } from 'howler'
import { getAssetPath } from '@/lib/asset-path'

export const useAudioPlayer = () => {
  const currentSoundRef = useRef<Howl | null>(null)
  const isPlayingRef = useRef<boolean>(false)

  /**
   * 停止播放音效
   */
  const stop = useCallback(() => {
    if (currentSoundRef.current) {
      currentSoundRef.current.stop()
      currentSoundRef.current.unload()
      currentSoundRef.current = null
    }
    isPlayingRef.current = false
  }, [])

  /**
   * 播放鬧鈴音效
   */
  const play = useCallback(
    (soundFile: string) => {
      console.log('[Audio] 嘗試播放:', soundFile)

      // 停止現有音效
      if (isPlayingRef.current) {
        console.log('[Audio] 停止現有音效')
        stop()
      }

      // 建立新的 Howl 實例
      const assetPath = getAssetPath(`/sounds/${soundFile}`)
      console.log('[Audio] 完整路徑:', assetPath)

      const sound = new Howl({
        src: [assetPath],
        loop: false, // 播放一次後停止
        volume: 1.0, // 音量 100%（從 0.7 提高）
        onload: () => {
          console.log('[Audio] 音效載入成功')
        },
        onplay: () => {
          console.log('[Audio] 開始播放')
        },
        onend: () => {
          console.log('[Audio] 播放結束')
          isPlayingRef.current = false
        },
        onloaderror: (id, error) => {
          console.error(`[Audio] 載入失敗 (${soundFile}):`, error)
          isPlayingRef.current = false
        },
        onplayerror: (id, error) => {
          console.error(`[Audio] 播放失敗 (${soundFile}):`, error)
          isPlayingRef.current = false
        },
      })

      currentSoundRef.current = sound
      isPlayingRef.current = true

      // 播放音效
      const playPromise = sound.play()
      console.log('[Audio] play() 已呼叫, playPromise:', playPromise)
    },
    [stop]
  )

  /**
   * 設定音量 (0.0 - 1.0)
   */
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    if (currentSoundRef.current) {
      currentSoundRef.current.volume(clampedVolume)
    }
  }, [])

  /**
   * 檢查是否正在播放
   */
  const isPlaying = useCallback((): boolean => {
    return isPlayingRef.current
  }, [])

  return {
    play,
    stop,
    setVolume,
    isPlaying,
  }
}
