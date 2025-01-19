import { Request, Response, NextFunction } from "express";
import { RedisService } from "../services/redis.service";
import config from "../config";
import { AppError } from "../utils/appError";

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const redis = new RedisService();

  if (!req.user || !req.user.id) {
    throw new AppError(401, "Unauthorized");
  }

  const userId = req.user.id;

  try {
    const currentCount = await redis.getRateLimit(userId);
    if (currentCount >= config.rateLimit.maxRequests) {
      throw new AppError(429, "Rate limit exceeded");
    }

    await redis.setRateLimit(
      userId,
      currentCount + 1,
      config.rateLimit.windowMs
    );
    next();
  } catch (error) {
    next(error);
  }
};
