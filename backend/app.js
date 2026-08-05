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

app.use(
  cors({
    origin: "http://localhost:5173",
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
