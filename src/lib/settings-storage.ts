/**
 * 應用設定儲存模組
 * 使用 localStorage 儲存使用者偏好設定
 */

import { logger } from '@/lib/utils'

const SETTINGS_KEY = 'app-settings'

export interface AppSettings {
  /** 音量大小 (0.0 - 1.0) */
  volume: number
}

const DEFAULT_SETTINGS: AppSettings = {
  volume: 0.5, // 預設 50%
}

/**
 * 從 localStorage 載入設定
 */
export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (!stored) {
      return DEFAULT_SETTINGS
    }

    const parsed = JSON.parse(stored) as Partial<AppSettings>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    }
  } catch (error) {
    logger.error('Failed to load settings:', error)
    return DEFAULT_SETTINGS
  }
}

/**
 * 儲存設定到 localStorage
 */
export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    logger.error('Failed to save settings:', error)
  }
}
