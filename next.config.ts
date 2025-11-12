import type { NextConfig } from 'next'

// 判斷是否為生產環境
const isProduction = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  // 靜態匯出模式（用於 GitHub Pages）
  output: 'export',

  // 嚴格模式
  reactStrictMode: true,

  // 移除 X-Powered-By header（安全性）
  poweredByHeader: false,

  // 壓縮
  compress: true,

  // GitHub Pages 路徑配置（條件式）
  // 開發環境：basePath 為空，訪問 http://localhost:3000/
  // 生產環境：basePath 為 '/timer-app'，部署到 GitHub Pages
  basePath: isProduction ? '/timer-app' : '',
  assetPrefix: isProduction ? '/timer-app' : '',

  // 圖片優化配置（靜態匯出模式不支援圖片優化）
  images: {
    unoptimized: true, // 靜態匯出必須設為 true
  },

  // 實驗性功能
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
}

export default nextConfig
