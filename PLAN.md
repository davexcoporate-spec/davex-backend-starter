# Plan — Backend standardisé DAVEX (davex-backend-starter)

Objectif : un repo backend unique, open-source, clonable dans chaque projet client
(comme `davex-starter` côté frontend), avec un système de modules activables selon
l'offre (EXPRESS/START/GROWTH/BUSINESS AI/ENTERPRISE) et le pack sectoriel.

## 1. Stack retenue (gratuite, open-source, aucun vendor lock-in)

| Brique | Choix | Pourquoi |
|---|---|---|
| Runtime | Node.js 20 LTS + TypeScript | Standard, même écosystème que le frontend (Next.js) |
| Framework API | Express | Simple, ultra documenté, facile à reprendre par un autre dev |
| Base de données | PostgreSQL | Open-source, portable : self-host (Docker/VPS) ou n'importe quel hébergeur (Neon, Railway, Render — tous interchangeables) |
| ORM | Prisma | Migrations versionnées, type-safe, ne dépend d'aucun hébergeur précis |
| Auth | JWT (jsonwebtoken + bcrypt), fait main | Pas de dépendance à un service d'auth externe (contrairement à Supabase Auth) |
| Validation | Zod | Léger, partagé avec le frontend si besoin |
| Automatisation WhatsApp/notifs | n8n (déjà utilisé — `webhook_url` dans `client.config.json`) | On ne réimplémente pas l'automation, le backend expose juste des webhooks que n8n consomme/déclenche |
| Stockage fichiers (option GROWTH+) | MinIO (S3-compatible, self-hostable) ou disque local | Évite AWS/Supabase Storage |
| Conteneurisation | Docker + docker-compose | `docker compose up` = Postgres + API en local, identique en prod |
| Déploiement | VPS (Hetzner/Contabo) ou free tier Render/Railway/Fly.io | Portable, Postgres standard → migration possible sans réécriture |

Pourquoi pas Supabase : on garde la même base de données (Postgres) mais sans
dépendre de leur couche Auth/Realtime/Storage propriétaire. Si Supabase devient
instable, on pointe juste vers un autre Postgres — zéro changement de code.

## 2. Architecture — Feature Registry

Le backend est un **monolithe modulaire** : un `core` toujours présent, et des
`modules` activés ou non selon `client.config.json` (même fichier que celui généré
par la skill `onboarding-client-davex`, section `features`).

```
davex-backend-starter/
├── src/
│   ├── core/              # serveur, config loader, db, logger, auth, erreurs
│   ├── modules/
│   │   ├── contact-form/  # toujours actif (toutes offres)
│   │   ├── whatsapp-cta/  # logging des clics (toutes offres)
│   │   ├── crm/           # GROWTH+, BUSINESS AI — leads/contacts
│   │   ├── booking/        # pack santé/éducation
│   │   ├── catalog/        # pack commerce/PME
│   │   └── analytics/      # alimente rapport-mensuel-client
│   ├── registry/
│   │   ├── feature-registry.json   # catalogue de tous les modules dispo
│   │   └── module-loader.ts        # active routes+schema selon client.config.json
│   └── app.ts
├── prisma/
│   └── schema.prisma       # core + fragments modules assemblés au build
├── config/
│   └── client.config.json  # copié depuis le dossier projet client (onboarding)
├── scripts/
│   ├── init-client.ts      # active modules + migration DB à partir de client.config.json
│   └── seed.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

Chaque module = routes + schéma Prisma + service. Le `module-loader` lit
`client.config.json.features` et n'enregistre que les routes/tables nécessaires.
Compatible avec la structure `projects/[slug-client]/client.config.json` déjà
définie par `onboarding-client-davex`.

## 3. Calendrier de mise en œuvre

| Période | Étape | Détail |
|---|---|---|
| Sem. 1 (15–21 juin) | Core | Repo + Express + TS + Prisma + Postgres (docker-compose) + auth JWT + config loader + CI lint/test basique. Push GitHub (repo privé) dès la fin de la semaine. |
| Sem. 2 (22–28 juin) | Feature Registry + module `contact-form` | Système d'activation de modules ; module contact-form (présent dans **toutes** les offres) avec stockage DB + envoi vers webhook n8n + auto-réponse. |
| Sem. 3 (29 juin–5 juil.) | Module `crm` | Leads/contacts, utilisé par GROWTH+/BUSINESS AI et par la skill `rapport-mensuel-client`. |
| Sem. 4 (6–12 juil.) | Modules sectoriels | `catalog` (pack commerce/PME), `booking` (pack santé/éducation) — selon `SECTOR-PACKAGES.md`. |
| Sem. 5 (13–19 juil.) | Doc + tests + pilote | README de clonage, tests modules critiques, `init-client.ts`, premier clonage réel sur un client en cours, ajustements. Tag `v0.1.0`. |

## 4. Workflow de clonage pour un nouveau client

1. `git clone` (ou template GitHub) → `projects/[slug-client]/backend/`
2. Copier le `client.config.json` du projet (généré par `onboarding-client-davex`)
3. `npm run init-client` → active les modules selon `features` + lance les migrations Prisma
4. `docker compose up -d` → Postgres + API prêts en local
5. Déployer (VPS du client ou compte DAVEX selon offre)

## 5. Faire évoluer le starter sans casser les projets clients déjà clonés

- Le repo `davex-backend-starter` reste la **source de vérité** (template GitHub).
- Chaque projet client clone une **version taguée** (ex. `v0.1.0`).
- Les corrections critiques (sécurité) sont rétro-portées via `git cherry-pick` sur
  les projets actifs si nécessaire ; les nouvelles features arrivent dans les
  prochains clonages, pas rétroactivement (sauf demande explicite du client).

## 6. Prochaines étapes immédiates

1. Valider ce plan + la stack (Express vs Fastify — Express recommandé pour
   simplicité de reprise par un futur dev).
2. Créer le repo GitHub `davex-backend-starter` (privé pour l'instant).
3. Pousser le squelette généré dans `davex-backend-starter/` (voir ce dossier).
4. Démarrer Sem. 1 (core).
