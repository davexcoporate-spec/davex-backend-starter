import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { AppError } from "../error-handler";
import { requireAuth } from "./middleware";
import { signToken, verifyPassword } from "./service";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Auth de base pour le dashboard client (1 admin par défaut, créé via
 * `npm run seed`). Suffisant pour EXPRESS/START ; les rôles multi-utilisateurs
 * pourront être étendus plus tard si un client GROWTH+ en a besoin.
 */
export default function authRoutes() {
  const router = Router();

  router.post("/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Email ou mot de passe invalide");
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new AppError(401, "Identifiants incorrects");
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  router.get("/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
  });

  return router;
}
