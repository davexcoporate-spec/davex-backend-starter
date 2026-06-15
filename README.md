# davex-backend-starter

Backend standardise DAVEX - clonable dans chaque projet client (`projects/[slug-client]/backend`).
Stack 100% open-source / gratuite, sans dependance a un vendor (pas de Supabase).

Voir [`PLAN.md`](./PLAN.md) pour l'architecture complete et le calendrier de mise en oeuvre.

## Stack

- Node.js 20 + TypeScript + Express
- PostgreSQL + Prisma
- JWT (auth maison, bcrypt)
- n8n (automation WhatsApp/notifs - webhooks)
- Docker / docker-compose

## Demarrage rapide

```bash
cp .env.example .env
cp config/client.config.example.json config/client.config.json
docker compose up -d        # lance Postgres (+ API en dev)
npm install
npx prisma migrate dev
npm run seed                # cree le compte admin (ADMIN_EMAIL/ADMIN_PASSWORD dans .env)
npm run dev
```

## Auth

- `POST /api/auth/login` - `{ email, password }` -> `{ token, user }`
- `GET /api/auth/me` - header `Authorization: Bearer <token>` -> utilisateur courant
- Compte admin cree via `npm run seed` (1 admin par defaut, suffisant EXPRESS/START ;
  roles multi-utilisateurs a etendre si un client GROWTH+ en a besoin)

## Cloner pour un nouveau client

1. Copier `config/client.config.json` du dossier projet client (genere par la skill
   `onboarding-client-davex`).
2. `npm run init-client` - active les modules selon `features` et lance les migrations.
3. `docker compose up -d`

## Modules disponibles

Voir `src/registry/feature-registry.json` pour la liste complete et le statut
(disponible / en cours / planifie) de chaque module.
