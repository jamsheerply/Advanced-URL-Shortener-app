import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  } else {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
