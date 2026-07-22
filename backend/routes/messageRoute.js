import express from "express";
import { protect } from "../controllers/authController.js";
import { sendMessage } from "../controllers/messageController.js";

export const messageRoute = express.Router();

messageRoute.route("/").post(protect, sendMessage);
