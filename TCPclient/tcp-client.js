import { exec } from "child_process";
import { createPLContainer, rmPLContainer, stopPLContainer, delTempFile } from "./controllers/containerControl.js";

//---tcp server------------------------------------
import net from "net";
// 連接TCP server
const socket = net.createConnection({ port: 8000 }, () => {
    console.log("連接 TCP server 成功");
});

// 收到TCP server的資料時
socket.on("data", async (data) => {
    console.log("從 TCP server 收到訊息:", data.toString());
    const temp = data.toString();
    const job = JSON.parse(temp);

    const executeId = job.executeId;
    const programLanguage = job.programLanguage;
    const code = job.code;

    const createCommand = await createPLContainer(executeId, programLanguage, code);
    const child = exec(createCommand);

    child.stdin.on("exit", (code) => {
        console.log(`Child process exited with code ${code}`);
    });
    child.stdout.on("data", async (data) => {
        console.log(`回傳程式碼執行結果: ${data}`);
        const result = {
            socketId: job.socketId,
            executeId: executeId,
            result: data,
        };
        //回傳運行結果
        socket.write(JSON.stringify(result));

        //處理臨時容器及檔案
        await stopPLContainer(executeId);
        await rmPLContainer(executeId);
        await delTempFile(executeId, programLanguage);
    });
    child.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
    });
});

// 連線關閉時
socket.on("end", () => {
    console.log("與 TCP server 連線關閉");
});

socket.on("error", (err) => {
    console.error("err", err);
});
