import { createFolder, getFolderIndex, toReadFile, rewriteFile } from "./express_file.js";
import socket from "../tcp-client.js";

export async function expressEvent(job) {
    const task = job.task;
    if (task == "createServer") {
        const result = await createFolder(job);
        //回傳運行結果
        socket.write(JSON.stringify(result));
    } else if (task == "getFolderIndex") {
        const result = await getFolderIndex(job);
        //回傳運行結果
        socket.write(JSON.stringify(result));
    } else if (task == "readFile") {
        const result = await toReadFile(job);
        //回傳運行結果
        socket.write(JSON.stringify(result));
    } else if (task == "rewriteFile") {
        const result = await rewriteFile(job);
        //回傳運行結果
        socket.write(JSON.stringify(result));
    } else {
    }
}
