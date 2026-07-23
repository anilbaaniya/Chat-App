import { app } from "./app.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import { connectDatabase } from "./db.js";
import { initializeSocket } from "./sockets/socket.js";

dotenv.config({ path: "./config.env" });

connectDatabase();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// initialize the socket
initializeSocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
