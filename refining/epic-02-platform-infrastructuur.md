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
- [ ] ERD gedocumenteerd in `docs/datamodel.md`
- [ ] Entiteiten: `users`, `schools`, `classes`, `class_memberships`, `sessions`, `scores`
- [ ] Multi-tenant: elke school heeft eigen geïsoleerde data
- [ ] Softdelete voor gebruikers en klassen (AVG-compliance)
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
- [ ] Route Handlers in `src/app/api/` voor alle kernacties
- [ ] Zod gebruikt voor request-validatie op elke route
- [ ] HTTP status codes consistent (200/201/400/401/403/404/500)
- [ ] API-routes beveiligd: unauthenticated requests krijgen 401
- [ ] Error-responses volgen consistent formaat `{ error: string, code: string }`

**Prioriteit:** Must  
**Effort:** L  
**Afhankelijkheden:** US-02-01

---

## US-02-03 — Database koppeling (Postgres + Prisma)

**Als** ontwikkelaar  
**wil ik** een type-safe database-koppeling  
**zodat** queries veilig zijn en het schema als code beheerd wordt.

**Acceptatiecriteria:**
- [ ] Prisma opgezet als ORM
- [ ] Schema in `prisma/schema.prisma` volledig in sync met US-02-01
- [ ] Migrations werken via `prisma migrate dev` en `prisma migrate deploy`
- [ ] Database credentials alleen via environment variables (nooit in code)
- [ ] Seed-script voor lokale ontwikkeling (`prisma/seed.ts`)

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-02-01

---

## US-02-04 — Hosting en deployment pipeline

**Als** platformbeheerder  
**wil ik** dat het platform automatisch deployt bij een merge naar main  
**zodat** nieuwe features snel en betrouwbaar beschikbaar komen.

**Acceptatiecriteria:**
- [ ] Platform draait op Vercel (of vergelijkbaar) met automatische preview-deployments per PR
- [ ] Database op managed Postgres (bijv. Supabase, Neon, of Railway)
- [ ] Environment variables beheerd via hosting-dashboard (niet in repo)
- [ ] GitHub Actions CI: lint → test → build → deploy
- [ ] Rollback mogelijk binnen 5 minuten via hosting-dashboard

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
- [ ] Gebruikers kunnen hun data laten verwijderen (recht op vergetelheid)
- [ ] Geen tracking-cookies of analytics van derden zonder expliciete toestemming
- [ ] Data opgeslagen in EU (datacenters)
- [ ] Privacyverklaring beschikbaar op het platform

**Prioriteit:** Must  
**Effort:** L  
**Afhankelijkheden:** US-02-01
