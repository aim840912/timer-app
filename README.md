# Timer App

一個使用 Next.js 16 構建的計時器應用，支援靜態匯出並部署到 GitHub Pages。

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000) 查看應用。

編輯 `src/app/page.tsx` 檔案，頁面會自動更新。

## 📦 可用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器（支援 Turbopack） |
| `npm run build` | 建置靜態網站到 `out/` 目錄 |
| `npm run start` | 啟動生產伺服器（本地預覽用） |
| `npm run lint` | 執行 ESLint 程式碼檢查 |
| `npm run type-check` | 執行 TypeScript 類型檢查 |
| `npm run clean` | 清理建置目錄（`.next` 和 `out`） |
| `npm run export` | 清理並建置（完整的靜態匯出流程） |

## 🌐 部署到 GitHub Pages

### 1. 建立 GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的使用者名稱/timer-app.git
git push -u origin main
```

### 2. 啟用 GitHub Pages

1. 進入你的 GitHub repository 設定頁面
2. 點選左側選單的 **Pages**
3. 在 **Source** 區塊選擇：
   - Source: **GitHub Actions**
4. 完成！每次推送到 `main` 分支時會自動部署

### 3. 配置 basePath（如果需要）

如果你的 repository 名稱**不是** `<username>.github.io`，需要設定 `basePath`：

編輯 `next.config.ts`，取消註解並修改：

```typescript
basePath: '/timer-app',  // 改成你的 repo 名稱
assetPrefix: '/timer-app',
```

### 4. 訪問網站

部署完成後，你的網站會在以下網址：

- 如果是 `<username>.github.io` repo：`https://<username>.github.io`
- 其他 repo 名稱：`https://<username>.github.io/timer-app`

## ⚙️ 技術棧

- **框架**: Next.js 16（App Router）
- **語言**: TypeScript
- **樣式**: Tailwind CSS 4
- **動畫**: Framer Motion
- **圖示**: Lucide React
- **音效**: Howler.js
- **部署**: GitHub Pages（靜態匯出）

## 📝 專案結構

```
timer-app/
├── src/
│   └── app/              # Next.js App Router
│       ├── layout.tsx    # Root layout
│       ├── page.tsx      # 首頁
│       └── globals.css   # 全域樣式
├── public/               # 靜態資源
│   └── .nojekyll         # GitHub Pages 配置
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions 自動部署
├── next.config.ts        # Next.js 配置（靜態匯出）
├── tsconfig.json         # TypeScript 配置
└── package.json          # 專案依賴和腳本
```

## ⚠️ GitHub Pages 限制

由於 GitHub Pages 只支援靜態網站，以下功能**無法使用**：

- ❌ API Routes（`/api/*` 路由）
- ❌ Server-Side Rendering（SSR）
- ❌ Incremental Static Regeneration（ISR）
- ❌ Middleware（邊緣運算）
- ❌ 動態路由（除非預先建置所有路徑）

如果需要這些功能，建議部署到：
- **Vercel**（完整 Next.js 支援）
- **Cloudflare Pages**（Edge Runtime）
- **Netlify**（Serverless Functions）

## 📚 學習資源

- [Next.js 文檔](https://nextjs.org/docs) - Next.js 功能和 API
- [Tailwind CSS](https://tailwindcss.com/docs) - CSS 框架文檔
- [GitHub Pages 文檔](https://docs.github.com/en/pages) - GitHub Pages 配置指南

## 📄 授權

MIT License
