# 鈴聲音檔下載指南

本專案使用 7 種溫和舒適、音樂旋律風格的鈴聲。音檔需要手動下載並放置到此目錄。

## 📋 所需音檔列表

| 檔名 | 名稱 | 特徵 | 建議長度 |
|------|------|------|---------|
| `sound-gentle.mp3` | 柔和鈴聲 | 溫暖鐘聲漸強 | 3-8 秒 |
| `sound-melody.mp3` | 輕鬆旋律 | 8音階柔和樂句 | 3-8 秒 |
| `sound-birds.mp3` | 清晨鳥鳴 | 自然鳥聲合成 | 3-8 秒 |
| `sound-chime.mp3` | 優雅琴音 | 鋼琴和弦序列 | 3-8 秒 |
| `sound-bell.mp3` | 輕快鐘聲 | 銀鈴快速序列 | 3-8 秒 |
| `sound-clock.mp3` | 溫柔時鐘 | 鐘擺+輕鐘聲 | 3-8 秒 |
| `sound-magic.mp3` | 魔幻樂音 | 五聲音階東方風 | 3-8 秒 |

## 🎵 音檔規格要求

- **格式**：MP3
- **採樣率**：44.1 kHz
- **位元率**：128-192 kbps
- **長度**：3-8 秒（應用會自動循環播放）
- **音量**：-20dB 到 -10dB（避免過大）
- **聲道**：立體聲或單聲道均可

## 🌐 推薦下載來源

### Pixabay Sound Effects（最推薦）
- 網址：https://pixabay.com/sound-effects/
- 特色：完全免費、無需註冊、無版權
- 搜尋關鍵字："gentle alarm", "bell chime", "notification"

### Freesound.org
- 網址：https://freesound.org
- 需註冊但免費
- 搜尋關鍵字："meditation bell", "alarm soft"

## 📝 下載步驟

1. 前往 Pixabay Sound Effects
2. 搜尋相關關鍵字
3. 試聽並選擇喜歡的音效
4. 下載 MP3 格式
5. 重新命名為對應檔名（如 `sound-gentle.mp3`）
6. 放置到 `public/sounds/` 目錄
7. 重新啟動開發伺服器

## ⚠️ 注意事項

- 確保音檔格式為 MP3
- 避免選擇過於刺耳的音效
- 音檔應該可以順暢循環播放
- 檢查音量適中
- 確認授權許可（使用 CC0 或 Public Domain）
