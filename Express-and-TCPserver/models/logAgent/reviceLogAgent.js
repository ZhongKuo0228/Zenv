function messageFormat(message) {
    const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{9}Z (.*)/;
    const match = message.match(regex);
    if (match) {
        const message = match[1];
        return message;
    }
}

export async function logFormat(batchData) {
    try {
        // console.log("batchData", batchData);
        const serverName = batchData.log.file.path.match(/\/([^/]+)\.log/)[1];
        const logMessage = batchData.message;

        let result;
        if (logMessage.includes("exited with code")) {
            result = {
                data: { serverName: serverName, timestamp: "9999-01-01T00:00:00.000000000Z", message: "伺服器暫停中" },
            };
        } else {
            const regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{9}Z) (.*)$/;
            const match = logMessage.match(regex);
            // console.log("match", match);
            let timestamp;
            let message;

            if (match == null) {
                timestamp = "0001-01-01T00:00:00.000000000Z"; //最小的ISO 8601 格式時間戳
                const regexZ = /Z\s+(.*)$/;
                const matchZ = logMessage.match(regexZ);
                message = matchZ[1];
            } else {
                timestamp = match[1];
                message = match[2];
            }
            result = { data: { serverName: serverName, timestamp: timestamp, message: message } };
        }
        return result;
    } catch (err) {
        console.err("logFormat錯誤", err.message);
    }
}

export async function groupedLogs(logs) {}
