'use client'

import { useEffect, useRef } from 'react'

interface UseTimerNotificationsProps {
  isRinging: boolean
  timerName: string
}

/**
 * 處理計時器完成時的通知功能
 * - 瀏覽器通知
 * - 頁面標題閃爍
 */
export const useTimerNotifications = ({ isRinging, timerName }: UseTimerNotificationsProps) => {
  const originalTitleRef = useRef<string>('')
  const titleIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 請求瀏覽器通知權限
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [])

  // 頁面標題閃爍
  useEffect(() => {
    if (!isRinging) {
      // 停止閃爍，恢復原標題
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current)
        titleIntervalRef.current = null
      }
      if (originalTitleRef.current) {
        document.title = originalTitleRef.current
      }
      return
    }

    // 儲存原標題
    originalTitleRef.current = document.title

    // 開始閃爍
    let isAlternate = false
    titleIntervalRef.current = setInterval(() => {
      document.title = isAlternate ? originalTitleRef.current : `⏰ ${timerName} - 時間到！`
      isAlternate = !isAlternate
    }, 1000) // 每秒切換

    return () => {
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current)
      }
      if (originalTitleRef.current) {
        document.title = originalTitleRef.current
      }
    }
  }, [isRinging, timerName])

  // 瀏覽器通知
  useEffect(() => {
    if (!isRinging) return

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        const notification = new Notification('計時器完成', {
          body: `${timerName} - 時間到！`,
          icon: '/icon-192x192.png', // 如果有 PWA icon
          badge: '/icon-192x192.png',
          tag: 'timer-finished',
          requireInteraction: true, // 要求使用者互動才關閉
        })

        // 點擊通知時聚焦頁面
        notification.onclick = () => {
          window.focus()
          notification.close()
        }
      }
    }
  }, [isRinging, timerName])
}
