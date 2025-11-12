---
description: "技術債掃描（建置時間、警告、重複程式碼、過時依賴）"
---

# 技術債掃描 (Tech Debt Scan)

定期掃描專案的技術債信號，及早發現和處理潛在問題，避免技術債累積影響開發效率。

**用法**：`/tech-debt-scan`

**何時執行**：
- 定期維護（建議每月一次）
- 感覺開發速度變慢時
- 建置時間明顯增加時
- 程式碼變得難以維護時

---

## 技術債分類

- 🔴 **Critical** - 影響系統穩定性、安全性或核心功能
- 🟡 **Major** - 影響開發效率、使用者體驗或維護成本
- 🟢 **Minor** - 程式碼整潔度、文檔或註解問題

---

## 掃描項目

### ✅ 1. 建置時間分析（Build Time Analysis）

**目標**：追蹤建置時間趨勢，識別效能退化

#### 1.1 測量建置時間

```bash
# 清理快取
rm -rf .next

# 測量建置時間（執行 3 次取平均）
echo "Build 1:" && time npm run build
echo "Build 2:" && time npm run build
echo "Build 3:" && time npm run build
```

**記錄基準**：
- 首次建置時間（冷啟動）
- 增量建置時間（熱啟動）

**評估標準**：
- 🟢 正常：< 60 秒
- 🟡 警告：60-120 秒（需要調查）
- 🔴 異常：> 120 秒（需要優化）

#### 1.2 識別瓶頸

**可能原因**：
- 套件數量過多
- 大型依賴（如 lodash 全量引入）
- TypeScript 編譯慢（過多類型推導）
- 圖片/資源未優化
- Webpack/Turbopack 配置問題

**調查方式**：
```bash
# 檢查套件數量
npm ls --depth=0 | wc -l

# 檢查最大的依賴
du -sh node_modules/* | sort -rh | head -20
```

---

### ✅ 2. TypeScript 和 ESLint 警告（Warnings Scan）

**目標**：追蹤警告數量，避免警告累積

#### 2.1 TypeScript 警告

```bash
# 執行類型檢查並計數警告
npm run type-check 2>&1 | tee ts-check.log

# 統計警告和錯誤數量
grep -c "error TS" ts-check.log || echo "0 errors"
grep -c "warning" ts-check.log || echo "0 warnings"
```

**標準**：
- 🟢 正常：0 錯誤、< 5 警告
- 🟡 警告：0 錯誤、5-20 警告
- 🔴 異常：有錯誤 或 > 20 警告

**常見問題**：
- 使用 `any` 類型繞過檢查
- 類型定義不完整
- 未使用的變數或 import

#### 2.2 ESLint 警告

```bash
# 執行 Lint 並計數
npm run lint 2>&1 | tee lint.log

# 統計警告和錯誤數量
grep -c "error" lint.log || echo "0 errors"
grep -c "warning" lint.log || echo "0 warnings"
```

**標準**：
- 🟢 正常：0 錯誤、< 10 警告
- 🟡 警告：0 錯誤、10-50 警告
- 🔴 異常：有錯誤 或 > 50 警告

**常見問題**：
- console.log 未移除
- 未使用的變數
- 格式化問題

---

### ✅ 3. 重複程式碼檢查（Code Duplication）

**目標**：識別重複程式碼，提升可維護性

#### 3.1 使用 jscpd 掃描

```bash
# 掃描重複程式碼
npx jscpd src/ --threshold 10 --min-lines 5 --min-tokens 50

# 生成報告
npx jscpd src/ --format "markdown" --output "./jscpd-report.md"

# 顯示報告（如果存在）
if [ -f ./jscpd-report.json ]; then
  cat ./jscpd-report.json
else
  echo "Report file not found"
fi
```

**評估標準**：
- 🟢 正常：< 5% 重複率
- 🟡 警告：5-10% 重複率
- 🔴 異常：> 10% 重複率

#### 3.2 識別重複模式

**常見重複場景**：
- 相似的表單驗證邏輯
- 重複的 API 調用模式
- 相似的元件結構
- 重複的錯誤處理

**處理建議**：
- 抽取為共用函數
- 建立 Custom Hooks（React）
- 使用高階元件或 Render Props
- 建立工具類別

---

### ✅ 4. 過時依賴掃描（Outdated Dependencies）

**目標**：識別過時和有安全漏洞的依賴

#### 4.1 過時依賴檢查

```bash
# 檢查過時套件
npm outdated

# 僅顯示嚴重過時的（Major 版本）
npm outdated --parseable | grep -E "Wanted.*Latest" | head -20
```

**評估標準**：
- 🔴 Critical：Major 版本落後 > 3 個版本
- 🟡 Major：Major 版本落後 1-2 個版本
- 🟢 Minor：僅 Minor/Patch 版本落後

#### 4.2 安全漏洞掃描

```bash
# 完整安全性檢查
npm audit

# 僅顯示 High 和 Critical
npm audit --audit-level=high

# 產生 JSON 報告
npm audit --json > audit-report.json
```

