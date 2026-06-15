import express from "express";
import cors from "cors";
import { loadClientConfig } from "./config";
import { errorHandler } from "./error-handler";
import { registerModules } from "../registry/module-loader";
import authRoutes from "./auth/routes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const clientConfig = loadClientConfig();

  app.get("/api/client-info", (_req, res) => {
    res.json({
      client: clientConfig.client,
      offer: clientConfig.offer,
    });
  });

  app.use("/api/auth", authRoutes());

  registerModules(app, clientConfig);

  app.use(errorHandler);

  return app;
}
