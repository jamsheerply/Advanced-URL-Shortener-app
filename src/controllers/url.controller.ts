import { NextFunction, Request, Response } from "express";
import { URLService } from "../services/url.service";
import { AppError } from "../utils/appError";
import { AnalyticsService } from "../services/analytics.service";
import requestIp from "request-ip";

export class URLController {
  private urlService: URLService;
  private analyticsService: AnalyticsService;

  constructor() {
    this.urlService = new URLService();
    this.analyticsService = new AnalyticsService();
  }

  async createShortUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { longUrl, customAlias, topic } = req.body;
      if (!req.user || !req.user.id) {
        throw new AppError(401, "Unauthorized");
      }
      const userId = req.user.id;

      const url = await this.urlService.createShortURL(
        userId,
        longUrl,
        customAlias,
        topic
      );
      res.status(201).json(url);
    } catch (error) {
      next(error);
    }
  }

  async redirectUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { shortCode } = req.params;

      if (typeof shortCode !== "string") {
        // return res.status(400).json({ error: "Invalid short code" });
        throw new AppError(400, "Invalid short code");
      }

      const url = await this.urlService.getURL(shortCode);

      if (!url) {
        throw new AppError(404, "URL not found");
      }

      const clientIp = requestIp.getClientIp(req) || "127.0.0.1";
      const normalizedClientIp =
        clientIp === "::1" || clientIp.startsWith("::ffff:127.")
          ? "127.0.0.1"
          : clientIp;

      // Track analytics
      await this.analyticsService.trackClick(
        url._id,
        normalizedClientIp,
        req.headers["user-agent"] || "unknown"
      );

      res.redirect(url.longUrl);
    } catch (error) {
      next(error);
    }
  }
}
