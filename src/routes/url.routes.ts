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

/**
 * @swagger
 * components:
 *   schemas:
 *     URL:
 *       type: object
 *       properties:
 *         shortUrl:
 *           type: string
 *           description: The generated short URL
 *           example: "https://yourdomain.com/myalias"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp indicating when the short URL was created
 *           example: "2025-01-19T09:37:26Z"
 */

/**
 * @swagger
 * /api/v1/shorten:
 *   post:
 *     summary: Create a short URL
 *     tags: [URL]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://example.com"
 *               customAlias:
 *                 type: string
 *                 example: "myalias"
 *               topic:
 *                 type: string
 *                 example: "tech"
 *     responses:
 *       201:
 *         description: URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/URL'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict, URL already exists
 */
router.post(
  "/",
  authMiddleware,
  rateLimiter,
  validateRequest(createShortUrlSchema),
  urlController.createShortUrl.bind(urlController)
);

/**
 * @swagger
 * /api/v1/shorten/{shortCode}:
 *   get:
 *     summary: Redirect to the long URL
 *     description: >
 *       This endpoint will redirect to the original long URL.
 *       Note: The redirect won't work directly in Swagger UI -
 *       please copy the returned URL and open it in a new tab.
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         schema:
 *           type: string
 *           pattern: "^[0-9a-zA-Z]{7}$"
 *         required: true
 *         description: The short URL code
 *     responses:
 *       302:
 *         description: Redirect to the long URL
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *             description: The URL to redirect to
 *       400:
 *         description: Invalid short code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get(
  "/:shortCode",
  validateRequest(shortCodeSchema, "params"),
  asyncHandler(urlController.redirectUrl.bind(urlController))
);
export default router;
