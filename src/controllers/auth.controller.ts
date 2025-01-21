import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserModel } from "../models/user.model";
import config from "../config";

export class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  async getGoogleAuthURL(req: Request, res: Response) {
    try {
      const url = await this.authService.getGoogleAuthURL();
      //   res.json({ url });
      res.redirect(url);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async googleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Authorization code required" });
      }

      const { access_token } = await this.authService.getGoogleTokens(code);

      console.log("access_token _google", access_token);

      const googleUser = await this.authService.getGoogleUser(access_token);

      let user = await UserModel.findOne({ googleId: googleUser.id });
      if (!user) {
        user = await UserModel.create({
          email: googleUser.email,
          googleId: googleUser.id,
        });
      }

      const tokens = await this.authService.generateTokens(
        user._id.toString(),
        user.email
      );

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        accessToken: tokens.accessToken,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token required" });
      }

      const tokens = await this.authService.refreshToken(refreshToken);

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: config.env === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken: tokens.accessToken });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await this.authService.revokeRefreshToken(req.user.id);

      res.clearCookie("refreshToken");
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
