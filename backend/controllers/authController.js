import { User } from "../models/userModel.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt, { decode } from "jsonwebtoken";

const signinToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const user = await User.create({ name, email, password, confirmPassword });

  const token = signinToken(user._id);
  res.status(201).json({
    status: "success",
    token,
    data: user,
  });
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

  const token = signinToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Get a token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in!", 401));
  }

  // 2) Verified token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  //   console.log(user);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this id does no longer exists.", 401),
    );
  }

  // 4) Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
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
