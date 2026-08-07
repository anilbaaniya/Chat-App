import express from "express";
import {
  createConversation,
  deleteConversationForMe,
  getConversation,
  getConversations,
  markConversationAsSeen,
} from "../controllers/conversationController.js";
import { protect } from "../controllers/authController.js";

export const conversationRoute = express.Router();

conversationRoute.use(protect);

conversationRoute.route("/").post(createConversation).get(getConversations);
conversationRoute.route("/:conversationId").get(getConversation);

conversationRoute.patch("/:conversationId/seen", markConversationAsSeen);

conversationRoute.patch(
  "/:conversationId/delete-for-me",
  deleteConversationForMe,
);
