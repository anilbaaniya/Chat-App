import { onlineUsers } from "./socket.js";

export const emitToUser = (io, userId, event, data) => {
  const sockets = onlineUsers.get(userId.toString());

  if (!sockets) return;

  sockets.forEach((socketId) => {
    io.to(socketId).emit(event, data);
  });
};
