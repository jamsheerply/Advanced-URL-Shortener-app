import { customAlphabet } from "nanoid";
import { RedisService } from "./redis.service";
import { URLModel } from "../models/url.model";
import { AppError } from "../utils/appError";
import config from "../config";
import { URL } from "../types";

export class URLService {
  private redis: RedisService;
  private nanoid: () => string;

  constructor() {
    this.redis = new RedisService();
    this.nanoid = customAlphabet(
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      7
    );
  }

  async createShortURL(
    userId: string,
    longUrl: string,
    customAlias?: string,
    topic?: string
  ): Promise<{ shortUrl: string; createdAt: Date }> {
    const shortCode = customAlias || this.nanoid();

    // Check cache first
    const existingUrlInCache = await this.redis.getURL(shortCode);
    if (existingUrlInCache)
      throw new AppError(409, "URL already exists in cache");

    // Check database if not found in cache
    const existingUrlInDatabase = await URLModel.findOne({
      customAlias: shortCode,
    });
    if (existingUrlInDatabase)
      throw new AppError(409, "URL already exists in database");

    // Create URL
    const url = await URLModel.create({
      userId,
      longUrl,
      customAlias: shortCode,
      topic,
      isActive: true,
    });

    // Cache the new URL
    await this.redis.setURL(shortCode, {
      longUrl,
      userId,
      customAlias: shortCode,
      isActive: true,
    });

    // Construct the shortUrl
    const shortUrl = `${config.domainName}/api/v1/shorten/${shortCode}`;

    return {
      shortUrl,
      createdAt: url.createdAt,
    };
  }

  async getURL(shortCode: string): Promise<URL | null> {
    // Check cache first
    const cachedUrl = await this.redis.getURL(shortCode);
    if (cachedUrl) return cachedUrl;

    // Get from database
    const url = await URLModel.findOne({ shortCode, isActive: true });
    if (url) {
      await this.redis.setURL(shortCode, url);
    }

    return url;
  }
}
