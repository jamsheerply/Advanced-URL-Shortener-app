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
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated short URL
 *                   example: "https://yourdomain.com/myalias"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp indicating when the short URL was created
 *                   example: "2025-01-19T09:37:26Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict, URL already exists
 */

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

/**
 * @swagger
 * tags:
 *   - name: Analytics
 * /api/v1/analytics/{shortCode}:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Retrieve detailed analytics for a specific short URL.
 *     description: Provides insights into the performance of a short URL, including total clicks, unique users, and device statistics.
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         description: The unique shortcode representing the shortened URL.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed analytics data for the specified short URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of times the short URL was accessed.
 *                 uniqueUsers:
 *                   type: integer
 *                   description: Number of unique users who accessed the short URL.
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The date of clicks.
 *                       count:
 *                         type: integer
 *                         description: Number of clicks on that date.
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         description: Name of the operating system.
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks from that OS.
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users from that OS.
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         description: Type of device used (e.g., mobile, desktop).
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks from that device type.
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users from that device type.
 *       404:
 *         description: Short URL not found.
 *       500:
 *         description: Server error.
 */
