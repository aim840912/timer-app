---
description: "重大變更維護檢查（快取、依賴、品質、TODO）"
---

# 重大變更維護檢查 (Major Change Check)

執行重大變更（如大型重構、架構調整、批次更新）後，進行全面的維護檢查，確保專案健康狀態。

**用法**：`/major-change-check`

**何時執行**：
- 完成大型重構後
- 批次更新依賴後
- 架構調整後
- 新增多個功能後
- 感覺專案「變慢」時

---

## 檢查項目

### ✅ 1. 快取清理（Cache Cleanup）

**目標**：清理建置快取，確保快取大小合理（< 200MB）

#### 1.1 檢查快取大小

```bash
# 檢查 .next/cache 大小
du -sh .next/cache

# 檢查 node_modules/.cache 大小（如果存在）
du -sh node_modules/.cache 2>/dev/null || echo "No cache"
```

#### 1.2 快取清理

如果快取 > 200MB，執行清理：

```bash
# 清理 Next.js 快取
rm -rf .next/cache

# 清理 Turbopack 快取（如果使用）
rm -rf .next/cache/webpack

# 驗證清理結果
du -sh .next/cache
```

**標準**：
- 🟢 正常：< 200MB
- 🟡 警告：200-500MB（建議清理）
- 🔴 異常：> 500MB（必須清理）

---

### ✅ 2. 依賴檢查（Dependency Check）

**目標**：檢查未使用依賴、安全漏洞、過時套件

#### 2.1 未使用依賴檢查

```bash
# 檢查未使用的依賴
npx depcheck
```

**處理**：
- 如果有未使用的依賴，考慮移除
- 記錄為什麼保留某些「未使用」的依賴（如 @types 套件）

#### 2.2 安全漏洞檢查

```bash
# 執行安全性檢查
npm audit

# 檢視詳細報告
npm audit --json
```

**處理標準**：
- 🔴 Critical：必須立即修復
- 🟡 High：應該盡快修復
- 🟢 Moderate/Low：可以延後處理

**修復方式**：
```bash
# 自動修復（謹慎使用，可能破壞相容性）
npm audit fix

# 僅修復非破壞性的問題
npm audit fix --only=prod
```

#### 2.3 過時依賴檢查

```bash
# 檢查過時套件
npm outdated
```

**處理**：
- 紅色（Major 版本更新）：需要謹慎評估，可能有破壞性變更
- 黃色（Minor/Patch 更新）：通常可以安全更新
- 記錄故意不更新的套件及原因

---

### ✅ 3. 程式碼品質檢查（Code Quality Check）

**目標**：確保 TypeScript、Lint、Bundle 大小正常

#### 3.1 TypeScript 類型檢查

```bash
# 執行類型檢查
npm run type-check
```

**標準**：
- 🟢 通過：無錯誤
- 🔴 失敗：有錯誤（必須修復）

**處理**：
- 記錄錯誤數量和位置
- 優先修復 Critical 錯誤
- 避免使用 `@ts-ignore` 繞過

#### 3.2 Lint 檢查

```bash
# 執行 Lint 檢查
npm run lint
```

**標準**：
- 🟢 通過：無錯誤或警告
- 🟡 警告：有警告（應該處理）
- 🔴 錯誤：有錯誤（必須修復）

**處理**：
```bash
# 自動修復可修復的問題
npm run lint -- --fix
```

#### 3.3 Bundle 大小檢查

```bash
# 執行 Build（確保最新）
npm run build

# 如果有 analyze 腳本
npm run analyze
```

**標準**（根據專案類型調整）：
- 🟢 正常：首頁 bundle < 200KB
- 🟡 警告：200-500KB（檢查是否可優化）
- 🔴 異常：> 500KB（需要優化）

**分析**：
- 找出最大的依賴套件
- 檢查是否有不必要的引入
- 考慮 Code Splitting 或 Dynamic Import

---

