---
description: "版本發布前深度檢查（依賴、測試、效能、文檔）"
---

# 版本發布前深度檢查 (Release Check)

在版本發布前，執行全面的深度檢查，確保生產環境穩定性、效能和安全性。

**用法**：`/release-check`

**何時執行**：
- 版本發布前（必須）
- 重大功能上線前
- 生產環境部署前
- 定期維護檢查（建議每季一次）

**⚠️ 警告**：此檢查比 `/major-change-check` 更全面，需要較長時間執行。

---

## 檢查項目（9 大類）

### ✅ 1. 依賴健康度（Dependency Health）

**目標**：確保所有依賴安全、最新、無漏洞

#### 1.1 過時依賴檢查

```bash
# 檢查過時套件
npm outdated

# 檢視完整依賴樹
npm ls --depth=0
```

**處理標準**：
- 🔴 Major 版本落後 > 2 個版本：需要評估更新
- 🟡 Minor 版本落後：建議更新
- 🟢 最新版本：正常

#### 1.2 安全漏洞檢查

```bash
# 執行完整安全性檢查
npm audit

# 檢視漏洞詳情
npm audit --json | grep -A 10 "severity"
```

**處理標準**：
- 🔴 Critical：**必須**修復（阻擋發布）
- 🔴 High：**應該**修復（建議修復後再發布）
- 🟡 Moderate：記錄並安排修復
- 🟢 Low：可延後處理

#### 1.3 未使用依賴檢查

```bash
# 檢查未使用的依賴
npx depcheck

# 檢查 package.json 大小
du -sh node_modules/
```

**處理**：
- 移除未使用的依賴
- 記錄為什麼保留某些「未使用」的依賴

---

### ✅ 2. 程式碼品質（Code Quality）

**目標**：確保程式碼品質達標

#### 2.1 重複程式碼檢查

```bash
# 使用 jscpd 檢查重複程式碼
npx jscpd src/ --threshold 10 --format "markdown" --output "./jscpd-report.md"

# 或使用簡單統計
cloc src/ --by-file
```

**標準**：
- 🟢 正常：< 5% 重複率
- 🟡 警告：5-10% 重複率
- 🔴 異常：> 10% 重複率（需要重構）

#### 2.2 TypeScript 嚴格檢查

```bash
# 執行類型檢查
npm run type-check

# 檢查是否有 any 類型繞過
Grep ": any\|as any" src/ --output_mode=files_with_matches
```

**標準**：
- 必須通過類型檢查
- 最小化 `any` 使用（< 10 處）

#### 2.3 Lint 和格式化

```bash
# 執行 Lint
npm run lint

# 執行格式化檢查（如果有）
npm run format:check || prettier --check src/
```

**標準**：
- 無 Lint 錯誤
- 無格式化警告

#### 2.4 測試覆蓋率（如果有）

```bash
# 執行測試並生成覆蓋率報告
npm test -- --coverage
```

**標準**：
- 🟢 良好：> 80% 覆蓋率
- 🟡 尚可：60-80% 覆蓋率
- 🔴 不足：< 60% 覆蓋率

---

### ✅ 3. 效能基準（Performance Baseline）

**目標**：確保建置時間、Bundle 大小在合理範圍

#### 3.1 建置時間檢查

```bash
# 清理快取後測試建置時間
rm -rf .next
time npm run build
```

**標準**（根據專案大小調整）：
- 🟢 正常：< 60 秒
- 🟡 警告：60-120 秒
- 🔴 異常：> 120 秒（需要優化）

#### 3.2 Bundle 大小分析

```bash
# 執行 Build 並分析
npm run build

# 如果有 analyze 腳本
npm run analyze

# 檢查主要頁面 bundle 大小
ls -lh .next/static/chunks/pages/
```

**標準**（參考值）：
- 首頁 JS Bundle：< 200KB（gzipped）
- 總 CSS：< 50KB（gzipped）
- 圖片資源：已優化（使用 WebP、適當尺寸）

#### 3.3 關鍵路徑效能

