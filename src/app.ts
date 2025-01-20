import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routers";
import urlRoutes from "./routes/url.routes";
import analyticsRoutes from "./routes/analytics.routers";
import config from "./config";
import setupSwagger from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import requestIp from "request-ip";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/shorten", urlRoutes);
app.use("/api/v1/analytics", analyticsRoutes);

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
