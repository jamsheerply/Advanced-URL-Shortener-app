import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(401, "Authentication token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    req.user = decoded;

    next();
  } catch (error) {
    // return res.status(401).json({ message: "Invalid or expired token" });
    next(error);
  }
};
