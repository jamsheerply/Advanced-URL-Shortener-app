import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/v1/google/url:
 *   get:
 *     summary: Get Google authentication URL
 *     description: Returns the Google OAuth authentication URL.
 *     responses:
 *       302:
 *         description: Redirect to Google authentication page
 */

router.get("/google/url", authController.getGoogleAuthURL.bind(authController));

/**
 * @swagger
 * /api/v1/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the Google OAuth callback and retrieves user information.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: The authorization code received from Google OAuth.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful authentication and user information
 *       400:
 *         description: Missing authorization code
 *       500:
 *         description: Internal server error
 */
router.get(
  "/google/callback",
  asyncHandler(authController.googleCallback.bind(authController))
);

/**
 * @swagger
 * /api/v1/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     description: Refreshes the user's JWT token using the provided refresh token.
 *     responses:
 *       200:
 *         description: Successful response with new access token
 *       401:
 *         description: Unauthorized if refresh token is missing or invalid
 */
router.post(
  "/refresh-token",
  asyncHandler(authController.refreshToken.bind(authController))
);

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     summary: Log out the user
 *     description: Logs out the user by invalidating the refresh token and clearing cookies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful logout
 *       401:
 *         description: Unauthorized if no valid token is provided
 */
router.post(
  "/logout",
  asyncHandler(authMiddleware),
  asyncHandler(authController.logout.bind(authController))
);

export default router;
