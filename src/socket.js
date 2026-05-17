import { io } from "socket.io-client";

export const socket = io("https://business-3-zwsk.onrender.com", {
  transports: ["websocket"], // 🔥 important
  withCredentials: true,
});