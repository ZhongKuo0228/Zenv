# Zenv
Zenv是一個提供線上 coding 及架設後端伺服器的網站，讓使用者不再受硬體及環境限制，在電腦、平板上都可以隨時隨地進行開發。
* Coding 部分提供 JavaScrpit 、 Python 、 Java 、 C++，等四種常見的程式語言
* 後端伺服器以 Express 框架，並提供一種關聯式資料庫 Sqlite 和快取資料庫Redis可以使用。

##### 網站連結：https://www.zenv.codes/
##### Demo影片：https://www.youtube.com/watch?v=aEUfZeOUhOM 
---
## 技術與功能說明
### 主要核心技術：
1. 以 JavaScrpit 作爲腳本語言來操作系統進行操作 Docker 、檔案、Sh腳本等任務。
2. 使用者從瀏覽器送到Server的請求， Server 會包裝成任務，透過TCP協定送給 Worker ， Worker 再將結果透過 TCP 回覆給 Server。
3. 使用 Docker 的容器技術，將每個使用者要運行的程式碼、指令或伺服器操作都獨立，不會互相影響。
4. 使用 Docker compose 來串聯 Express、Redis 等服務，創立一個獨立的後端伺服器開發環境。
### 如何在前端呈現編譯器Console log
1. 使用 Filebeat 來收集每個 Docker compose 的 Logs，Filebeat 會將資料送至 Logstash 進行初步的處理，最後再傳給 Server。
2. 爲了能夠更精確的將 Logs 排序交付給使用者，Server 會將收到的資料送到 RabbitMQ 儲存，待收集到一個量或一段時間後，在送出進行排序，
3. 最後將排序結果透過 Socket.IO 送到前端，作出像編譯器實時顯示 log 的效果。

## 網站架構與運作方式
### 程式語言編譯
![PLpage (1)](https://github.com/ZhongKuo0228/Zenv/assets/119053086/8c66f021-a74d-4d3a-be58-1e30561355a3)
### 後端伺服器運作
![WebServer (1)](https://github.com/ZhongKuo0228/Zenv/assets/119053086/ea5b848d-72f4-476c-8453-ec10fbc27a8f)

## 資料庫 Table Schema

![db](https://github.com/ZhongKuo0228/Zenv/assets/119053086/c2056f51-4bd6-4d7a-b23f-2a3155f505b6)

## 資源概算
爲避免部分任務佔用太多運算資源，每個服務使用的 Docker 資源都會有所限制，
### 程式語言編譯：
#### 測試條件：（讓程式語言生成了一個包含10萬個隨機數的陣列，然後通過重複呼叫函式，將這些隨機數的索引與值存儲到物件中。最後，計算出執行這個負載測試的時間。）
➤資源配置方案 : 每次程式語言執行使用最大0.5cpu及192MB的記憶做使用。
![截圖 2023-05-19 下午5 25 39](https://github.com/ZhongKuo0228/Zenv/assets/119053086/2f9e7eed-750b-4fbb-86f0-5593d95609db)
程式碼請參考：https://github.com/ZhongKuo0228/docker_practice/blob/main/dockerLimitTest/heavyTas4js.js
### Express 伺服器：（以一個自製的電商網站爲壓測對象，使用K6進行壓測，以每秒100個請求爲標準進行記錄）
➤資源配置方案 : 給與每位使用者 0.5cpu 及 128MB 的記憶做使用。
![截圖 2023-05-19 下午5 25 51](https://github.com/ZhongKuo0228/Zenv/assets/119053086/9f447a52-b81f-4677-918a-a64a9a6824eb)
### 每個 Express 配置的 Redis 資料庫：（使用redis 自帶的壓測工具 redis benchmark，以每秒1000個快取需求進行測試）
➤資源配置方案 : 給與每位使用者 0.25cpu 及 16MB 的記憶做使用。
https://drive.google.com/file/d/1TGkUuSkK_BQDTb6NZkOLQ_TVhMd1uNiU/view?usp=sharing

## 監視系統
使用 Prometheus 與 Grafana 來進行系統的監視
### 伺服器本身的狀態
採用 Prometheus 的套件 node-exporter 作爲 Exporter，來抓取目前伺服器的狀態。
### 伺服器上Docker容器的狀態
使用 Cadvisor 作爲 Exporter 來獲取目前伺服上Docker各個容器使用資源的狀態。

以上服務都使用Docker來啓動，設定檔請參考：https://github.com/ZhongKuo0228/docker_practice/blob/main/monitor/docker-compose.yml

## 程式部署

## 與我聯絡
作者 ： Zhong Kuo (郭耀中)
信箱 ： rt019623@gmail.com

若網站使用上有遇到任何狀況或建議，請與我聯絡，感謝您的回饋。


