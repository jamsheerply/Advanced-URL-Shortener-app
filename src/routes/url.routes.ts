import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";
import { URLController } from "../controllers/url.controller";
import { validateRequest } from "../validations/validateRequest";
import {
  createShortUrlSchema,
  shortCodeSchema,
} from "../validations/urlValidation";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const urlController = new URLController();

router.post(
  "/",
  authMiddleware,
  rateLimiter,
  validateRequest(createShortUrlSchema),
  urlController.createShortUrl.bind(urlController)
);
router.get(
  "/:shortCode",
  validateRequest(shortCodeSchema, "params"),
  asyncHandler(urlController.redirectUrl.bind(urlController))
);
export default router;
