import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

let io;

export async function websStock(httpServer) {
    try {
        io = new Server(httpServer, {
            cors: {
                origin: process.env.FrontEnd,
            },
        });
        io.on("connect", (socket) => {
            console.log(`Client connected with ID: ${socket.id}`);
            socket.on("disconnect", () => {
                console.log(`Client disconnected with ID: ${socket.id}`);
            });
        });

        return io;
    } catch (e) {
        console.error(e);
    }
}

export function getIo() {
    if (!io) {
        throw new Error("websStock must be called before getting io instance.");
    }
    return io;
}
