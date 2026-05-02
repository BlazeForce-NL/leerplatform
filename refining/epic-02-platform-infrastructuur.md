# EP-02 — Platform & infrastructuur

> Backend, database en hosting opzetten zodat accounts, scholen en voortgang persistent en veilig opgeslagen kunnen worden.

**Afhankelijkheden:** EP-01 (code stabiel)  
**Blokkerende epic voor:** EP-03, EP-05

---

## US-02-01 — Database-schema ontwerp

**Als** platformbeheerder  
**wil ik** een helder datamodel voor gebruikers, scholen, klassen en voortgang  
**zodat** we als fundament een duurzame structuur hebben.

**Kernentiteiten:**
```
Platform
  └── School
        ├── Schoolbeheerder(s)
        └── Klas
              ├── Leerkracht(en)
              └── Leerling
                    └── Sessie / Score
```

**Acceptatiecriteria:**
- [x] ERD gedocumenteerd in `docs/datamodel.md`
- [x] Entiteiten: `users`, `schools`, `classes`, `class_memberships`, `sessions`, `scores`
- [x] Multi-tenant: elke school heeft eigen geïsoleerde data
- [x] Softdelete voor gebruikers en klassen (AVG-compliance)
- [ ] Schema gereviewed door minimaal één andere developer

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** geen

---

## US-02-02 — Backend API opzetten (Next.js Route Handlers)

**Als** ontwikkelaar  
**wil ik** een API-laag binnen Next.js  
**zodat** frontend en backend één deployable zijn en we geen extra server nodig hebben.

**Acceptatiecriteria:**
- [x] Route Handlers in `src/app/api/` voor alle kernacties
- [x] Zod gebruikt voor request-validatie op elke route
- [x] HTTP status codes consistent (200/201/400/401/403/404/500)
- [x] API-routes beveiligd: unauthenticated requests krijgen 401
- [x] Error-responses volgen consistent formaat `{ error: string, code: string }`

**Prioriteit:** Must  
**Effort:** L  
**Afhankelijkheden:** US-02-01

---

## US-02-03 — Database koppeling (Postgres + Prisma)

**Als** ontwikkelaar  
**wil ik** een type-safe database-koppeling  
**zodat** queries veilig zijn en het schema als code beheerd wordt.

**Acceptatiecriteria:**

- [x] Prisma opgezet als ORM (`prisma/schema.prisma`)
- [x] Schema in sync met US-02-01
- [x] Migrations werken via `pnpm prisma migrate dev` en `pnpm prisma migrate deploy`
- [x] Database credentials alleen via environment variables (nooit in code)
- [x] Seed-script voor lokale ontwikkeling (`prisma/seed.ts`)

**Openstaande acties:**

- [x] ~~Maak een Postgres-database aan~~ → Neon EU (Frankfurt) opgezet
- [x] ~~Zet `DATABASE_URL` in `.env.local`~~ → gedaan
- [x] ~~Draai `pnpm prisma migrate dev --name init`~~ → migratie `20260502053406_init` toegepast
- [x] ~~`pnpm prisma db seed`~~ → demo-data aangemaakt (Basisschool De Zon, Groep 4A)

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-02-01

---

## US-02-04 — Hosting en deployment pipeline

**Als** platformbeheerder  
**wil ik** dat het platform automatisch deployt bij een merge naar main  
**zodat** nieuwe features snel en betrouwbaar beschikbaar komen.

**Acceptatiecriteria:**

- [x] Platform draait op Vercel met automatische deployments bij push naar main
- [x] Database op managed Postgres — Neon EU (Frankfurt)
- [x] Environment variables beheerd via hosting-dashboard (niet in repo)
- [x] GitHub Actions CI: lint → test → build → deploy
- [ ] Rollback mogelijk binnen 5 minuten via hosting-dashboard

**Openstaande acties:**

- [x] ~~GitHub-repo aanmaken en pushen~~ → github.com/BlazeForce-NL/leerplatform
- [x] ~~Vercel koppelen~~ → blazeforce-nls-projects/leerplatform live
- [x] ~~DATABASE_URL in Vercel-dashboard~~ → ingesteld
- [x] ~~GitHub Secrets toevoegen~~ → VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-02-02, US-02-03

---

## US-02-05 — Privacy en AVG-compliance (GDPR)

**Als** school  
**wil ik** dat het platform voldoet aan de AVG  
**zodat** we het wettelijk mogen gebruiken met leerlingen jonger dan 16 jaar.

**Acceptatiecriteria:**
- [ ] Geen persoonsgegevens verzameld zonder toestemming van ouder/voogd (of school als verwerkingsverantwoordelijke)
- [ ] Data-verwerkingsovereenkomst (DPA) template beschikbaar voor scholen
- [x] Gebruikers kunnen hun data laten verwijderen (recht op vergetelheid via `DELETE /api/users/:id`)
- [x] Geen tracking-cookies of analytics van derden zonder expliciete toestemming
- [ ] Data opgeslagen in EU (datacenters) — afhankelijk van keuze database-provider
- [ ] Privacyverklaring beschikbaar op het platform

**Prioriteit:** Must  
**Effort:** L  
**Afhankelijkheden:** US-02-01
