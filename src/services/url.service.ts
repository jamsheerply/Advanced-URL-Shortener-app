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
    const alias = customAlias || this.nanoid();
    console.log(`Generating customAlias: ${alias}`);

    if (!alias) {
      throw new AppError(400, "Invalid custom alias");
    }

    const existingUrlInCache = await this.redis.getURL(alias);
    if (existingUrlInCache) {
      throw new AppError(
        409,
        `URL with alias '${alias}' already exists in cache`
      );
    }

    const existingUrlInDatabase = await URLModel.findOne({
      customAlias: alias,
    });
    if (existingUrlInDatabase) {
      throw new AppError(
        409,
        `URL with alias '${alias}' already exists in database`
      );
    }

    const url = await URLModel.create({
      userId,
      longUrl,
      customAlias: alias,
      topic: topic || "default",
      isActive: true,
    });

    await this.redis.setURL(alias, url);

    return {
      shortUrl: `${config.domainName}/api/v1/shorten/${alias}`,
      createdAt: url.createdAt,
    };
  }

  async getURL(alias: string): Promise<URL | null> {
    const cachedUrl = await this.redis.getURL(alias);
    if (cachedUrl) return cachedUrl;

    const url = await URLModel.findOne({
      customAlias: alias,
      isActive: true,
    });

    if (url) {
      await this.redis.setURL(alias, url);
    }

    return url;
  }

  async getURLsByUserId(userId: string) {
    try {
      const urls = await URLModel.find({ userId });
      return urls;
    } catch (error) {
      throw new Error("Error retrieving URLs");
    }
  }
}
