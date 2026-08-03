import express from "express";
import {
  login,
  signup,
  protect,
  changePassword,
  logout,
} from "../controllers/authController.js";
import {
  deleteUser,
  getAllUsers,
  getMe,
  getUser,
  updateMe,
} from "../controllers/userController.js";

export const userRoute = express.Router();

userRoute.post("/login", login);
userRoute.post("/signup", signup);

userRoute.post("/logout", logout);

userRoute.patch("/updatePassword", protect, changePassword);

userRoute.route("/getMe").get(protect, getMe);
userRoute.route("/updateMe").patch(protect, updateMe);

userRoute.route("/").get(protect, getAllUsers);
userRoute.route("/:id").get(protect, getUser).delete(protect, deleteUser);
