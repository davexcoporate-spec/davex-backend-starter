import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

/**
 * Charge le client.config.json du projet (généré par la skill
 * onboarding-client-davex). Le module-loader s'en sert pour savoir
 * quels modules activer (section `features`).
 */
export interface ClientConfig {
  client: {
    name: string;
    slug: string;
    sector: string;
    domain: string;
    language: string;
    country: string;
  };
  offer: {
    plan: "EXPRESS" | "START" | "GROWTH" | "BUSINESS_AI" | "ENTERPRISE";
    sector_pack: string;
  };
  features: Record<string, { enabled: boolean } & Record<string, unknown>>;
  [key: string]: unknown;
}

const CONFIG_PATH = process.env.CLIENT_CONFIG_PATH || "./config/client.config.json";

export function loadClientConfig(): ClientConfig {
  const resolved = path.resolve(process.cwd(), CONFIG_PATH);

  if (!fs.existsSync(resolved)) {
    throw new Error(
      `client.config.json introuvable à ${resolved}. ` +
        `Copiez le fichier généré par la skill onboarding-client-davex dans ./config/.`
    );
  }

  const raw = fs.readFileSync(resolved, "utf-8");
  return JSON.parse(raw) as ClientConfig;
}

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  databaseUrl: process.env.DATABASE_URL || "",
  n8nWebhookBaseUrl: process.env.N8N_WEBHOOK_BASE_URL || "",
};
