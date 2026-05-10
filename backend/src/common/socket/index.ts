import { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./handlers";

let io: Server;

export function initializeSocket(server: HttpServer) {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
       registerSocketHandlers(socket);
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }

    return io;
}