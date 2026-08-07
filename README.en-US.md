

# Zenv
Zenv is a web platform that provides online coding and backend server hosting, allowing users to develop anytime and anywhere on computers or tablets without being restricted by hardware or environment.
* The coding environment supports four common programming languages: JavaScript, Python, Java, and C++.
* The backend server uses the Express framework and provides a relational database (SQLite) and a caching database (Redis) for use.

##### Website Link: https://www.zenv.codes/
##### Demo Video: https://www.youtube.com/watch?v=aEUfZeOUhOM 
---
## Technical and Feature Overview
### Core Technologies:
1. JavaScript is used as the scripting language to interact with the OS to perform tasks such as managing Docker, files, and shell scripts.
2. Requests sent from the user's browser to the server are packaged into tasks by the server, transmitted to the Worker via TCP, and the Worker returns the results to the server via TCP.
3. Docker containerization is used to isolate each user's code, commands, or server operations, preventing interference between them.
4. Docker Compose is used to link services like Express and Redis, creating an isolated backend server development environment.
### How to Display Compiler Console Logs on the Frontend
1. Filebeat collects logs from each Docker Compose environment. The data is sent to Logstash for initial processing, and finally forwarded to the server.
2. To precisely sort and deliver logs to users, the server stores received data in RabbitMQ. Once a certain amount is collected or a time interval elapses, the data is batch-processed and sorted before being sent.
3. The sorted results are finally sent to the frontend via Socket.IO, enabling real-time log display similar to a compiler console.
![consolelog_demo](https://github.com/ZhongKuo0228/Zenv/assets/119053086/246af9f4-0722-4506-b574-96f10e2c14c9)


## Website Architecture and Operation
### Architecture Diagram:
![截圖 2023-05-19 下午6 06 06](https://github.com/ZhongKuo0228/Zenv/assets/119053086/d70b1743-7122-4367-94ce-e8c577155137)
### Programming Language Compilation
![PLpage (1)](https://github.com/ZhongKuo0228/Zenv/assets/119053086/8c66f021-a74d-4d3a-be58-1e30561355a3)
### User Personal Backend Server Operation
![WebServer](https://github.com/ZhongKuo0228/Zenv/assets/119053086/71fcfa06-3373-45a3-9630-8222cc4d6f50)
### Personal Backend Server Architecture
![image](https://github.com/ZhongKuo0228/Zenv/assets/119053086/735f41b5-666a-42b6-869a-39e5ce505f82)



## Database Table Schema

![db](https://github.com/ZhongKuo0228/Zenv/assets/119053086/c2056f51-4bd6-4d7a-b23f-2a3155f505b6)

## Resource Estimation
To prevent certain tasks from consuming excessive computational resources, Docker resources for each service are restricted as follows:
### Programming Language Compilation:
#### Test Conditions: (The script generates an array of 100,000 random numbers, then repeatedly calls a function to store the indices and values of these numbers in an object. Finally, the execution time for this load test is measured.)
➤ Resource Configuration: Each programming language execution is allocated a maximum of 0.5 CPU and 192MB of memory.
![截圖 2023-05-19 下午5 25 39](https://github.com/ZhongKuo0228/Zenv/assets/119053086/2f9e7eed-750b-4fbb-86f0-5593d95609db)
Code reference: https://github.com/ZhongKuo0228/docker_practice/blob/main/dockerLimitTest/heavyTas4js.js
### Express Server: (A custom e-commerce website was used as the load testing target. Load tests were conducted using K6, with a standard of 100 requests per second.)
➤ Resource Configuration: Each user is allocated 0.5 CPU and 128MB of memory.
![截圖 2023-05-19 下午5 25 51](https://github.com/ZhongKuo0228/Zenv/assets/119053086/9f447a52-b81f-4677-918a-a64a9a6824eb)
### Redis Database Configured for Each Express Instance: (The built-in Redis benchmark tool was used for testing, simulating 1,000 cache requests per second.)
➤ Resource Configuration: Each user is allocated 0.25 CPU and 16MB of memory.
https://drive.google.com/file/d/1TGkUuSkK_BQDTb6NZkOLQ_TVhMd1uNiU/view?usp=sharing

## Monitoring System
Prometheus and Grafana are used for system monitoring:
* Server Status: The `node-exporter` Prometheus exporter is used to monitor the server's status.
![截圖 2023-05-19 下午6 27 19](https://github.com/ZhongKuo0228/Zenv/assets/119053086/e2b080c2-f29b-4262-96f3-98eff4db0cc7)

* Docker Container Status: `Cadvisor` is used as an exporter to monitor the resource usage of Docker containers on the server.
![截圖 2023-05-19 下午7 25 33](https://github.com/ZhongKuo0228/Zenv/assets/119053086/44fa5609-83df-4008-877b-025e9ff5408e)

All the above services are launched using Docker. Please refer to the configuration file: https://github.com/ZhongKuo0228/docker_practice/blob/main/monitor/docker-compose.yml

## Contact
Author: Zhong Kuo (Guo Yaozhong)

Email: rt019623@gmail.com

If you encounter any issues or have suggestions while using the website, please feel free to contact me. Thank you for your feedback.
