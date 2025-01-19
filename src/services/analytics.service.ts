import { AnalyticsModel } from "../models/analytics.model";
import { RedisService } from "./redis.service";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

export class AnalyticsService {
  private redis: RedisService;

  constructor() {
    this.redis = new RedisService();
  }

  async trackClick(
    urlId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    const location = geoip.lookup(ipAddress);

    await AnalyticsModel.create({
      urlId,
      ipAddress,
      userAgent,
      device: {
        type: device.type || "unknown",
        os: os.name || "unknown",
        browser: browser.name || "unknown",
      },
      location: location
        ? {
            country: location.country,
            city: location.city,
            coordinates: location.ll,
          }
        : {
            country: "unknown",
            city: "unknown",
            coordinates: [0, 0],
          },
    });
  }
}
