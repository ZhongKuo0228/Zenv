import * as fileHandler from "./express_file.js";
import * as jsHandler from "./express_container.js";
import { sqliteCommand } from "../models/sqlite_client.js";
import { redisCommand } from "../models/redis_client.js";
//TODO: sqlite , redis command
import { sendToServer } from "../tcp-client.js";

const handlerMap = {
    ...fileHandler,
    createServer: fileHandler.createFolder,
    readFile: fileHandler.toReadFile,
    ...jsHandler,
    sqliteCommand,
    redisCommand,
};

export async function expressEvent(job) {
    const task = job.task;
    console.log("task", task);
    let result;
    if (handlerMap[task]) {
        result = await handlerMap[task](job);
        sendToServer(JSON.stringify(result));
    } else {
        throw new Error();
    }
}
