import { registerSocketEvents } from "./events.js";

let ioInstance;

export const onlineUsers = new Map();

export const initializeSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);
    registerSocketEvents(io, socket);
  });
};

export const getIo = () => ioInstance;
