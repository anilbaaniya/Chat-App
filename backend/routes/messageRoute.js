import express from "express";
import { protect } from "../controllers/authController.js";
import {
  deleteMessageForEveryone,
  deleteMessageForMe,
  getMessages,
  // seenMessage,
  sendMessage,
} from "../controllers/messageController.js";

export const messageRoute = express.Router();

messageRoute.use(protect);

messageRoute.route("/").post(sendMessage);

messageRoute.get("/:conversationId", getMessages);

messageRoute.patch("/:messageId/delete-for-everyone", deleteMessageForEveryone);

messageRoute.patch("/:messageId/delete-for-me", deleteMessageForMe);

// messageRoute.patch("/:messageId/seen", seenMessage);
