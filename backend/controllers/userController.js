import { User } from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/appError.js";

export const getAllUsers = catchAsync(async (req, res, next) => {
  const search = req.query.search?.trim();

  // Don't return all users if search is empty
  if (!search) {
    return res.status(200).json({
      status: "success",
      result: 0,
      data: [],
    });
  }

  const users = await User.find({
    _id: { $ne: req.user._id },
    name: {
      $regex: `^${search}`,
      $options: "i",
    },
  }).select("-password");

  res.status(200).json({
    status: "success",
    result: users.length,
    data: users,
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with this id!", 400));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with this id!", 400));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("No user found!", 400));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});
