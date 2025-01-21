import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const authController = new AuthController();

router.get("/google/url", authController.getGoogleAuthURL.bind(authController));
router.get(
  "/google/callback",
  asyncHandler(authController.googleCallback.bind(authController))
);
router.post(
  "/refresh-token",
  asyncHandler(authController.refreshToken.bind(authController))
);
router.post(
  "/logout",
  asyncHandler(authMiddleware),
  asyncHandler(authController.logout.bind(authController))
);

export default router;
