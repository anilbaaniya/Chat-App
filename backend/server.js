import { app } from "./app.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import { connectDatabase } from "./db.js";
import { initializeSocket } from "./sockets/socket.js";

dotenv.config({ path: "./config.env" });

connectDatabase();

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://chat-app-livid-zeta-ppwu7son99.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/.*\.vercel\.app$/i.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

// initialize the socket
initializeSocket(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
