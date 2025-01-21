/**
 * @swagger
 * tags:
 *   - name: Analytics
 * /api/v1/analytics/overall:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Retrieve overall analytics for all short URLs created by the authenticated user.
 *     description: Provides a comprehensive view of the user's link performance, including total URLs, clicks, unique users, OS and device breakdown.
 *     responses:
 *       200:
 *         description: Overall analytics data for the authenticated user's short URLs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: integer
 *                   description: Total number of short URLs created by the user.
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks across all URLs created by the user.
 *                 uniqueUsers:
 *                   type: integer
 *                   description: Total number of unique users who accessed any of the user's short URLs.
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
 *                         description: Total number of clicks on that date.
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
 *       401:
 *         description: Unauthorized. The user must be authenticated.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * tags:
 *   - name: Analytics
 * /api/v1/analytics/topic/{topic}:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Retrieve analytics for all short URLs under a specific topic.
 *     description: Allows users to assess the performance of links based on categories (topics).
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic under which the URLs are grouped.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analytics data for all short URLs under the specified topic.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks across all URLs in the specified topic.
 *                 uniqueUsers:
 *                   type: integer
 *                   description: Number of unique users who accessed URLs in the specified topic.
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
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         description: The shortened URL.
 *                       totalClicks:
 *                         type: integer
 *                         description: Total number of clicks for the short URL.
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users who accessed the short URL.
 *       404:
 *         description: No URLs found for the specified topic.
 *       500:
 *         description: Server error.
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
