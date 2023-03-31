import net from "net";
const tcpServer = async () => {
    const server = net.createServer((socket) => {
        // 確認連線建立
        console.log("TCP client 已連線");

        // setTimeout(() => {
        //     let job = {
        //         userId: "xxx",
        //         executeId: "adfasdf",
        //         code: 'console.log("hello tcp");',
        //     };
        //     socket.write(JSON.stringify(job));
        // }, 1000);

        // 從TCP收到的訊息
        socket.on("data", (data) => {
            console.log("從TCP client 收到", data.toString());
        });

        //連線關閉後時
        socket.on("end", () => {
            console.log("TCP client 已斷開連線");
        });

        socket.on("error", (err) => {
            console.error(err);
        });
    });

    server.listen(8000, () => {
        console.log("TCP Server Is Running");
    });
};
//---export-----------------------------------------
export { tcpServer };
