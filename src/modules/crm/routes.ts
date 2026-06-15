import { Router } from "express";

/**
 * Module CRM (Sem. 3 du plan) — leads/contacts pour GROWTH+/BUSINESS AI.
 * Alimente la skill rapport-mensuel-client.
 * Squelette uniquement pour l'instant.
 */
export default function crmRoutes() {
  const router = Router();

  router.get("/leads", (_req, res) => {
    res.status(501).json({ error: "crm: pas encore implémenté" });
  });

  return router;
}
