import { AnalyticsModel } from "../models/analytics.model";
import { RedisService } from "./redis.service";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import mongoose from "mongoose";
import { URLModel } from "../models/url.model";

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

    const location = geoip.lookup(ipAddress);

    let type = device.type || "unknown";
    if (!device.type) {
      if (
        ["windows", "macos", "linux"].includes(os.name?.toLowerCase() || "")
      ) {
        type = "desktop";
      } else if (["android", "ios"].includes(os.name?.toLowerCase() || "")) {
        type = "mobile";
      }
    }

    await AnalyticsModel.create({
      urlId,
      ipAddress,
      device: {
        type,
        os: os.name || "unknown",
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

  async getAliasAnalytics(urlId: string) {
    const cacheKey = `analytics:${urlId}`;
    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) return JSON.parse(cachedData);

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const analytics = await AnalyticsModel.aggregate([
      {
        $match: {
          urlId: new mongoose.Types.ObjectId(urlId),
          timestamp: { $gte: sevenDaysAgo, $lte: now },
        },
      },
      {
        $facet: {
          totalClicks: [{ $count: "total" }],
          uniqueUsers: [
            {
              $group: {
                _id: "$ipAddress",
              },
            },
            { $count: "unique" },
          ],
          clicksByDate: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
                },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                date: "$_id",
                count: 1,
                _id: 0,
              },
            },
          ],
          osType: [
            {
              $group: {
                _id: "$device.os",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" },
              },
            },
            {
              $project: {
                osName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
                _id: 0,
              },
            },
          ],
          deviceType: [
            {
              $group: {
                _id: "$device.type",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" },
              },
            },
            {
              $project: {
                deviceName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          totalClicks: { $arrayElemAt: ["$totalClicks.total", 0] },
          uniqueUsers: { $arrayElemAt: ["$uniqueUsers.unique", 0] },
          clicksByDate: 1,
          osType: 1,
          deviceType: 1,
        },
      },
    ]);

    await this.redis.set(cacheKey, JSON.stringify(analytics[0]), 60);

    return analytics[0];
  }

  async getTopicAnalytics(topic: string) {
    const cacheKey = `analytics:topic:${topic}`;

    const cachedData = await this.redis.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit");
      return JSON.parse(cachedData);
    }

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const analytics = await URLModel.aggregate([
      {
        $match: {
          topic: topic,
        },
      },
      {
        $lookup: {
          from: "analytics",
          localField: "_id",
          foreignField: "urlId",
          as: "analyticsData",
        },
      },
      {
        $unwind: "$analyticsData",
      },
      {
        $match: {
          "analyticsData.timestamp": { $gte: sevenDaysAgo, $lte: now },
        },
      },
      {
        $facet: {
          totalClicks: [{ $count: "total" }],
          uniqueUsers: [
            {
              $group: {
                _id: "$analyticsData.ipAddress",
              },
            },
            { $count: "unique" },
          ],
          clicksByDate: [
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$analyticsData.timestamp",
                  },
                },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                date: "$_id",
                count: 1,
                _id: 0,
              },
            },
          ],
          urls: [
            {
              $group: {
                _id: "$_id",
                shortUrl: { $first: "$customAlias" },
                totalClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$analyticsData.ipAddress" },
              },
            },
            {
              $project: {
                shortUrl: 1,
                totalClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          totalClicks: { $arrayElemAt: ["$totalClicks.total", 0] },
          uniqueUsers: { $arrayElemAt: ["$uniqueUsers.unique", 0] },
          clicksByDate: 1,
          urls: 1,
        },
      },
    ]);

    await this.redis.set(cacheKey, JSON.stringify(analytics[0]), 60);

    return analytics[0];
  }

  async getOverallAnalytics(urlIds: string[]) {
    const cacheKey = `analytics:overall:${urlIds.join(",")}`;

    const cachedData = await this.redis.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached data");
      return JSON.parse(cachedData);
    }

    const analytics = await AnalyticsModel.aggregate([
      {
        $match: { urlId: { $in: urlIds } },
      },
      {
        $facet: {
          totalUrls: [{ $group: { _id: "$urlId" } }, { $count: "total" }],
          totalClicks: [{ $count: "total" }],
          uniqueUsers: [
            { $group: { _id: "$ipAddress" } },
            { $count: "unique" },
          ],
          clicksByDate: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
                },
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                date: "$_id",
                count: 1,
                _id: 0,
              },
            },
          ],
          osType: [
            {
              $group: {
                _id: "$device.os",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" },
              },
            },
            {
              $project: {
                osName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
                _id: 0,
              },
            },
          ],
          deviceType: [
            {
              $group: {
                _id: "$device.type",
                uniqueClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$ipAddress" },
              },
            },
            {
              $project: {
                deviceName: "$_id",
                uniqueClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $project: {
          totalUrls: { $arrayElemAt: ["$totalUrls.total", 0] },
          totalClicks: { $arrayElemAt: ["$totalClicks.total", 0] },
          uniqueUsers: { $arrayElemAt: ["$uniqueUsers.unique", 0] },
          clicksByDate: 1,
          osType: 1,
          deviceType: 1,
        },
      },
    ]);

    await this.redis.set(cacheKey, JSON.stringify(analytics[0]), 60);

    return analytics[0];
  }
}
