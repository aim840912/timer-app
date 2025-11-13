/**
 * 生成唯一 ID
 *
 * 格式：timestamp-randomString
 * 例：1699876543210-a3b4c5d
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * 合併 className 字串
 *
 * 過濾掉 undefined、null、false 值
 *
 * @example
 * cn('btn', isActive && 'active', 'text-sm') // 'btn active text-sm'
 * cn('btn', false && 'hidden', undefined) // 'btn'
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Logger 工具
 *
 * 開發模式：所有日誌正常輸出
 * 生產模式：只輸出 error 和 warn
 */
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  error: (...args: unknown[]) => {
    console.error(...args)
  },
  warn: (...args: unknown[]) => {
    console.warn(...args)
  },
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
}
