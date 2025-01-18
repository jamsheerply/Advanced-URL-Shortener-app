import mongoose, { Schema } from "mongoose";
import { User } from "../types";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<User>("User", userSchema);
