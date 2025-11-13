/**
 * 取得包含 basePath 的完整資源路徑
 * 用於第三方函式庫（如 Howler.js）載入 public 目錄的資源
 *
 * 注意：在 Next.js App Router 靜態匯出模式下，window.__NEXT_DATA__ 不會被注入
 * 因此直接使用與 next.config.ts 一致的環境判斷邏輯
 */
export const getAssetPath = (path: string): string => {
  // 使用環境變數在建置時確定 basePath
  // 開發環境：basePath = ''
  // 生產環境：basePath = '/timer-app'
  const basePath = process.env.NODE_ENV === 'production' ? '/timer-app' : ''
  return `${basePath}${path}`
}
