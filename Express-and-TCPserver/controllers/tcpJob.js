import tcpServer from "../models/tcpServer.js";
//---使用TCP功能
const connections = tcpServer();

async function socketWrite(job) {
    if (connections.length > 0) {
        const socket = connections[0];
        socket.write(JSON.stringify(job));

        const dataPromise = new Promise((resolve) => {
            socket.on("data", (data) => {
                // console.log(`Received data from client: ${data}`);
                resolve(data);
            });
        });
        const data = await dataPromise;
        return data;
    }
}

function bufferToJson(buffer) {
    return JSON.parse(buffer.toString()); //buffer轉成JSON格式
}

//---PLcode Job
export async function sendCodeToTcpClient(req) {
    const code = req.body.data;
    let job = {
        socketId: code.socketId,
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
        userId: project.userId,
        projectName: project.projectName,
        gitRepoUrl: project.gitRepoUrl,
    };
    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}

export async function getFolderIndex(req) {
    let job = {
        task: "getFolderIndex",
        folderName: req.query.getFolderIndex,
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

    let job = {
        task: project.task,
        fileName: project.fileName,
        editCode: project.editCode,
    };
    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}

export async function fileOper(req) {
    const project = req.body.data;
    console.log("oper", project);

    //新增檔案 : add
    //刪除 : del
    //重新命名 : rename

    let job = {
        task: project.task,
        type: project.type,
        fileName: project.fileName,
    };

    console.log(job);

    const buffer = await socketWrite(job);
    return bufferToJson(buffer);
}
