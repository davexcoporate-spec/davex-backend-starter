import { Router } from "express";

/**
 * Module contact-form (Sem. 2 du plan).
 * Prévu :
 *  - POST /api/contact-form  -> stocke la soumission (Prisma) + envoie vers
 *    le webhook n8n (client.config.json -> features.contact_form.webhook_url)
 *    + déclenche l'auto-réponse configurée.
 *  - GET  /api/contact-form  -> liste les soumissions (auth requise, dashboard CRM).
 *
 * Squelette uniquement pour l'instant.
 */
export default function contactFormRoutes() {
  const router = Router();

  router.post("/", (_req, res) => {
    res.status(501).json({ error: "contact-form: pas encore implémenté" });
  });

  router.get("/", (_req, res) => {
    res.status(501).json({ error: "contact-form: pas encore implémenté" });
  });

  return router;
}
