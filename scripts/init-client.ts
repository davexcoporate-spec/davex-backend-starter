/**
 * Script lancé lors du clonage du starter pour un nouveau client.
 *
 * Étapes prévues :
 *  1. Lire ./config/client.config.json
 *  2. Pour chaque module activé (features.<x>.enabled === true) présent
 *     dans feature-registry.json, vérifier qu'il est implémenté
 *  3. Lancer `prisma migrate deploy`
 *  4. Afficher un récapitulatif des modules actifs et de ceux manquants
 *
 * Squelette uniquement pour l'instant (Sem. 5 du plan).
 */
import { loadClientConfig } from "../src/core/config";
import registry from "../src/registry/feature-registry.json";

function main() {
  const config = loadClientConfig();
  console.log(`Initialisation backend pour: ${config.client.name} (${config.client.slug})`);
  console.log(`Offre: ${config.offer.plan} — pack: ${config.offer.sector_pack}`);

  for (const mod of registry.modules) {
    const enabled = config.features?.[mod.configKey]?.enabled === true;
    if (enabled) {
      console.log(`  - ${mod.id}: activé (status registry: ${mod.status})`);
    }
  }

  console.log("\nProchaine étape: npx prisma migrate deploy");
}

main();
