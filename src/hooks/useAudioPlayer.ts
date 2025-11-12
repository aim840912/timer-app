'use client'

import { useCallback, useRef } from 'react'
import { Howl } from 'howler'

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
      // 停止現有音效
      if (isPlayingRef.current) {
        stop()
      }

      // 建立新的 Howl 實例
      const sound = new Howl({
        src: [`/sounds/${soundFile}`],
        loop: false, // 播放一次後停止
        volume: 0.7, // 預設音量 70%
        onloaderror: (id, error) => {
          console.error(`音效載入失敗 (${soundFile}):`, error)
          isPlayingRef.current = false
        },
        onplayerror: (id, error) => {
          console.error(`音效播放失敗 (${soundFile}):`, error)
          isPlayingRef.current = false
        },
      })

      currentSoundRef.current = sound
      isPlayingRef.current = true

      // 播放音效
      sound.play()
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