**檢查項目**：
- Time to First Byte (TTFB)：< 200ms
- First Contentful Paint (FCP)：< 1.8s
- Largest Contentful Paint (LCP)：< 2.5s
- Cumulative Layout Shift (CLS)：< 0.1
- First Input Delay (FID)：< 100ms

**測試方式**：
- 使用 Lighthouse（Chrome DevTools）
- 或使用 WebPageTest.org
- 或使用 Vercel Analytics（如果已部署）

---

### ✅ 4. 資料庫效能（Database Performance）

**目標**：確保資料庫查詢效率

#### 4.1 查詢效能檢查

```bash
# 檢查是否有 N+1 查詢
Grep "for.*await.*from\|\.map.*await" src/ --output_mode=files_with_matches

# 檢查是否有缺少索引的查詢
Grep "\.eq\(.*\)\.select\|\.filter" src/lib/services/ --output_mode=content
```

**處理**：
- 使用 JOIN 替代迴圈查詢
- 為常用查詢欄位建立索引

#### 4.2 索引檢查（Supabase）

**手動檢查**（透過 Supabase Dashboard）：
- [ ] 常用查詢欄位是否有索引？
- [ ] Foreign Key 是否有索引？
- [ ] 複合查詢是否有複合索引？

#### 4.3 資料庫連線檢查

```bash
# 檢查是否有未關閉的連線
Grep "supabase\.from\|createClient" src/ --output_mode=files_with_matches

# 確認使用 Service 層而非直接調用
Grep "from '@/lib/supabase'" src/app/api/ --output_mode=files_with_matches
```

**標準**：
- API 應該使用 Service 層
- 避免在 API 中直接使用 Supabase Client

---

### ✅ 5. 測試套件（Test Suite）

**目標**：確保測試覆蓋完整、穩定

#### 5.1 單元測試

```bash
# 執行所有測試
npm test

# 檢查測試檔案數量
find src/ -name "*.test.ts" -o -name "*.test.tsx" | wc -l
```

**標準**：
- 所有測試通過
- 無 Skip 或 Disabled 測試（除非有明確原因）

#### 5.2 整合測試（如果有）

```bash
# 執行整合測試
npm run test:integration
```

**標準**：
- API 端點有測試覆蓋
- 關鍵業務流程有測試

#### 5.3 E2E 測試（如果有）

```bash
# 執行 E2E 測試
npm run test:e2e
```

**標準**：
- 關鍵使用者流程有 E2E 測試
- 測試穩定（不 Flaky）

#### 5.4 手動測試檢查清單

**關鍵功能測試**：
- [ ] 使用者註冊和登入
- [ ] 核心業務流程（根據專案調整）
- [ ] 權限檢查（Admin、使用者、訪客）
- [ ] 錯誤處理（404、500、網路錯誤）
- [ ] 行動裝置體驗

---

### ✅ 6. 系統指標（System Metrics）

**目標**：檢查生產環境效能指標

#### 6.1 Vercel 部署檢查（如果使用 Vercel）

**檢查項目**：
- [ ] 部署是否成功？
- [ ] Build 時間是否合理？
- [ ] Function 執行時間是否在限制內？（< 10s Hobby plan）
- [ ] Edge Function 是否正常？

**檢視方式**：
- Vercel Dashboard → Analytics
- Vercel Dashboard → Speed Insights

#### 6.2 API 回應時間

**測試方式**：
```bash
# 測試關鍵 API 端點
curl -w "@curl-format.txt" -o /dev/null -s "https://your-domain.com/api/health"

# 或使用 Postman Collection 執行批次測試
```

**標準**：
- 讀取 API：< 500ms (p95)
- 寫入 API：< 1s (p95)
- 複雜查詢：< 2s (p95)

#### 6.3 快取命中率（如果使用 Redis）

**檢查項目**：
- 快取命中率：> 80%
- 快取失效策略是否正確？

---

### ✅ 7. 文檔更新（Documentation Update）

**目標**：確保文檔與程式碼同步

#### 7.1 README 更新

