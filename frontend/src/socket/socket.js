import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_API_URL;

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});
