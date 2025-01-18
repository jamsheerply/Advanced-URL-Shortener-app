import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routers";
// import authRoutes from "./routes/auth.routers";
import config from "./config";
import setupSwagger from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api", urlRoutes);

// custom Error handling middleware
app.use(errorHandler);

// Database connection
mongoose
  .connect(config.mongodb.url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

setupSwagger(app);

// Start server
const port = config.server.port;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
