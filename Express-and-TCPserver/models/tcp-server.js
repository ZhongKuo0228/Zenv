import net from "net";
const connections = [];

function tcpServer() {
    const server = net.createServer((socket) => {
        console.log("Client connected");

        // 將 socket 物件保存到陣列中
        connections.push(socket);

        // 當接收到資料時，將資料廣播給所有連線
        // socket.on("data", (data) => {
        //     console.log(`Received data from client: ${data}`);

        //     // 將資料廣播給所有連線
        //     connections.forEach((conn) => {
        //         if (conn !== socket && conn.writable) {
        //             conn.write(data);
        //         }
        //     });
        // });

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

    const PORT = 8000;

    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

    // tcpServer.connections = connections;
    return connections;
}
export default tcpServer;
