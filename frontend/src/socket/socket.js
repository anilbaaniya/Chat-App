import { io } from "socket.io-client";

const URL = import.meta.env.PROD
  ? "https://chat-app-backend-7xwq.onrender.com"
  : import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});
