export interface User {
  _id: string;
  email: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export interface TokenPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface URL {
  _id: string;
  userId: string;
  longUrl: string;
  // shortCode: string;
  customAlias?: string;
  topic?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface Analytics {
  _id: string;
  urlId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  device: {
    type: string;
    os: string;
    browser: string;
  };
  location: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
}

export * from "./custom";
