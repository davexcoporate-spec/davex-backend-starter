/**
 * Logger minimal. À remplacer par pino/winston si besoin plus tard,
 * mais évite d'ajouter une dépendance dès le départ.
 */
export const logger = {
  info: (...args: unknown[]) => console.log("[info]", ...args),
  warn: (...args: unknown[]) => console.warn("[warn]", ...args),
  error: (...args: unknown[]) => console.error("[error]", ...args),
};
