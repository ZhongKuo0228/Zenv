import tcpServer from "../models/tcp-server.js";

const connections = tcpServer();

export async function sendCodeToTcpClient(req) {
    const code = req.body.data;
    let job = {
        socketId: code.socketId,
        executeId: code.executeId,
        code: code.code,
        programLanguage: code.programLanguage,
    };
    // console.log("job", job);

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
