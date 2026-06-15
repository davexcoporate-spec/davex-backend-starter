import { describe, expect, it } from "vitest";
import { hashPassword, signToken, verifyPassword, verifyToken } from "../src/core/auth/service";

describe("auth/service", () => {
  it("hash + vérifie un mot de passe", async () => {
    const hash = await hashPassword("motdepasse123");
    expect(await verifyPassword("motdepasse123", hash)).toBe(true);
    expect(await verifyPassword("mauvais", hash)).toBe(false);
  });

  it("signe et vérifie un token", () => {
    const token = signToken({ sub: "user-1", email: "admin@davexco.com", role: "admin" });
    const payload = verifyToken(token);
    expect(payload.sub).toBe("user-1");
    expect(payload.email).toBe("admin@davexco.com");
    expect(payload.role).toBe("admin");
  });

  it("rejette un token invalide", () => {
    expect(() => verifyToken("token-invalide")).toThrow();
  });
});