```bash
# 檢查 README.md 最後更新時間
ls -l README.md

# 確認內容是否過時
Read README.md
```

**檢查項目**：
- [ ] 安裝說明是否正確？
- [ ] 環境變數是否完整？
- [ ] 開發指令是否更新？
- [ ] 架構圖是否反映當前狀態？

#### 7.2 API 文檔更新

**檢查項目**：
- [ ] 新增的 API 是否有文檔？
- [ ] 已刪除的 API 是否從文檔移除？
- [ ] 參數和回應格式是否正確？

#### 7.3 Changelog 更新

```bash
# 檢查 CHANGELOG.md
Read CHANGELOG.md
```

**檢查項目**：
- [ ] 是否記錄本次版本的變更？
- [ ] 是否包含 Added、Changed、Fixed、Removed 分類？
- [ ] 是否標註破壞性變更（BREAKING CHANGE）？

#### 7.4 優化歷史更新

```bash
# 檢查優化歷史
Read docs/optimization/OPTIMIZATION_HISTORY.md
```

**檢查項目**：
- [ ] 是否更新已實施的優化項目？
- [ ] 是否記錄實際效果和 Commit hash？
- [ ] 是否移除已完成的待評估項目？

---

### ✅ 8. 環境配置（Environment Configuration）

**目標**：確保生產環境配置正確

#### 8.1 環境變數檢查

```bash
# 檢查 .env.example 是否完整
diff <(grep -o '^[A-Z_]*=' .env.local | sort) <(grep -o '^[A-Z_]*=' .env.example | sort)

# 檢查程式碼中使用的環境變數
Grep "process\.env\." src/ --output_mode=content | grep -o 'process\.env\.[A-Z_]*' | sort -u
```

**檢查項目**：
- [ ] `.env.example` 是否包含所有必要變數？
- [ ] 生產環境變數是否已設定？（Vercel Dashboard）
- [ ] 是否有硬編碼的敏感資訊？

#### 8.2 生產環境配置

**檢查項目**：
- [ ] 生產環境使用 HTTPS
- [ ] 資料庫使用 Connection Pool
- [ ] 啟用 CORS 安全設定
- [ ] 設定 Rate Limiting
- [ ] 啟用日誌系統
- [ ] 設定錯誤追蹤（如 Sentry）

#### 8.3 敏感資訊檢查

```bash
# 搜尋可能的敏感資訊
Grep "password.*=.*['\"]|api.*key.*=.*['\"]|secret.*=.*['\"]" src/ --output_mode=files_with_matches -i

# 檢查 .gitignore
cat .gitignore | grep -E "\.env$|\.env\.local|credentials"
```

**確認**：
- [ ] `.env` 檔案在 `.gitignore` 中
- [ ] 無硬編碼密碼、API Key
- [ ] 敏感檔案未被 commit

---

### ✅ 9. 備份與回滾計劃（Backup & Rollback）

**目標**：確保可以安全回滾

#### 9.1 資料庫備份

**檢查項目**：
- [ ] 是否有自動備份機制？
- [ ] 備份保留時間是否足夠？
- [ ] 是否測試過備份恢復流程？

**Supabase 備份**（如果使用）：
- Pro plan 有自動每日備份
- 手動備份：Dashboard → Database → Backups

#### 9.2 回滾計劃

**準備**：
- [ ] 記錄當前版本號和 Commit hash
- [ ] 確認 Git Tag 已建立
- [ ] 確認可以快速回滾到上一版本
- [ ] 記錄回滾步驟

**回滾步驟範例**：
```bash
# 1. 回滾到上一個 Tag
git checkout v1.2.3

# 2. 重新部署
vercel --prod

# 3. 驗證功能是否正常

# 4. 如果需要回滾資料庫
# (根據專案調整)
```

#### 9.3 監控設定

**檢查項目**：
- [ ] 是否設定錯誤監控？（Sentry、Vercel Logs）
- [ ] 是否設定效能監控？（Vercel Analytics）
- [ ] 是否設定告警？（Critical 錯誤、API 失敗率）

---

