import type { Express } from "express";
import { ClientConfig } from "../core/config";
import { logger } from "../core/logger";
import registry from "./feature-registry.json";
import contactFormRoutes from "../modules/contact-form/routes";
import crmRoutes from "../modules/crm/routes";

/**
 * Active uniquement les routes des modules présents et `enabled: true`
 * dans client.config.json -> features.
 *
 * Pour ajouter un module :
 * 1. Créer src/modules/<id>/routes.ts (export default un Router Express)
 * 2. L'ajouter au map ci-dessous
 * 3. Le déclarer dans feature-registry.json avec son `configKey`
 */
const moduleRouters: Record<string, ReturnType<typeof contactFormRoutes>> = {
  "contact-form": contactFormRoutes(),
  crm: crmRoutes(),
};

export function registerModules(app: Express, config: ClientConfig) {
  for (const mod of registry.modules) {
    const featureConfig = config.features?.[mod.configKey];
    const enabled = featureConfig?.enabled === true;

    if (!enabled) continue;

    const router = moduleRouters[mod.id];
    if (!router) {
      logger.warn(
        `Module "${mod.id}" activé dans client.config.json mais pas encore implémenté (status: ${mod.status}).`
      );
      continue;
    }

    app.use(`/api/${mod.id}`, router);
    logger.info(`Module activé: ${mod.id} -> /api/${mod.id}`);
  }
}
