import { consumeFromQueue } from "../models/queue.js";

import { logFormat } from "../models/logAgent/reviceLogAgent.js";
// 將log用webSocket送到前端
import { getIo } from "../models/webSocket.js";

export async function sendLogToWeb() {
    try {
        const queue = "logSort";
        const handleData = (data) => {
            // Process the individual data if needed
            console.log("Received data:", data);
        };

        const handleBatch = async (batchDataArray) => {
            const formattedLogs = await Promise.all(batchDataArray.map(logFormat));
            // console.log("formattedLogs", formattedLogs);

            formattedLogs.sort((a, b) => {
                const dateA = new Date(a.data.timestamp);
                const dateB = new Date(b.data.timestamp);
                const nanosecondsA = parseInt(a.data.timestamp.split(".")[1], 10);
                const nanosecondsB = parseInt(b.data.timestamp.split(".")[1], 10);

                if (dateA.getTime() === dateB.getTime()) {
                    return nanosecondsA - nanosecondsB;
                } else {
                    return dateA - dateB;
                }
            });
            // console.log("Sorted formatted logs:", formattedLogs);
            //將排序好的資料送回前端
            formattedLogs.forEach((log) => {
                const io = getIo();
                io.emit(log.data.serverName, log.data.message);
            });
        };
        consumeFromQueue(queue, handleData, handleBatch);
    } catch (e) {
        console.error(e);
    }
}
