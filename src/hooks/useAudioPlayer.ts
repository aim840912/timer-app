'use client'

import { useCallback, useRef } from 'react'
import { Howl, Howler } from 'howler'
import { getAssetPath } from '@/lib/asset-path'
import { logger } from '@/lib/utils'

export const useAudioPlayer = (initialVolume: number = 1.0) => {
  const currentSoundRef = useRef<Howl | null>(null)
  const isPlayingRef = useRef<boolean>(false)
  const volumeRef = useRef<number>(initialVolume)

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
      logger.log('[Audio] 嘗試播放:', soundFile)

      // 停止現有音效
      if (isPlayingRef.current) {
        logger.log('[Audio] 停止現有音效')
        stop()
      }

      // 建立新的 Howl 實例
      const assetPath = getAssetPath(`/sounds/${soundFile}`)
      logger.log('[Audio] 完整路徑:', assetPath)

      const sound = new Howl({
        src: [assetPath],
        loop: false, // 播放一次後停止
        volume: volumeRef.current, // 使用當前設定的音量
        onload: () => {
          logger.log('[Audio] 音效載入成功')
        },
        onplay: () => {
          logger.log('[Audio] 開始播放')
        },
        onend: () => {
          logger.log('[Audio] 播放結束')
          isPlayingRef.current = false
        },
        onloaderror: (id, error) => {
          logger.error(`[Audio] 載入失敗 (${soundFile}):`, error)
          isPlayingRef.current = false
        },
        onplayerror: (id, error) => {
          logger.error(`[Audio] 播放失敗 (${soundFile}):`, error)
          isPlayingRef.current = false
        },
      })

      currentSoundRef.current = sound
      isPlayingRef.current = true

      // 播放音效
      const playPromise = sound.play()
      logger.log('[Audio] play() 已呼叫, playPromise:', playPromise)
    },
    [stop]
  )

  /**
   * 設定音量 (0.0 - 1.0)
   */
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    volumeRef.current = clampedVolume
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

  /**
   * 恢復 AudioContext（解決瀏覽器 autoplay 限制）
   */
  const resumeAudioContext = useCallback(() => {
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      logger.log('[Audio] Resuming AudioContext')
      Howler.ctx.resume()
    }
  }, [])

  return {
    play,
    stop,
    setVolume,
    isPlaying,
    resumeAudioContext,
  }
}
