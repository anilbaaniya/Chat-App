import express from "express";
import { login, signup, protect } from "../controllers/authController.js";
import {
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
} from "../controllers/userController.js";

export const userRoute = express.Router();

userRoute.post("/login", login);
userRoute.post("/signup", signup);
userRoute.route("/getMe").get(protect, getMe);

userRoute.route("/").get(protect, getAllUsers);
userRoute.route("/:id").get(protect, getUser).delete(protect, deleteUser);
