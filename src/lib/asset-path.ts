/**
 * 取得包含 basePath 的完整資源路徑
 * 用於第三方函式庫（如 Howler.js）載入 public 目錄的資源
 */
export const getAssetPath = (path: string): string => {
  // 在瀏覽器環境中，從 Next.js 注入的 __NEXT_DATA__ 獲取 basePath
  if (typeof window !== 'undefined') {
    const windowWithNextData = window as Window & {
      __NEXT_DATA__?: { basePath?: string }
    }
    const basePath = windowWithNextData.__NEXT_DATA__?.basePath || ''
    return `${basePath}${path}`
  }

  // 伺服器端渲染時不需要 basePath（靜態匯出模式下不會執行）
  return path
}
