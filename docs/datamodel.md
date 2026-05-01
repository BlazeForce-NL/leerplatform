# Datamodel — Leerplatform

## ERD

```mermaid
erDiagram
    School ||--o{ Class : "heeft"
    School ||--o{ SchoolAdmin : "beheerd door"
    Class  ||--o{ ClassTeacher : "geleid door"
    Class  ||--o{ ClassMembership : "heeft leerlingen"
    User   ||--o{ SchoolAdmin : "is beheerder van"
    User   ||--o{ ClassTeacher : "is leerkracht van"
    User   ||--o{ ClassMembership : "zit in"
    User   ||--o{ Session : "speelt"
    Session ||--o{ Score : "genereert"
    User   ||--o{ AuthToken : "heeft"

    School {
        cuid id PK
        string name
        datetime deletedAt "soft-delete"
        datetime createdAt
        datetime updatedAt
    }
    Class {
        cuid id PK
        string name
        cuid schoolId FK
        datetime deletedAt "soft-delete"
        datetime createdAt
        datetime updatedAt
    }
    User {
        cuid id PK
        string email UK
        string name
        enum role "PLATFORM_ADMIN | SCHOOL_ADMIN | TEACHER | STUDENT"
        string passwordHash
        datetime deletedAt "soft-delete (GDPR)"
        datetime createdAt
        datetime updatedAt
    }
    SchoolAdmin {
        cuid schoolId FK
        cuid userId FK
    }
    ClassTeacher {
        cuid classId FK
        cuid userId FK
    }
    ClassMembership {
        cuid id PK
        cuid classId FK
        cuid userId FK
        datetime joinedAt
    }
    Session {
        cuid id PK
        cuid userId FK
        string mode "plus|min|mix|tafel|tafel_specific|alles"
        int specificTable
        int timerSetting
        int score
        int correct
        int total
        datetime playedAt
    }
    Score {
        cuid id PK
        cuid sessionId FK
        string category "scoreCat() waarde"
        int score
    }
    AuthToken {
        cuid id PK
        cuid userId FK
        string token UK
        datetime expiresAt
        datetime createdAt
    }
```

## Entiteiten

### `users`
Centrale entiteit. Één gebruiker kan meerdere rollen hebben op platformniveau via `role`:
- `PLATFORM_ADMIN` — beheert het hele platform
- `SCHOOL_ADMIN` — beheert één of meerdere scholen
- `TEACHER` — leerkracht in een of meerdere klassen
- `STUDENT` — leerling

`deletedAt` is nullable voor GDPR soft-delete (recht op vergetelheid).

### `schools`
Multi-tenant isolatie: alle klassen en leerlingen horen bij precies één school. Soft-delete via `deletedAt`.

### `classes`
Een klas behoort tot exact één school. Leerkrachten zijn gekoppeld via `class_teachers`. Leerlingen via `class_memberships`.

### `class_memberships`
Junction-tabel: koppelt leerlingen (STUDENT-gebruikers) aan klassen. `@@unique([classId, userId])` voorkomt duplicaten.

### `sessions`
Spelresultaat van één sessie. Gekoppeld aan de gebruiker die gespeeld heeft. Bevat mode, score, aantal goed/fout en timer-instelling.

### `scores`
Per-categorie score bij een sessie (overeenkomstig `scoreCat()` uit `gameLogic.ts`). Maakt het mogelijk om high scores per categorie op te slaan in de database in plaats van localStorage.

### `auth_tokens`
Bearer-tokens voor API-authenticatie. Tokens zijn uniek en hebben een vervaldatum. Worden aangemaakt bij inloggen (EP-03) en verwijderd bij uitloggen.

## Multi-tenancy

Elke school heeft geïsoleerde data:
- Klassen zijn `schoolId`-gebonden
- Queries filteren altijd op `schoolId` of via de klas-relatie
- `SCHOOL_ADMIN` ziet alleen data van zijn eigen school

## GDPR / AVG

- Soft-delete op `users`, `schools`, `classes` via `deletedAt`-veld
- `DELETE /api/users/:id` soft-deletes de gebruiker (recht op vergetelheid)
- Geen tracking-cookies; geen analytics van derden
- Data moet opgeslagen zijn in EU-datacenters (Supabase EU, Neon EU, of Railway EU)
