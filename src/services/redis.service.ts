import { createClient, RedisClientType } from "redis";
import config from "../config";

export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      username: "default",
      password: config.redis.password,
      socket: {
        host: "redis-14571.c98.us-east-1-4.ec2.redns.redis-cloud.com",
        port: 14571,
      },
    });

    this.client
      .connect()
      .catch((err) => console.error("Redis connection error:", err));
  }

  async set(key: string, value: any, ttl: number = 86400): Promise<void> {
    await this.client.setEx(key, ttl, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async setURL(
    shortCode: string,
    data: any,
    ttl: number = 86400
  ): Promise<void> {
    await this.set(`url:${shortCode}`, data, ttl);
  }

  async getURL(shortCode: string): Promise<any> {
    return this.get(`url:${shortCode}`);
  }
}
