import { Application } from "express";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import config from "../config";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation for Advanced URL Shortener app",
      version: "1.0.0",
      description:
        "API Documentation with Bearer Token and with Comprehensive Analytics, Custom Aliases, and Rate Limiting",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis:
    config.env === "production"
      ? ["./dist/swagger/*.js"]
      : ["./src/swagger/*.ts"],
};

console.log(
  `Swagger docs path: ${
    config.env === "production" ? "./dist/swagger/*.js" : "./src/swagger/*.ts"
  }`
);

const specs = swaggerJsdoc(options);

export default (app: Application) => {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
