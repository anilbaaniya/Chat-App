import express from "express";
import {
  createConversation,
  getConversation,
  getConversations,
} from "../controllers/conversationController.js";

export const conversationRoute = express.Router();

conversationRoute.route("/").post(createConversation).get(getConversations);
conversationRoute.route("/:conversationId").get(getConversation);
