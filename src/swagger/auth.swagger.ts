/**
 * @swagger
 * /api/v1/auth/google/url:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get Google authentication URL
 *     description: Returns the Google OAuth authentication URL.
 *     responses:
 *       302:
 *         description: Redirect to Google authentication page
 */

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     tags:
 *       - Auth
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

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh JWT token
 *     description: Refreshes the user's JWT token using the provided refresh token.
 *     responses:
 *       200:
 *         description: Successful response with new access token
 *       401:
 *         description: Unauthorized if refresh token is missing or invalid
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
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
