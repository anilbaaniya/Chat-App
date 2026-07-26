import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import { globalErrorHandler } from "./controllers/errorController.js";
import { userRoute } from "./routes/userRoute.js";
import { conversationRoute } from "./routes/conversationRoute.js";
import { messageRoute } from "./routes/messageRoute.js";

export const app = express();

app.use(helmet());

app.use(cors());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use(mongoSanitize());

app.use(xss());

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

// global error handler
app.use(globalErrorHandler);
