---
description: "開發前檢查（Code Reuse、依賴、架構、效能）"
---

# 開發前檢查清單 (Pre-Development Check)

在實作任何功能前，執行全面的開發前檢查，確保避免重複實作、不必要的依賴、架構不一致和效能問題。

**用法**：`/pre-dev-check [功能名稱或描述]`

**檢查功能**：$ARGUMENTS

---

## 檢查項目

### ✅ 1. Code Reuse Check（程式碼重用檢查）

**目標**：避免重複實作已存在的功能

#### 1.1 搜尋相似功能

```bash
# 搜尋關鍵字（函數名、類別名、變數名）
Grep "[關鍵字]" --output_mode=files_with_matches

# 搜尋相似檔案路徑
Glob "**/*[關鍵字]*.{ts,tsx}"

# 搜尋 import 語句（了解現有工具）
Grep "import.*from.*[相關套件]" --output_mode=content
```

#### 1.2 分析發現

- [ ] 是否有類似功能已存在？
- [ ] 如果存在，位置在哪裡？（記錄檔案路徑）
- [ ] 是否可以重用或擴展現有功能？
- [ ] 如果不能重用，為什麼？（記錄原因）

**輸出**：
```
✅ Code Reuse 結果：
- 發現 X 個相似功能：[列出檔案路徑]
- 建議：[重用/擴展/新建] + [理由]
```

---

### ✅ 2. Dependency Assessment（依賴評估）

**目標**：避免不必要的套件膨脹

#### 2.1 檢查現有依賴

```bash
# 檢查是否已有類似功能的套件
npm ls | grep [相關關鍵字]

# 搜尋現有 import
Grep "import.*from" src/ --output_mode=files_with_matches | head -n 50
```

#### 2.2 評估新依賴需求

如果需要新增依賴，檢查：

```bash
# 套件資訊
npm info [package-name]

# 安全性檢查
npm audit

# 未使用依賴檢查
npx depcheck
```

#### 2.3 依賴決策

- [ ] 是否真的需要新依賴？
- [ ] 現有依賴是否已包含此功能？
- [ ] 套件大小影響（> 100KB 需謹慎）
- [ ] 套件健康度（最後更新時間、維護狀態）
- [ ] 是否有更輕量的替代方案？

**輸出**：
```
✅ Dependency 評估：
- 現有依賴：[列出相關套件]
- 新依賴需求：[是/否]
  - 套件名稱：[...]
  - 大小：[...] KB
  - 理由：[...]
  - 替代方案：[...]
```

---

### ✅ 3. Architecture Consistency（架構一致性）

**目標**：確認遵循專案架構模式

#### 3.1 檢查現有架構模式

```bash
# 檢查 API 架構（如果是 API）
ls src/app/api/[相關路徑]/

# 檢查 Service 層
Glob "src/lib/services/**/*.ts"

# 檢查元件架構（如果是 UI）
Glob "src/components/**/*.tsx"

# 檢查 Hook 使用
Glob "src/hooks/**/*.ts"
```

#### 3.2 架構一致性檢查

**如果是 API 開發**：
- [ ] 是否使用統一錯誤處理中間件？（withAuthAndError/withAdminAndError）
- [ ] 是否使用統一回應格式？（success/error from @/lib/api-response）
- [ ] 是否使用 Service 層（避免直接在 API 中寫業務邏輯）？
- [ ] 是否使用專案 logger 系統？（apiLogger/dbLogger）

**如果是 UI 開發**：
- [ ] 元件是否遵循專案目錄結構？
- [ ] 是否使用專案的 UI 元件庫？（檢查 src/components/ui/）
- [ ] 狀態管理方式是否一致？
- [ ] 是否避免在元件內直接調用 API？（使用 custom hooks）

**如果是資料庫操作**：
- [ ] 是否使用 Service 層？
- [ ] 是否使用 dbLogger 記錄？
- [ ] 是否避免 N+1 查詢？

**輸出**：
```
✅ Architecture 一致性：
- 遵循模式：[列出符合的架構模式]
- 需要注意：[列出需要遵循的規範]
- 參考實作：[列出 2-3 個類似功能的檔案路徑]
```

---

### ✅ 4. Performance Impact（效能影響評估）

**目標**：評估對建置時間和 Bundle 大小的影響

#### 4.1 當前效能基準

```bash
# 檢查當前建置快取大小
du -sh .next/cache

# 檢查 TypeScript 編譯時間（可選）
# time npm run type-check

# 檢查 Lint 時間（可選）
# time npm run lint
```

#### 4.2 效能影響評估

- [ ] 新增檔案數量：[X] 個
- [ ] 預估程式碼行數：[Y] 行
- [ ] 是否引入大型依賴？（> 100KB）
- [ ] 是否影響關鍵路徑？（首頁載入、API 回應時間）
- [ ] 是否需要額外的資料庫查詢？
- [ ] 是否需要額外的 API 調用？

**評估標準**：
- 🟢 低影響：< 50KB bundle 增加，< 10 秒建置時間增加
- 🟡 中影響：50-200KB bundle 增加，10-30 秒建置時間增加
- 🔴 高影響：> 200KB bundle 增加，> 30 秒建置時間增加

**輸出**：
```
✅ Performance 影響：
- 影響等級：[低/中/高]
- Bundle 大小：預估 +[X] KB
- 建置時間：預估 +[Y] 秒
- 風險點：[列出可能的效能瓶頸]
- 緩解策略：[如何降低影響]
```

---

## 最終檢查清單

完成以上 4 個檢查後，填寫以下清單：

- [ ] **Code Reuse**：已搜尋現有程式碼，避免重複實作
- [ ] **Dependency**：已評估依賴需求，避免不必要的套件
- [ ] **Architecture**：已確認架構模式，遵循專案規範
- [ ] **Performance**：已評估效能影響，風險可控

---

## 輸出格式（總結）

```
# 開發前檢查報告：[功能名稱]

## ✅ Code Reuse Check
- [結果摘要]

## ✅ Dependency Assessment
- [結果摘要]

## ✅ Architecture Consistency
- [結果摘要]

## ✅ Performance Impact
- [結果摘要]

## 🚦 總體評估
- 風險等級：[低/中/高]
- 建議：[繼續開發/需要調整/重新評估]
- 注意事項：[列出關鍵提醒]

## 📋 參考資料
- 類似實作：[檔案路徑]
- 相關文檔：[連結]
```

---

## 使用時機

**必須執行 `/pre-dev-check` 的情境**：
- 實作任何新功能前
- 新增任何依賴套件前
- 進行架構調整前
- 懷疑可能有重複實作時

**目標**：
- 避免技術債累積
- 保持程式碼品質
- 控制專案複雜度
- 提升開發效率

---

## 相關指令

- `/opt-status` - 查看優化歷史（避免重複建議已實施的優化）
- `/api-check` - API 開發完成後檢查
- `/tech-debt-scan` - 定期技術債掃描
