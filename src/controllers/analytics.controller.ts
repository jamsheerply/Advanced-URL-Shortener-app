import { NextFunction, Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";
import { URLService } from "../services/url.service";

export class AnalyticsController {
  private analyticsService: AnalyticsService;
  private urlService: URLService;

  constructor() {
    this.analyticsService = new AnalyticsService();
    this.urlService = new URLService();
  }
  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { shortCode } = req.params;

      const url = await this.urlService.getURL(shortCode);
      if (!url) {
        return res.status(404).json({ error: "URL not found" });
      }

      const analytics = await this.analyticsService.getAliasAnalytics(url._id);

      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }
  async getAnalyticsByTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic } = req.params;
      const analytics = await this.analyticsService.getTopicAnalytics(topic);

      if (!analytics) {
        return res
          .status(404)
          .json({ error: "No data found for the specified topic" });
      }

      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }

  async getOverallAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const urls = await this.urlService.getURLsByUserId(userId);
      if (!urls || urls.length === 0) {
        return res
          .status(404)
          .json({ error: "No URLs found for the authenticated user" });
      }

      const analytics = await this.analyticsService.getOverallAnalytics(
        urls.map((url) => url._id)
      );

      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }
}
