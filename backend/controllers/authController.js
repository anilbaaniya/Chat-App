import { User } from "../models/userModel.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt, { decode } from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

const signinToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signinToken(user._id);
  const isProduction = process.env.NODE_ENV === "production";

  const tokenOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  res.cookie("jwt", token, tokenOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, profilePicture } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    confirmPassword,
    profilePicture,
  });

  createSendToken(user, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }

  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Get a token from the Authorization header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in!", 401));
  }

  // 2) Verified token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  //   console.log(user);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this id does no longer exists.", 401),
    );
  }

  // 4) Check if user changed password after token was issued
  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed the password. Please login again!",
        401,
      ),
    );
  }

  req.user = currentUser;
  next();
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, confirmPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new AppError("No user found!", 404));
  }

  const isCorrectPassword = await user.correctPassword(
    currentPassword,
    user.password,
  );

  if (!isCorrectPassword) {
    return next(new AppError("Current password is wrong!", 400));
  }

  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();

  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0), // instantly expires
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};