**處理標準**：
- 🔴 Critical：必須立即修復
- 🔴 High：應該盡快修復
- 🟡 Moderate：記錄並安排修復
- 🟢 Low：可延後處理

#### 4.3 依賴健康度評估

```bash
# 檢查直接依賴數量
cat package.json | jq '.dependencies | length'

# 檢查開發依賴數量
cat package.json | jq '.devDependencies | length'

# 檢查 node_modules 大小
du -sh node_modules/
```

**評估標準**：
- 🟢 健康：< 50 個直接依賴、< 500MB node_modules
- 🟡 警告：50-100 個依賴、500MB-1GB node_modules
- 🔴 膨脹：> 100 個依賴、> 1GB node_modules

---

### ✅ 5. 程式碼複雜度分析（Code Complexity）

**目標**：識別過於複雜的程式碼

#### 5.1 檔案大小檢查

```bash
# 找出最大的檔案
find src/ -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20
```

**評估標準**：
- 🟢 正常：< 200 行
- 🟡 警告：200-500 行（考慮拆分）
- 🔴 異常：> 500 行（需要重構）

#### 5.2 函數複雜度檢查

**手動檢查要點**：
- 函數長度：建議 < 30 行
- 參數數量：建議 < 5 個
- 巢狀層數：建議 < 3 層
- 循環複雜度：建議 < 10

**搜尋可能過於複雜的函數**：
```bash
# 搜尋長函數（超過 50 行的函數）
Grep "function.*\{" src/ --output_mode=content -A 50 | grep -c "^}"

# 搜尋深度巢狀
Grep "if.*{.*if.*{.*if.*{" src/ --output_mode=files_with_matches
```

---

### ✅ 6. Bundle 大小分析（Bundle Size Analysis）

**目標**：追蹤 Bundle 大小趨勢

#### 6.1 分析 Bundle 大小

```bash
# 建置專案
npm run build

# 檢查輸出大小
ls -lh .next/static/chunks/pages/ | grep -E "\.js$"

# 如果有 analyze 腳本
npm run analyze
```

**評估標準**（gzipped）：
- 🟢 正常：首頁 < 200KB、單頁 < 150KB
- 🟡 警告：首頁 200-500KB、單頁 150-300KB
- 🔴 異常：首頁 > 500KB、單頁 > 300KB

#### 6.2 識別大型依賴

**常見問題**：
- Lodash 全量引入（應使用 `lodash-es` 或按需引入）
- Moment.js（應使用 date-fns 或 day.js）
- 圖示庫全量引入（應按需引入）

**檢查方式**：
```bash
# 使用 webpack-bundle-analyzer（如果有設定）
npm run analyze

# 或手動檢查大型依賴
du -sh node_modules/* | sort -rh | head -20
```

---

### ✅ 7. TODO 和 DEBT 標籤掃描（Tag Scan）

**目標**：追蹤未完成工作和技術債標記

#### 7.1 TODO 標籤統計

```bash
# 掃描 TODO 標籤
Grep "TODO:|FIXME:|HACK:|XXX:" src/ --output_mode=content -A 2

# 統計數量
grep -r "TODO:" src/ | wc -l
grep -r "FIXME:" src/ | wc -l
grep -r "HACK:" src/ | wc -l
```

**評估標準**：
- 🟢 正常：< 20 個 TODO
- 🟡 警告：20-50 個 TODO
- 🔴 異常：> 50 個 TODO（需要整理）

#### 7.2 DEBT 標籤分析

```bash
# 掃描技術債標籤
Grep "DEBT:|REFACTOR:|OPTIMIZE:|DEPRECATED:" src/ --output_mode=content -A 2

# 按嚴重程度分類
grep -r "CRITICAL DEBT:" src/ | wc -l
grep -r "MAJOR DEBT:" src/ | wc -l
grep -r "MINOR DEBT:" src/ | wc -l
```

**處理優先級**：
1. CRITICAL DEBT - 立即處理
2. MAJOR DEBT - 2 週內處理
3. MINOR DEBT - 1 個月內處理

---

### ✅ 8. 測試覆蓋率趨勢（Test Coverage Trend）

**目標**：追蹤測試覆蓋率變化

#### 8.1 執行測試覆蓋率

```bash
# 執行測試並生成覆蓋率報告
npm test -- --coverage --coverageReporters=text --coverageReporters=json-summary
```

**評估標準**：
- 🟢 良好：> 80% 覆蓋率
- 🟡 尚可：60-80% 覆蓋率
- 🔴 不足：< 60% 覆蓋率

#### 8.2 識別未測試區域

```bash
# 找出沒有測試的檔案
find src/ -name "*.ts" -o -name "*.tsx" | grep -v "\.test\." | grep -v "\.spec\."
```

**優先測試**：
- 核心業務邏輯
- API 端點
- 工具函數
- 關鍵元件

---

