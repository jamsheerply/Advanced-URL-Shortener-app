import mongoose, { Schema } from "mongoose";
import { Analytics } from "../types";

const analyticsSchema = new Schema({
  urlId: { type: Schema.Types.ObjectId, ref: "URL", required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  device: {
    type: { type: String },
    os: { type: String },
    browser: { type: String },
  },
  location: {
    country: { type: String },
    city: { type: String },
    coordinates: { type: [Number], index: "2dsphere" },
  },
});

analyticsSchema.index({ urlId: 1, timestamp: 1 });

export const AnalyticsModel = mongoose.model<Analytics>(
  "Analytics",
  analyticsSchema
);
