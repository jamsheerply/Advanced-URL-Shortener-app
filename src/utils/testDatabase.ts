import mongoose from "mongoose";
import config from "../config";

const connectToDatabase = async () => {
  await mongoose.connect(config.mongodb.url);
};

const closeDatabase = async () => {
  await mongoose.connection.close();
};

export { connectToDatabase, closeDatabase };
