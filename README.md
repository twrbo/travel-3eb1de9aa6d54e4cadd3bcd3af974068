# Travel Index

私人旅程靜態網站，網址統一為「國家 → 出發日期」。城市是旅程資料，不另設城市入口目錄。

已確認的下一階段頁面規格：[行程詳細頁規格 v1](docs/itinerary-page-spec.md)。後續共用模板與元件依此實作；目前頁面尚未完成這份規格的改版。

```text
index.html                      首頁（自動產生）
japan/
  index.html                    日本清單（自動產生）
  2026-12-18/index.html          東京行程
  2027-03-19/index.html          東京行程
korea/
  index.html                    韓國清單（自動產生）
  2026-08-22/index.html          首爾行程
assets/
  archive.css                   國家清單樣式
  css/                          首頁、行程、航班與導覽樣式
  js/                           共用頁籤、首爾互動與舊網址轉址
data/
  trips.json                    國家、旅程摘要與舊網址對照的唯一來源
  trips/seoul-2026-08-22.js      首爾地圖資料的最終版本
templates/                      首頁與國家清單的 HTML 模板
scripts/                        產生頁面與檢查工具
404.html                        不支援 _redirects 平台的舊網址備援
_redirects                      支援此格式的平台使用的 301 設定（自動產生）
```

## 本機使用

需要 Python 3.10 以上；檢查 JavaScript 時另需 Node.js 18 以上。不需安裝套件。

```powershell
python scripts/build.py
python scripts/check.py
python -m http.server 8000
```

開啟 http://localhost:8000/ 。產生後的 HTML 與資源直接提交、部署即可，線上執行不需要 Python 或 Node.js。

## 修改與新增旅程

1. 在 `data/trips.json` 修改國家與旅程摘要。
2. 新增旅程時建立 `<country>/<startDate>/index.html`。`id` 必須唯一；目前每個國家同一天只能有一個旅程網址。日期採 `YYYY-MM-DD`，結束日期不可早於開始日期。
3. 行程 HTML 需包含 `<!-- TRIP_NAV_START -->` 與 `<!-- TRIP_NAV_END -->`，導覽會自動填入；可從現有旅程頁複製此結構。引用共用樣式時使用 `../../assets/`。
4. 執行 `python scripts/build.py`，自動更新首頁趟數、國家卡片、依出發日排序的清單、旅程導覽與轉址設定。
5. 執行 `python scripts/check.py`，檢查產物是否更新、站內檔案與錨點、重複 ID、JavaScript 語法與舊網址對照。

請修改 `templates/home.html`、`templates/country.html`，不要直接修改產生的首頁或國家清單。每日行程卡片、航班與住宿目前仍在各行程 HTML 中維護；本次尚未實作完整行程 schema、編輯表單、登入、資料庫或跨裝置同步。

## 舊網址

舊的 `tokyo/`、`tokyo/2026/`、`tokyo/2027/`、`korea/2026/` 目錄已移除。對照統一維護在 `data/trips.json` 的 `legacyRoutes`。

- Cloudflare Pages／Netlify：可使用產生的 `_redirects` 做 HTTP 301。
- GitHub Pages：不讀取 `_redirects`，改透過專案根目錄的 `404.html` 與 JavaScript 導到新頁面，支援專案子路徑、query string 與 hash；最初回應仍為 HTTP 404，並非伺服器 301。
- 其他主機：需確認會提供根目錄的自訂 `404.html`，或依對照設定伺服器轉址。
- `python -m http.server` 不會套用 `_redirects` 或自訂 404，僅適合預覽現行頁面；轉址程式由檢查腳本驗證，正式主機行為仍需部署後確認。

## 資料範圍

首爾地圖資料與互動程式已分開，並將原本後續覆寫的路線與候選餐廳收斂為最終資料，保留原有有效內容。HTML 行程卡片與地圖資料目前仍需共同維護；下一階段才將兩者統一為活動資料。

`noindex` 不提供存取控制。現有行程含私人訂單資訊，新增公開分享功能前需另外定義可分享欄位與身分驗證。
