import net from "net";
import dotenv from "dotenv";
dotenv.config();

const connections = [];

function tcpServer() {
    const server = net.createServer((socket) => {
        console.log("Client connected");

        // 將 socket 物件保存到陣列中
        connections.push(socket);
        console.log(`There are currently ${connections.length} connections.`);

        // 當連線關閉時，從陣列中移除 socket 物件
        socket.on("close", () => {
            console.log("Client disconnected");
            const index = connections.indexOf(socket);
            if (index !== -1) {
                connections.splice(index, 1);
            }
        });

        // 當發生錯誤時，記錄錯誤訊息
        socket.on("error", (err) => {
            console.error(`Socket error: ${err}`);
        });
    });

    server.listen(process.env.TCP_SERVER_PORT, () => {
        console.log(`Server listening on port ${process.env.TCP_SERVER_PORT}`);
    });

    // tcpServer.connections = connections;
    return connections;
}
export default tcpServer;
