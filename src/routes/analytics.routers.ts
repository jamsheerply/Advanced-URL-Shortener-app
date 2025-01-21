import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();
const analyticsController = new AnalyticsController();

router.get(
  "/overall",
  authMiddleware,
  rateLimiter,
  asyncHandler(
    analyticsController.getOverallAnalytics.bind(analyticsController)
  )
);
router.get(
  "/topic/:topic",
  authMiddleware,
  rateLimiter,
  asyncHandler(
    analyticsController.getAnalyticsByTopic.bind(analyticsController)
  )
);
router.get(
  "/:shortCode",
  authMiddleware,
  rateLimiter,
  asyncHandler(analyticsController.getAnalytics.bind(analyticsController))
);

export default router;
