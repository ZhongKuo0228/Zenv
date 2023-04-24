import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

let io;

export async function websStock(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FrontEnd,
        },
    });
    io.on("connection", (socket) => {
        console.log(`Client connected with ID: ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`Client disconnected with ID: ${socket.id}`);
            //保存使用者的結果
        });
    });

    return io;
}

export function getIo() {
    if (!io) {
        throw new Error("websStock must be called before getting io instance.");
    }
    return io;
}
