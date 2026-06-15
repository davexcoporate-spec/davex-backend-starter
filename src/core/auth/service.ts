import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config";

const SALT_ROUNDS = 10;

export interface TokenPayload {
  sub: string; // user id
  email: string;
  role: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: TokenPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyToken(token: st