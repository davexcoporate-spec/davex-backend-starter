import { PrismaClient } from "@prisma/client";

// Client Prisma unique partagé par tous les modules.
// DATABASE_URL pointe vers un Postgres standard (self-host, Neon, Railway...).
export const prisma = new PrismaClient();