## 最終檢查清單

完成以上 9 個檢查後，填寫以下清單：

- [ ] **依賴健康**：無 Critical 漏洞、過時依賴已評估
- [ ] **程式碼品質**：TypeScript/Lint 通過、重複程式碼 < 5%
- [ ] **效能基準**：建置時間 < 60s、Bundle 大小合理
- [ ] **資料庫效能**：無 N+1 查詢、索引完整
- [ ] **測試套件**：所有測試通過、關鍵流程有覆蓋
- [ ] **系統指標**：API 回應時間 < 500ms、快取命中率 > 80%
- [ ] **文檔更新**：README、API 文檔、Changelog 已更新
- [ ] **環境配置**：生產環境變數已設定、無敏感資訊洩漏
- [ ] **備份回滾**：備份機制就緒、回滾計劃已準備

---

## 輸出格式（總結）

```
# 版本發布前檢查報告

## ✅ 1. 依賴健康度
- 過時依賴：[數量] 個
- 安全漏洞：[Critical/High/Moderate/Low 數量]
- 未使用依賴：[數量] 個
- **狀態**：[通過/需處理]

## ✅ 2. 程式碼品質
- TypeScript：[通過/失敗]
- Lint：[通過/失敗]
- 重複程式碼：[百分比]%
- 測試覆蓋率：[百分比]%
- **狀態**：[通過/需改進]

## ✅ 3. 效能基準
- 建置時間：[X] 秒
- 首頁 Bundle：[X] KB
- LCP：[X] 秒
- **狀態**：[通過/需優化]

## ✅ 4. 資料庫效能
- N+1 查詢：[發現/未發現]
- 索引設置：[完整/需補充]
- **狀態**：[通過/需改進]

## ✅ 5. 測試套件
- 單元測試：[通過數/總數]
- 整合測試：[通過/跳過]
- E2E 測試：[通過/跳過]
- **狀態**：[通過/需補充]

## ✅ 6. 系統指標
- API 回應時間：[X] ms (p95)
- 快取命中率：[X]%
- **狀態**：[正常/需優化]

## ✅ 7. 文檔更新
- README：[已更新/需更新]
- API 文檔：[已更新/需更新]
- Changelog：[已更新/需更新]
- **狀態**：[完整/需補充]

## ✅ 8. 環境配置
- 環境變數：[完整/缺失]
- 敏感資訊：[安全/有風險]
- **狀態**：[安全/需處理]

## ✅ 9. 備份回滾
- 備份機制：[已設定/未設定]
- 回滾計劃：[已準備/未準備]
- **狀態**：[就緒/需準備]

---

## 🚦 發布決策

**總體評估**：[可發布/需處理後發布/不建議發布]

**阻擋發布的問題**：
- [Critical 安全漏洞]
- [測試失敗]
- [...]

**建議處理後發布**：
- [High 安全漏洞]
- [效能問題]
- [...]

**可延後處理**：
- [文檔更新]
- [Minor 優化]
- [...]

---

## 📋 發布後監控清單

**發布後 1 小時內**：
- [ ] 檢查錯誤率（Sentry/Vercel Logs）
- [ ] 檢查 API 回應時間
- [ ] 檢查使用者回報

**發布後 24 小時內**：
- [ ] 檢查效能指標
- [ ] 檢查資料庫負載
- [ ] 檢查快取命中率

**發布後 1 週內**：
- [ ] 收集使用者反饋
- [ ] 分析新功能使用率
- [ ] 評估效能影響
```

---

## 使用時機

**必須執行 `/release-check` 的情境**：
- 版本發布前（強制）
- 重大功能上線前
- 生產環境部署前
- 定期維護檢查（建議每季一次）

**建議**：
- 在非尖峰時段發布
- 發布後持續監控 1-2 小時
- 準備好回滾計劃

---

## 相關指令

- `/major-change-check` - 重大變更維護檢查（較輕量）
- `/tech-debt-scan` - 技術債掃描
- `/api-check` - API 開發完成檢查
- `/opt-status` - 查看優化歷史
