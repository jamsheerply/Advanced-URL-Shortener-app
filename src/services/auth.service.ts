// src/services/auth.service.ts
import axios from "axios";
import config from "../config";
import jwt from "jsonwebtoken";
import { RedisService } from "./redis.service";
import { AuthTokens, GoogleUserProfile, TokenPayload } from "../types";
import { AppError } from "../utils/appError";

export class AuthService {
  private redis: RedisService;

  constructor() {
    this.redis = new RedisService();
  }

  async getGoogleAuthURL(): Promise<string> {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: config.google.redirectUri,
      client_id: config.google.clientId,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const queryString = new URLSearchParams(options);
    return `${rootUrl}?${queryString.toString()}`;
  }

  async getGoogleTokens(code: string): Promise<any> {
    const url = config.google.tokenEndpoint;
    const values = {
      code,
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      redirect_uri: config.google.redirectUri,
      grant_type: "authorization_code",
    };

    try {
      const response = await axios.post(url, new URLSearchParams(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching Google tokens:", error.response?.data);
      throw new AppError(400, "Failed to get Google tokens");
    }
  }

  async getGoogleUser(accessToken: string): Promise<GoogleUserProfile> {
    try {
      const response = await axios.get<GoogleUserProfile>(
        config.google.userInfoEndpoint,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching Google user:", error.response?.data);
      throw new AppError(400, "Failed to get Google user info");
    }
  }

  async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const payload: TokenPayload = { id: userId, email };

    const accessToken = jwt.sign(payload, config.jwt.accessTokenSecret, {
      expiresIn: config.jwt.accessTokenExpiry,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshTokenSecret, {
      expiresIn: config.jwt.refreshTokenExpiry,
    });

    await this.redis.set(
      `refresh_token:${userId}`,
      refreshToken,
      7 * 24 * 60 * 60
    );

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(
        token,
        config.jwt.accessTokenSecret
      ) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new AppError(401, "Invalid access token");
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshTokenSecret
      ) as TokenPayload;

      const storedToken = await this.redis.get(`refresh_token:${decoded.id}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new AppError(401, "Invalid refresh token");
      }

      return this.generateTokens(decoded.id, decoded.email);
    } catch (error) {
      throw new AppError(401, "Invalid refresh token");
    }
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.redis.del(`refresh_token:${userId}`);
  }
}
