import { Socket } from "socket.io";

export function registerSocketHandlers(socket: Socket) {
    console.log(`Connected: ${socket.id}`);

    // Join a room specific to a poll to receive live updates
    socket.on("poll:subscribe", (pollId: string) => {
        socket.join(`poll_${pollId}`);
        console.log(`Socket ${socket.id} subscribed to poll_${pollId}`);
    });

    // Leave the poll room
    socket.on("poll:unsubscribe", (pollId: string) => {
        socket.leave(`poll_${pollId}`);
        console.log(`Socket ${socket.id} unsubscribed from poll_${pollId}`);
    });

    socket.on("disconnect", () => {
        console.log(`Disconnected: ${socket.id}`);
    });
}