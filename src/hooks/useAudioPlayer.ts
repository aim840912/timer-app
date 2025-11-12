'use client'

import { useCallback, useRef } from 'react'

export const useAudioPlayer = () => {
  const audioContextRef = useRef<AudioContext | null>(null)
  const isPlayingRef = useRef<boolean>(false)
  const stopCallbackRef = useRef<(() => void) | null>(null)

  /**
   * 初始化 AudioContext（需要用戶互動後才能建立）
   */
  const getAudioContext = useCallback((): AudioContext => {
    if (!audioContextRef.current) {
      // @ts-expect-error - webkitAudioContext 是舊版 Safari 的相容性屬性
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      audioContextRef.current = new AudioContextClass()
    }
    return audioContextRef.current
  }, [])

  /**
   * 播放漸強音調模式
   */
  const playGentleRise = useCallback(
    (startFreq: number, endFreq: number, duration: number) => {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'sine'

      // 頻率從低到高漸變
      oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime)
      oscillator.frequency.linearRampToValueAtTime(
        endFreq,
        ctx.currentTime + duration
      )

      // 音量由小漸大
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + duration * 0.5)
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)

      setTimeout(() => {
        isPlayingRef.current = false
      }, duration * 1000)

      // 設定停止回調
      stopCallbackRef.current = () => {
        oscillator.stop()
        isPlayingRef.current = false
      }
    },
    [getAudioContext]
  )

  /**
   * 播放持續循環的鬧鐘音效
   */
  const playLoopingAlarm = useCallback(
    (frequency: number, pattern: 'fast' | 'slow') => {
      const ctx = getAudioContext()
      const beepDuration = pattern === 'fast' ? 0.15 : 0.3
      const interval = pattern === 'fast' ? 0.25 : 0.5

      const playBeep = () => {
        if (!isPlayingRef.current) return

        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.frequency.value = frequency
        oscillator.type = 'square'

        gainNode.gain.setValueAtTime(0, ctx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.02)
        gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + beepDuration - 0.02)
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + beepDuration)

        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + beepDuration)

        if (isPlayingRef.current) {
          setTimeout(playBeep, interval * 1000)
        }
      }

      playBeep()

      // 設定停止回調
      stopCallbackRef.current = () => {
        isPlayingRef.current = false
      }
    },
    [getAudioContext]
  )

  /**
   * 停止播放音效
   */
  const stop = useCallback(() => {
    isPlayingRef.current = false
    if (stopCallbackRef.current) {
      stopCallbackRef.current()
      stopCallbackRef.current = null
    }
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

      isPlayingRef.current = true

      // 根據音效類型選擇不同的播放模式
      switch (soundFile) {
        case 'alarm-default.mp3':
          // 預設：中音調，循環嗶嗶聲
          playLoopingAlarm(800, 'slow')
          break
        case 'alarm-gentle.mp3':
          // 柔和：低音調漸強（適合提前提醒）
          playGentleRise(400, 800, 2)
          break
        case 'alarm-classic.mp3':
          // 經典：高音調，快速重複循環
          playLoopingAlarm(1200, 'fast')
          break
        default:
          // 預設使用中音調
          playLoopingAlarm(800, 'slow')
      }
    },
    [stop, playLoopingAlarm, playGentleRise]
  )

  /**
   * 設定音量 (0.0 - 1.0)
   * 注意：Web Audio API 的音量控制較複雜，這裡簡化處理
   */
  const setVolume = useCallback((volume: number) => {
    // Web Audio API 的音量已在 gainNode 中設定
    // 這個函數保留介面相容性，但實際音量在播放時已固定
    console.log('音量設定:', Math.max(0, Math.min(1, volume)))
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
