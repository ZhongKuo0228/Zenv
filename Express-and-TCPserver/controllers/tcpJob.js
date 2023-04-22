import tcpServer from "../models/tcpServer.js";
import { updateExpiredTime } from "../models/db-webServices.js";
import { getUserID } from "../models/db-user.js";

//---使用TCP功能
const connections = tcpServer();

async function socketWrite(job) {
    try {
        if (connections.length > 0) {
            const socket = connections[0];
            socket.write(JSON.stringify(job));

            // Remove existing 'data' event handler before adding a new one
            socket.removeAllListeners("data");

            const dataPromise = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Data receive timeout"));
                }, 10000); // Set your desired timeout value (e.g., 10000 milliseconds)

                socket.on("data", (data) => {
                    // console.log("收到client", data);
                    clearTimeout(timeout);
                    resolve(data);
                });
            });

            const data = await dataPromise;
            return data;
        } else {
            // Return a rejected Promise when there are no connections
            return Promise.reject(new Error("No available connections"));
        }
    } catch (error) {
        if (error.message === "Data receive timeout") {
            console.error("Data receive timeout. Retrying...");
            // Retry sending data or notify the user...
        } else {
            console.error("An error occurred:", error);
        }
    }
}

function bufferToJson(buffer) {
    if (buffer == undefined) {
        buffer = "tcp Client 回覆異常";
        // console.log(buffer);
        return buffer;
    } else {
        return JSON.parse(buffer.toString()); //buffer轉成JSON格式
    }
}

//---PLcode Job
export async function sendCodeToTcpClient(req) {
    const code = req.body.data;
    let job = {
        task: code.task,
        executeId: code.executeId,
        code: code.code,
        programLanguage: code.programLanguage,
    };
    const buffer = await socketWrite(job);
    // console.log("buffer", buffer);
    return bufferToJson(buffer);
}

//---Express Job
export async function createExpressProject(req) {
    const project = req.body.data;

    let job = {
        task: project.task,
        serverName: project.serverName,
        gitRepoUrl: project.gitRepoUrl,
    };

    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}

export async function getFolderIndex(req) {
    const folderName = req.query.getFolderIndex;
    let job = {
        task: "getFolderIndex",
        folderName: folderName,
    };
    
    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}

export async function readFile(req) {
    let job = {
        task: "readFile",
        fileName: req.query.readFile,
    };
    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}

export async function rewriteFile(req) {
    const project = req.body.data;
    console.log("r", project);
    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}

export async function fileOper(req) {
    const project = req.body.data;

    //新增檔案 : add
    //刪除 : del
    //重新命名 : rename

    let job = {
        task: project.task,
        type: project.type,
        fileName: project.fileName,
    };

    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}

export async function jsOper(req) {
    const project = req.body.data;
    console.log("jsOper", project);

    //初始化：init  ：node/npm-install → docker-compose up → 取得port → docker-compose stop -t 1 <container> //TODO:後續要優化停止方式
    //啓動： run  : docker-compose start <container>
    //停止 ：stop : docker-compose stop -t 1 <container> //TODO:後續要優化停止方式
    //npm 操作： npm  :node/npm "指令"

    let job = {
        task: project.task,
        serverName: project.serverName,
        doJob: project.doJob,
    };

    console.log(job);

    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}

export async function dbOper(req) {
    const project = req.body.data;
    console.log("dbOper", project);

    let job = {
        task: project.task,
        serverName: project.serverName,
        command: project.command,
    };

    console.log(job);

    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}
