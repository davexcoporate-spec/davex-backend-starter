import type { NextFunction, Request, Response } from "express";
import { AppError } from "../error-handler";
import { TokenPayload, verifyToken } from "./service";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware d'auth. Attend un header `Authorization: Bearer <token>`.
 * Utilisé par les modules qui nécessitent un utilisateur connecté
 * (dashboard CRM, analytics, etc.).
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "Authentification requise");
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyToken(token);
  } catch {
    throw new AppError(401, "Token invalide ou expiré");
  }

  next();
}
