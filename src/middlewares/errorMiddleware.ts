import type { NextFunction, Request } from "express";
import type { CustomResponse } from "../types/response";

type CustomError = {
  statusCode?: number;
  name?: string;
  message?: string;
};

const errorMiddleware = (
  err: CustomError,
  _req: Request,
  res: CustomResponse,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let error = err.name || "Internal Server Error";
  let message = err.message || "Something went wrong";
  if (err.name === "Duplicate") {
    statusCode = 409;
    error = "Conflict";
    message = "email already exists";
  }
  if (err.name == "LoginError") {
    error = "InvalidLogin";
    message = "Please input email or password";
    statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    error = "Unauthorized";
    message = "Invalid token";
  }

  res.status(statusCode).json({ statusCode, error, message });
};

export default errorMiddleware;
