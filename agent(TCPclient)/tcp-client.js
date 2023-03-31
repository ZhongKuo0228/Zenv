import { exec } from "child_process";
import { writeFile } from "node:fs/promises";
//---tcp server------------------------------------
import net from "net";
// 連接TCP server
const socket = net.createConnection({ port: 8000 }, () => {
    console.log("連接 TCP server 成功");
});

// 收到TCP server的資料時
socket.on("data", async (data) => {
    console.log("從 TCP server 收到訊息:", data.toString());
    // 處理資料
    // socket.write(data);

    //     const temp = data.toString();
    //     const job = JSON.parse(temp);
    //     const fileName = `${job.executeId}.js`;

    //     await writeFile(fileName, job.code);

    //     const command = `docker run -v /Users/zhongkuo/Desktop/Back-End-Class-Batch19/MyCodeLab/js_control_linux/${fileName}:/app/${fileName} node:18-alpine node /app/${fileName}`; //使用exec所以-it要拿掉
    //     const child = exec(command);

    //     child.stdin.on("exit", (code) => {
    //         console.log(`Child process exited with code ${code}`);
    //     });
    //     child.stdout.on("data", (data) => {
    //         console.log(`stdout: ${data}`);
    //         job.result = data;
    //         socket.write(JSON.stringify(job));
    //     });
    //     child.stderr.on("data", (data) => {
    //         console.log(`stderr: ${data}`);
    //     });
});

// 連線關閉時
socket.on("end", () => {
    console.log("與 TCP server 連線關閉");
});

socket.on("error", (err) => {
    console.error("err", err);
});
