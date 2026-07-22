import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./controllers/errorController.js";
import { userRoute } from "./routes/userRoute.js";
import { conversationRoute } from "./routes/conversationRoute.js";
import { messageRoute } from "./routes/messageRoute.js";

export const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  //   console.log(req.headers);
  next();
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/conversations", conversationRoute);
app.use("/api/v1/messages", messageRoute);

// global error handler
app.use(globalErrorHandler);
