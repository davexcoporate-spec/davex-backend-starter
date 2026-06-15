import type { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "Erreur interne du serveur" });
}