### ✅ 9. 未使用程式碼檢測（Dead Code Detection）

**目標**：識別未使用的程式碼和依賴

#### 9.1 未使用依賴

```bash
# 使用 depcheck
npx depcheck

# 檢查結果
npx depcheck --json | jq '.dependencies'
```

#### 9.2 未使用的 Export

```bash
# 搜尋未使用的 export（需手動檢查）
Grep "export.*function\|export.*const\|export.*class" src/ --output_mode=files_with_matches

# 檢查是否有未引用的模組
find src/ -name "index.ts" | xargs grep "export"
```

---

## 最終檢查清單

完成以上 9 個掃描後，填寫以下清單：

- [ ] **建置時間**：< 60 秒，無明顯退化
- [ ] **TypeScript/ESLint**：0 錯誤、< 10 警告
- [ ] **重複程式碼**：< 5% 重複率
- [ ] **過時依賴**：無 Critical 漏洞、Major 版本未落後 > 2 個版本
- [ ] **程式碼複雜度**：檔案 < 200 行、函數 < 30 行
- [ ] **Bundle 大小**：首頁 < 200KB
- [ ] **TODO/DEBT**：< 20 個 TODO、Critical DEBT 已處理
- [ ] **測試覆蓋率**：> 60%
- [ ] **未使用程式碼**：無未使用依賴

---

## 輸出格式（總結）

```
# 技術債掃描報告

## ✅ 1. 建置時間分析
- 冷啟動：[X] 秒
- 熱啟動：[Y] 秒
- 趨勢：[正常/退化]
- 🚦 **狀態**：[正常/警告/異常]

## ✅ 2. TypeScript 和 ESLint 警告
- TypeScript 錯誤：[X] 個
- TypeScript 警告：[Y] 個
- ESLint 錯誤：[X] 個
- ESLint 警告：[Y] 個
- 🚦 **狀態**：[正常/警告/異常]

## ✅ 3. 重複程式碼
- 重複率：[X]%
- 重複檔案：[列表]
- 🚦 **狀態**：[正常/警告/異常]

## ✅ 4. 過時依賴
- Major 版本過時：[X] 個
- 安全漏洞：[Critical/High/Moderate/Low 數量]
- node_modules 大小：[X] MB
- 🚦 **狀態**：[正常/警告/異常]

## ✅ 5. 程式碼複雜度
- 大型檔案（> 200 行）：[X] 個
- 深度巢狀：[X] 處
- 🚦 **狀態**：[正常/需重構]

## ✅ 6. Bundle 大小
- 首頁 Bundle：[X] KB
- 最大單頁：[X] KB
- 趨勢：[正常/增長]
- 🚦 **狀態**：[正常/警告/異常]

## ✅ 7. TODO 和 DEBT 標籤
- TODO：[X] 個
- FIXME/HACK：[X] 個
- Critical DEBT：[X] 個
- Major DEBT：[X] 個
- 🚦 **狀態**：[正常/需整理]

## ✅ 8. 測試覆蓋率
- 覆蓋率：[X]%
- 未測試檔案：[X] 個
- 🚦 **狀態**：[良好/尚可/不足]

## ✅ 9. 未使用程式碼
- 未使用依賴：[X] 個
- 🚦 **狀態**：[正常/需清理]

---

## 🚦 技術債總評

**整體健康度**：[良好/中等/不良]

### 🔴 Critical（必須處理）
- [列出 Critical 等級的技術債]

### 🟡 Major（應該處理）
- [列出 Major 等級的技術債]

### 🟢 Minor（可延後處理）
- [列出 Minor 等級的技術債]

---

## 📋 行動計劃

**立即處理（本週內）**：
- [ ] [Critical 項目 1]
- [ ] [Critical 項目 2]

**短期處理（本月內）**：
- [ ] [Major 項目 1]
- [ ] [Major 項目 2]

**長期改進（本季內）**：
- [ ] [Minor 項目 1]
- [ ] [Minor 項目 2]

---

## 📊 趨勢追蹤

建議每月執行一次技術債掃描，並記錄以下指標：

| 日期 | 建置時間 | 警告數 | 重複率 | Bundle 大小 | TODO 數 | 覆蓋率 |
|------|----------|--------|--------|-------------|---------|--------|
| YYYY-MM | [X]s | [Y] | [Z]% | [W]KB | [V] | [U]% |
```

---

## 使用時機

**建議執行 `/tech-debt-scan` 的情境**：
- 定期維護（每月一次）
- 感覺開發速度變慢時
- 建置時間明顯增加時
- 加入新團隊成員前（了解技術債狀態）
- 大型重構前（了解現狀）

**目標**：
- 及早發現技術債
- 避免問題累積
- 保持程式碼健康
- 提升開發效率

---

## 相關指令

- `/major-change-check` - 重大變更維護檢查
- `/release-check` - 版本發布前深度檢查
- `/pre-dev-check` - 開發前檢查
- `/opt-status` - 查看優化歷史
