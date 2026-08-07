import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { globalErrorHandler } from "./controllers/errorController.js";
import { userRoute } from "./routes/userRoute.js";
import { conversationRoute } from "./routes/conversationRoute.js";
import { messageRoute } from "./routes/messageRoute.js";
import { signRoute } from "./routes/signRoute.js";

export const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://chat-app-livid-zeta-ppwu7son99.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
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
  }),
);

// app.use(
//   rateLimit({
//     windowMs: 10 * 60 * 1000,
//     max: 1000,
//   }),
// );

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  //   console.log(req.headers);
  next();
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/conversations", conversationRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/generateSignature", signRoute);

// global error handler
app.use(globalErrorHandler);