### ✅ 4. TODO 和技術債掃描（TODO & Tech Debt Scan）

**目標**：追蹤未完成工作和技術債

#### 4.1 TODO 標籤掃描

```bash
# 搜尋 TODO 標籤
Grep "TODO:|FIXME:|HACK:|XXX:" --output_mode=content -A 1

# 或使用 bash
grep -r "TODO:\|FIXME:\|HACK:\|XXX:" src/ --include="*.ts" --include="*.tsx"
```

**分類**：
- `TODO:` - 待辦事項
- `FIXME:` - 需要修復的問題
- `HACK:` - 暫時解決方案
- `XXX:` - 需要注意的問題

**處理**：
- 評估每個 TODO 的優先級
- 將重要的 TODO 記錄到 Issue Tracker
- 清理已完成的 TODO

#### 4.2 技術債標籤掃描

```bash
# 搜尋技術債標籤
Grep "DEBT:|REFACTOR:|OPTIMIZE:" --output_mode=content -A 1
```

**分類**：
- 🔴 Critical DEBT - 影響系統穩定性
- 🟡 Major DEBT - 影響開發效率
- 🟢 Minor DEBT - 程式碼整潔度

**處理**：
- 記錄技術債清單
- 評估修復成本
- 安排修復時程

#### 4.3 重複程式碼檢查（可選）

```bash
# 使用 jscpd（如果有安裝）
npx jscpd src/ --threshold 10
```

**標準**：
- 🟢 正常：< 5% 重複率
- 🟡 警告：5-10% 重複率
- 🔴 異常：> 10% 重複率

**處理**：
- 找出重複最多的程式碼
- 評估是否需要抽取為共用函數

---

## 最終檢查清單

完成以上 4 個檢查後，填寫以下清單：

- [ ] **快取清理**：快取大小 < 200MB
- [ ] **依賴檢查**：無未使用依賴、無 Critical 漏洞、過時依賴已評估
- [ ] **程式碼品質**：TypeScript 通過、Lint 通過、Bundle 大小合理
- [ ] **TODO 掃描**：已記錄重要 TODO、技術債已評估

---

## 輸出格式（總結）

```
# 重大變更維護檢查報告

## ✅ 快取清理
- .next/cache 大小：[X] MB
- 狀態：[正常/已清理]

## ✅ 依賴檢查
- 未使用依賴：[數量] 個
  - [列表]
- 安全漏洞：[Critical/High/Moderate/Low]
  - [列表]
- 過時依賴：[數量] 個
  - [需要更新的列表]

## ✅ 程式碼品質
- TypeScript：[通過/失敗] ([錯誤數])
- Lint：[通過/警告/失敗] ([警告/錯誤數])
- Bundle 大小：[X] KB ([正常/警告/異常])

## ✅ TODO 和技術債
- TODO 標籤：[數量] 個
- FIXME/HACK：[數量] 個
- 技術債標籤：[數量] 個
- 重複程式碼：[百分比]%

## 🚦 總體評估
- 健康狀態：[良好/需改進/不良]
- 必須處理項目：
  - [列表]
- 建議處理項目：
  - [列表]
- 可延後處理項目：
  - [列表]

## 📋 後續行動
- [ ] [具體行動項目 1]
- [ ] [具體行動項目 2]
- [ ] [具體行動項目 3]
```

---

## 使用時機

**必須執行 `/major-change-check` 的情境**：
- 完成大型重構後
- 批次更新依賴套件後
- 新增多個功能後
- 架構調整後
- 定期維護（建議每月一次）
- 發現建置時間明顯增加時

**目標**：
- 保持專案健康狀態
- 及早發現技術債
- 避免累積問題
- 提升開發效率

---

## 相關指令

- `/tech-debt-scan` - 更深入的技術債掃描
- `/release-check` - 版本發布前更全面的檢查
- `/pre-dev-check` - 開發前檢查
- `/api-check` - API 開發完成檢查
