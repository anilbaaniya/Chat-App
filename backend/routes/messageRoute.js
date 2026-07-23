import express from "express";
import { protect } from "../controllers/authController.js";
import {
  deleteMessage,
  getMessages,
  seenMessage,
  sendMessage,
} from "../controllers/messageController.js";

export const messageRoute = express.Router();

messageRoute.use(protect);

messageRoute.route("/").post(sendMessage);

messageRoute.get("/:conversationId", getMessages);

messageRoute.delete("/messageId", deleteMessage);

messageRoute.patch("/messageId/seen", seenMessage);
