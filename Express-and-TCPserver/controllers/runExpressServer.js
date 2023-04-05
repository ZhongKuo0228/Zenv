import tcpServer from "../models/tcp-server.js";

const connections = tcpServer();

export async function createExpressProject(req) {
    const project = req.body.data;
    let job = {
        task: project.task,
        userId: project.userId,
        projectName: project.projectName,
        gitRepoUrl: project.gitRepoUrl,
    };

    if (connections.length > 0) {
        const socket = connections[0];
        socket.write(JSON.stringify(job));

        const dataPromise = new Promise((resolve) => {
            socket.on("data", (data) => {
                console.log(`Received data from client: ${data}`);
                resolve(data);
            });
        });

        const data = await dataPromise;
        return data;
    }
}
