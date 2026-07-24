import { emitToUser } from "./emit.js";
import { onlineUsers } from "./socket.js";

export const registerSocketEvents = (io, socket) => {
  socket.on("join-chat", (userId) => {
    if (!userId) return;
    const id = userId.toString();

    socket.userId = id;

    if (!onlineUsers.has(id)) {
      onlineUsers.set(id, new Set());
    }

    onlineUsers.get(id).add(socket.id);
    console.log(onlineUsers);
  });

  socket.on("disconnect", () => {
    if (!socket.userId) return;

    const sockets = onlineUsers.get(socket.userId);

    if (!sockets) return;

    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(socket.userId);
    }

    console.log("Disconnected:", socket.id);
  });

  socket.on("typing", ({ receiverId }) => {
    emitToUser(io, receiverId, "typing", { senderId: socket.userId });
  });

  socket.on("stop-typing", ({ receiverId }) => {
    emitToUser(io, receiverId, "stop-typing", { senderId: socket.userId });
  });
};
