import tcpServer from "../models/tcp-server.js";

const connections = tcpServer();

export async function sendCodeToTcpClient(userId, executeId, code) {
    let job = {
        userId: userId,
        executeId: executeId,
        code: code,
    };

    if (connections.length > 0) {
        const socket = connections[0];
        socket.write(JSON.stringify(job));
        const dataPromise = new Promise((resolve) => {
            socket.on("data", (data) => {
                console.log(`Received data from client1: ${data}`);
                resolve(data);
            });
        });

        const data = await dataPromise;
        return data;
    }
}
