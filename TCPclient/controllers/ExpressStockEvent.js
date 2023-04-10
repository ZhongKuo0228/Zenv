import { createFolder, getFolderIndex, toReadFile, rewriteFile, operAdd, operDel, operRename } from "./express_file.js";
import { jsOperInit, jsOperRun, jsOperStop, jsOperNpm } from "./express_container.js";
import socket from "../tcp-client.js";

export async function expressEvent(job) {
    const task = job.task;
    console.log("task", task);
    let result;
    switch (task) {
        case "createServer":
            result = await createFolder(job);
            socket.write(JSON.stringify(result));
            break;

        //文件操作
        case "getFolderIndex":
            result = await getFolderIndex(job);
            socket.write(JSON.stringify(result));
            break;
        case "readFile":
            result = await toReadFile(job);
            socket.write(JSON.stringify(result));
            break;
        case "rewriteFile":
            result = await rewriteFile(job);
            socket.write(JSON.stringify(result));
            break;
        case "operAdd":
            result = await operAdd(job);
            socket.write(JSON.stringify(result));
            break;
        case "operDel":
            result = await operDel(job);
            socket.write(JSON.stringify(result));
            break;
        case "operRename":
            result = await operRename(job);
            socket.write(JSON.stringify(result));
            break;

        //NodeJS操作
        case "jsOperInit":
            result = await jsOperInit(job);
            socket.write(JSON.stringify(result));
            break;
        case "jsOperRun":
            result = await jsOperRun(job);
            socket.write(JSON.stringify(result));
            break;
        case "jsOperStop":
            result = await jsOperStop(job);
            socket.write(JSON.stringify(result));
            break;
        case "jsOperNpm":
            result = await jsOperNpm(job);
            socket.write(JSON.stringify(result));
            break;
        //未定義狀況
        default:
            throw new Error();
    }
}
