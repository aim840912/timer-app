import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 靜態匯出模式（用於 GitHub Pages）
  output: 'export',

  // 嚴格模式
  reactStrictMode: true,

  // 移除 X-Powered-By header（安全性）
  poweredByHeader: false,

  // 壓縮
  compress: true,

  // GitHub Pages 路徑配置
  // 如果你的 repo 名稱不是 <username>.github.io，需要設定 basePath
  // 範例：repo 名稱是 timer-app，則設定 basePath: '/timer-app'
  basePath: '/timer-app',
  assetPrefix: '/timer-app',

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
