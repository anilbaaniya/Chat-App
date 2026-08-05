import { AppError } from "../utils/appError.js";

// If field value is duplicate
const handleDuplicateFieldsDB = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

// if data is provided in invalid format
const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

// Mongoose Validation error
const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  console.log(errors);
  const message = `Invalid input: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: "Something went very wrong",
    });
  }
};

const handleJWTExpiredErr = () =>
  new AppError("Your token has expired. Please login again!", 401);

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 400;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // console.log(err);
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;

    if (error.name === "CastError") error = handleCastErrorDB(error);

    if (error.code == 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    sendProdError(error, res);
  }
};
