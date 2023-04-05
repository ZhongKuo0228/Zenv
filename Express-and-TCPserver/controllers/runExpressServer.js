import tcpServer from "../models/tcp-server.js";
const connections = tcpServer();

export async function createExpressProject(req) {
    console.log("tcp", "123");
    let job = {
        task: "createServer",
        user: "testman",
        projectName: "firstServer",
        gitRepoUrl: "https://github.com/ZhongKuo0228/express-example.git",
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
