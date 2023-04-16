function messageFormat(message) {
    const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{9}Z (.*)/;
    const match = message.match(regex);
    if (match) {
        const message = match[1];
        return message;
    }
}

export async function logFormat(req) {
    const log = req.body;
    const serverName = log.log.file.path.match(/\/([^/]+)\.log/)[1];
    const message = log.message;
    let result;
    if (message.includes("exited with code")) {
        result = { data: { serverName: serverName, message: "伺服器暫停中" } };
    } else {
        const newMessage = messageFormat(message);
        result = { data: { serverName: serverName, message: newMessage } };
    }
    return result;
}
