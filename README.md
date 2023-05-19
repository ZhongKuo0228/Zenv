# Zenv
Zenv是一個提供線上coding及架設後端伺服器的網站，讓使用者不再受硬體及環境限制，在電腦、平板上都可以隨時隨地進行開發。
* Coding部分提供JavaScrpit、Python、Java、C++，等四種常見的程式語言
* 後端伺服器以Express框架，並提供一種關聯式資料庫Sqlite和快取資料庫Redis可以使用。

##### 網站連結：https://www.zenv.codes/
---
## 技術與功能說明
### 主要核心技術：
1. 以JavaScrpit作爲腳本語言來操作系統進行操作Docker、檔案、Sh腳本等任務。
2. 使用者從瀏覽器送到Server的請求，Server會包裝成任務，透過TCP協定送給Worker，Worker再將結果透過TCP回覆給Server。
3. 使用Docker的容器技術，將每個使用者要運行的程式碼、指令或伺服器操作都獨立，不會互相影響。
4. 使用Docker compose來串聯Express、Redis等服務，創立一個獨立的後端伺服器開發環境。
### 如何在前端呈現編譯器Console log
1. 使用Filebeat來收集每個Docker compose的Logs，Filebeat會將資料送至Logstash進行初步的處理，最後再傳給Server。
2. 爲了能夠更精確的將Logs排序交付給使用者，Server會將收到的資料送到RabbitMQ儲存，待收集到一個量或一段時間後，在送出進行排序，
3. 最後將排序結果透過Socket.IO送到前端，作出像編譯器實時顯示log的效果。

## 網站架構


## 資料庫 Table Schema

## 資源概算

## 監控系統

## 程式部署

## 與我聯絡

