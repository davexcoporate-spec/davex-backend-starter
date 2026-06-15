/**
 * Crée (ou met à jour) le compte admin par défaut du dashboard client.
 *
 * Variables d'env attendues (dans .env) :
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME (optionnel)
 *
 * Usage : npm run seed
 */
import dotenv from "dotenv";
import { prisma } from "../src/core/db";
import { hashPassword } from "../src/core/auth/service";

dotenv.config();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env");
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, name },
    create: { email, password: hashed, name, role: "admin" },
  });

  console.log(`Compte admin prêt: ${user.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
