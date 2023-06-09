import tcpServer from "../models/tcpServer.js";

//---使用TCP功能
const connections = tcpServer();

export async function socketWrite(job) {
    try {
        if (connections.length > 0) {
            const socket = connections[0];
            socket.write(JSON.stringify(job));

            // 移除已經存在的socket
            socket.removeAllListeners("data");

            const dataPromise = new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Data receive timeout"));
                }, 60000); //一分鐘內無回應就回覆系統逾時

                socket.on("data", (data) => {
                    clearTimeout(timeout);
                    resolve(data);
                });
            });

            const data = await dataPromise;
            return data;
        } else {
            // Return a rejected Promise when there are no connections
            throw new Error("No available connections");
        }
    } catch (error) {
        if (error.message === "Data receive timeout") {
            console.error("Data receive timeout. Retrying...");
        } else {
            console.error("An error occurred:", error);
        }
    }
}

export function bufferToJson(buffer) {
    if (buffer == undefined) {
        buffer = "tcp Client 回覆異常";
        return buffer;
    } else {
        return JSON.parse(buffer.toString()); //buffer轉成JSON格式
    }
}
// 檢查 buffer 是否符合 JSON 格式
export function isJsonBuffer(buffer) {
    try {
        JSON.parse(buffer.toString());
        return true;
    } catch (e) {
        return false;
    }
}

//---PLcode Job
export async function sendCodeToTcpClient(req) {
    try {
        const code = req.body.data;
        let job = {
            task: code.task,
            executeId: code.executeId,
            code: code.code,
            programLanguage: code.programLanguage,
        };
        const buffer = await socketWrite(job);
        // 檢查 buffer 是否符合 JSON 格式
        if (!isJsonBuffer(buffer)) {
            throw new Error("非 JSON 格式的 buffer 物件");
        }
        return bufferToJson(buffer);
    } catch (err) {
        return {
            error: "程式編譯時發生非預期錯誤",
        };
    }
}

//---Express Job
export async function createExpressProject(req) {
    try {
        const project = req.body.data;

        let job = {
            task: project.task,
            serverName: project.serverName,
            gitRepoUrl: project.gitRepoUrl,
        };

        const buffer = await socketWrite(job);
        return bufferToJson(buffer);
    } catch (e) {
        console.error(e);
    }
}

export async function getFolderIndex(req) {
    try {
        const folderName = req.query.getFolderIndex;
        let job = {
            task: "getFolderIndex",
            folderName: folderName,
        };

        const buffer = await socketWrite(job);
        return bufferToJson(buffer);
    } catch (e) {
        console.error(e);
    }
}

export async function readFile(req) {
    try {
        let job = {
            task: "readFile",
            fileName: req.query.readFile,
        };
        const buffer = await socketWrite(job);
        return bufferToJson(buffer);
    } catch (e) {
        console.error(e);
    }
}

export async function rewriteFile(req) {
    try {
        const project = req.body.data;
        let job = {
            task: project.task,
            fileName: project.fileName,
            editCode: project.editCode,
        };
        const buffer = await socketWrite(job);
        return bufferToJson(buffer);
    } catch (e) {
        console.error(e);
    }
}

export async function fileOperate(req) {
    try {
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
    } catch (e) {
        console.error(e);
    }
}

export async function jsOperate(req) {
    try {
        const project = req.body.data;
        //初始化：init
        //啓動： run
        //停止 ：stop
        //npm 操作

        let job = {
            task: project.task,
            serverName: project.serverName,
            doJob: project.doJob,
        };

        const buffer = await socketWrite(job);
        return bufferToJson(buffer);
    } catch (e) {
        console.error(e);
    }
}

export async function dbOperate(req) {
    try {
        const project = req.body.data;

        let job = {
            task: project.task,
            serverName: project.serverName,
            command: project.command,
        };

        const buffer = await socketWrite(job);
        return bufferToJson(buffer);
    } catch (e) {
        console.error(e);
    }
}

export async function delProject(req) {
    try {
        const userName = req.user.name;
        const projectName = req.body.data.projectName;
        const serverName = `${userName}_${projectName}`;

        let job = {
            task: "delProject",
            serverName: serverName,
        };
        const buffer = await socketWrite(job);
        return bufferToJson(buffer);
    } catch (e) {
        console.error(e);
    }
}
