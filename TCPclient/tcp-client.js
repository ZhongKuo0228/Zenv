import { exec } from "child_process";
import { PLevent } from "./controllers/PLstockEvent.js";
import { expressEvent } from "./controllers/ExpressStockEvent.js";

//---tcp server------------------------------------
import net from "net";

let isConnected = false;
let socket = null;

function connectToServer() {
    socket = net.createConnection({ port: 8000 }, () => {
        isConnected = true;
        console.log("連接 TCP server 成功");
    });

    socket.on("data", async (data) => {
        console.log("從 TCP server 收到訊息:", data.toString());
        const temp = data.toString();
        const job = JSON.parse(temp);

        if (job.programLanguage != undefined) {
            //處理PLevent
            await PLevent(job);
        } else {
            await expressEvent(job);
        }
    });

    socket.on("end", () => {
        isConnected = false;
        console.log("與 TCP server 連線關閉");
        console.error("err：", "與 TCP server 連線失敗，5秒後重新連線");

        // 等待 5 秒鐘後重新連線
        setTimeout(() => {
            connectToServer();
        }, 5000);
    });

    socket.on("error", (err) => {
        console.error("err：", "與 TCP server 連線失敗，5秒後重新連線");

        // 等待 5 秒鐘後重新連線
        setTimeout(() => {
            connectToServer();
        }, 5000);
    });
}

connectToServer();

function sendData() {}

export default socket;
