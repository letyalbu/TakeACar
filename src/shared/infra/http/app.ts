import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import "express-async-errors";
import { AppError } from "@shared/errors/AppError";
import createConnection from "@shared/infra/typeorm";

import { router } from "./routes";

import "@shared/container";

createConnection();

const app = express();

app.use(express.json());

const swaggerDocument = YAML.load("./src/swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({ message: err.message });
    }
    return response.status(500).json({
      status: "error",
      message: `Internal server error" - ${err.message}`,
    });
  }
);

export { app };
