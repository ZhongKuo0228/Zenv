import tcpServer from "../models/tcp-server.js";

const connections = tcpServer();

export async function sendCodeToTcpClient(userId, executeId, code) {
    let job = {
        userId: userId,
        executeId: executeId,
        code: code,
    };
    if (connections.length > 0) {
        connections[0].write(JSON.stringify(job));
    }
}
