import dotenv from "dotenv";
dotenv.config();

export default {
  mongodb: {
    url: process.env.MONGODB_URL!,
  },
  redis: {
    password: process.env.REDIS_PASSWORD!,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_REDIRECT_URI!,
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    userInfoEndpoint: "https://www.googleapis.com/oauth2/v2/userinfo",
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET!,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET!,
    accessTokenExpiry: "1d",
    refreshTokenExpiry: "7d",
  },
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!, 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS!, 10),
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    nodeEnv: process.env.NODE_ENV || "development",
  },
  env: process.env.NODE_ENV,
  domainName: process.env.DOMAIN_NAME,
};
