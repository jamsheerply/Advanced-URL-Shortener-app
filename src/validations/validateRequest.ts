import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { AppError } from "../utils/appError";

export const validateRequest =
  (schema: Schema, property: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      next(new AppError(400, error.details[0].message));
    } else {
      next();
    }
  };
