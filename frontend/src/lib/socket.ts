import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const socket = io(WS_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: true,
});