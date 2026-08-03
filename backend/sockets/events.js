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
    // console.log(onlineUsers);
    // broadcast updated online users list to all connected clients
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    if (!socket.userId) return;

    const sockets = onlineUsers.get(socket.userId);

    if (!sockets) return;

    sockets.delete(socket.id);

    if (sockets.size === 0) {
      onlineUsers.delete(socket.userId);
    }

    // broadcast updated online users list to all connected clients
    io.emit("online-users", Array.from(onlineUsers.keys()));

    // console.log("Disconnected:", socket.id);
  });

  socket.on("typing", ({ receiverId, conversationId }) => {
    emitToUser(io, receiverId, "typing", {
      senderId: socket.userId,
      conversationId,
    });
  });

  socket.on("stop-typing", ({ receiverId, conversationId }) => {
    emitToUser(io, receiverId, "stop-typing", {
      senderId: socket.userId,
      conversationId,
    });
  });
};
