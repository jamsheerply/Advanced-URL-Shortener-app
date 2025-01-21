import mongoose, { Schema } from "mongoose";
import { URL } from "../types";

const urlSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  longUrl: { type: String, required: true },
  customAlias: { type: String, required: true, unique: true },
  topic: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
});

urlSchema.index({ userId: 1, topic: 1 });

export const URLModel = mongoose.model<URL>("URL", urlSchema);
