# Zenv
Zenv是一個提供線上coding及架設後端伺服器的網站，讓使用者不再受硬體及環境限制，在電腦、平板上都可以隨時隨地進行開發。
* Coding部分提供JavaScrpit、Python、Java、C++，等四種常見的程式語言
* 後端伺服器以Express框架，並提供一種關聯式資料庫Sqlite和快取資料庫Redis可以使用。

##### 網站連結：https://www.zenv.codes/
---
## 技術與功能說明
### 主要核心技術：
1. 以JavaScrpit作爲scripting language來操作系統進行操作Docker、檔案、Sh腳本等任務。
2. 使用者從瀏覽器送到Server的請求，Server會包裝成任務，透過TCP協定送給Worker，Worker再將結果透過TCP回覆給Server。
3. 使用Docker的容器技術，將每個使用者要運行的程式碼、指令、或伺服器操作都獨立開，不會互相影響。

## 網站架構

## 資料庫 Table Schema

## 資源概算

## 監控系統

## 程式部署

## 與我聯絡

