# Leerplatform — Ontwikkelplan v2

## Uitgangspunt

Het platform is nu een werkend Numberblocks-stijl rekenspel met optellen, aftrekken, tafels en mix-modi. Het draait op Next.js + Vercel + Neon Postgres. Er ligt een backlog (EP-01 t/m EP-07) die grotendeels gericht is op school-infrastructuur — maar die epics zijn vrijwel allemaal nog open.

Dit plan herstructureert de backlog rond twee principes:

1. **Speelbare waarde eerst.** Wat het kind vandaag beter maakt, gaat voor op wat de school over zes maanden nodig heeft.
2. **Domein-agnostische architectuur.** Het niveausysteem en de progressie-engine werken voor rekenen, taal, en elk toekomstig vakgebied.

---

## Besluiten

| Vraag | Besluit |
|-------|---------|
| Doelgroep | Vanaf 6 jaar (groep 3). Geen verlaging naar 4 jaar. |
| Audio | TTS als placeholder. Inspreken later wanneer het platform verder is. |
| Visuele stijl letters | Alphablocks (BBC) als inspiratie. Letters als blokkarakters, consistent met Numberblocks-stijl voor rekenen. |
| Afbeeldingen woordjes | Alphablocks-stijl illustraties (geen foto's). |
| Business model | Gratis/hobby. Geen betaalde features in deze fase. |
| Opdrachten vs. progressie | Leerkracht moet een kind in een niveau kunnen plaatsen (overslaan van lagere niveaus), zodat het kind niet afhaakt op te makkelijk materiaal. |
| Ontwikkelvolgorde | Kind-eerst (Optie A). School-infra pas later, maar architectuur moet uitbreidbaar zijn. |

---

## Visie (bijgewerkt)

Een laagdrempelig leerplatform waar kinderen (6–12 jaar) zelfstandig en spelenderwijs vaardigheden oefenen — rekenen en taal — in de stijl van Numberblocks en Alphablocks. Het platform groeit mee met het kind: van eerste letters en optellen t/m 10 tot woordjes schrijven en rekenen t/m 1000.

Twee gebruiksvormen:
- **Vrij oefenen** — elk kind, zonder account, direct spelen
- **Schoolomgeving** — leerlingen in een klas, afgeschermd en beheerd (fase 4)

---

## Architectuurprincipe: school-ready zonder school-code

De eerste drie fasen bevatten geen school-specifieke code. Maar elk architectuurbesluit wordt getoetst op: "kan dit later werken met accounts, klassen en leerkrachten?"

Concreet betekent dit:
- **Progressie-data** heeft een abstracte `player_id` die nu een localStorage-key is, maar later een database user-id kan zijn.
- **Skill graph config** is los van de UI, zodat een leerkracht later levels kan aan/uitzetten per leerling.
- **Content (woordenlijsten, audio)** is per locale gescheiden, zodat i18n geen refactor is.
- **Mastery-scores** worden opgeslagen in een formaat dat 1:1 naar de database kan migreren.

---

## Fase 1 — Fundament + adaptieve progressie

> Doel: het bestaande rekenspel krijgt niveaus, moeilijkheidsgraad die meegroeit, en een beloningssysteem.

### EP-01 Technisch fundament (bestaand, ongewijzigd)

Component-splitsing, design tokens, linting, tests, a11y. Prerequisite voor alles.

### EP-08 — Adaptieve progressie-engine (NIEUW)

> Een domein-agnostisch systeem dat het niveau van het kind meet en de moeilijkheid automatisch aanpast. Werkt voor rekenen nu, en later voor taal.

**Kernprincipe:** Het kind kiest geen "level" handmatig. Het systeem meet beheersing per vaardigheid en ontgrendelt automatisch. Maar: een leerkracht (of ouder) kan later een kind op een hoger startniveau plaatsen.

#### US-08-01 — Vaardighedenmodel (skill graph)

**Als** platform
**wil ik** een datamodel dat vaardigheden, niveaus en afhankelijkheden beschrijft
**zodat** de progressie-engine weet wat een kind al kan en wat de volgende stap is.

**Ontwerp:**
```
Domain (bijv. "rekenen", "taal")
  └── Skill (bijv. "optellen", "letterherkenning")
        └── Level (bijv. "optellen t/m 10", "optellen t/m 20")
              ├── unlock_threshold: minimale score om door te gaan
              ├── depends_on: [level_ids] — prerequisites
              ├── content_config: { mode, maxVal, ... }
              └── can_skip: boolean — mag overgeslagen worden
```

**Acceptatiecriteria:**
- [ ] Skill graph als JSON/config, niet hardcoded in componenten
- [ ] Graaf is uitbreidbaar zonder code-wijzigingen (nieuwe domeinen toevoegen = config)
- [ ] Elk level heeft: id, naam (NL + EN-ready), unlock-drempel, dependencies, content-config
- [ ] Initiële graaf bevat: rekenen (optellen/aftrekken/tafels in oplopende moeilijkheid)
- [ ] "Skip to level" API: een kind kan geplaatst worden op een hoger niveau, waarbij lagere niveaus automatisch als beheerst worden gemarkeerd
- [ ] Unit tests voor graaf-traversal (welk level is ontgrendeld gegeven scores)

**Prioriteit:** Must
**Effort:** M

#### US-08-02 — Beheersingsmeting (mastery tracker)

**Als** platform
**wil ik** per kind bijhouden hoe goed het een vaardigheid beheerst
**zodat** de moeilijkheid automatisch meegroeit.

**Ontwerp:**
- Sliding window van de laatste N antwoorden per level (bijv. 20)
- Beheersing = % correct in dat window
- Threshold om een level als "beheerst" te markeren (bijv. 80% over 20 vragen)
- Bij gastgebruiker: localStorage. Bij account: database.

**Data-opslag interface:**
```typescript
interface MasteryStore {
  getProgress(playerId: string, levelId: string): MasteryData;
  recordAnswer(playerId: string, levelId: string, correct: boolean): void;
  skipToLevel(playerId: string, levelId: string): void;
}
```
Implementatie 1: `LocalStorageMasteryStore` (fase 1-3)
Implementatie 2: `DatabaseMasteryStore` (fase 4, zelfde interface)

**Acceptatiecriteria:**
- [ ] Mastery score berekend per level, opgeslagen per kind
- [ ] Threshold instelbaar per level (standaard: 80% over 20 vragen)
- [ ] Bij behalen threshold: level markeren als "beheerst", volgende level(s) ontgrendelen
- [ ] Bij te veel fouten (bijv. <40% over 10 vragen): tijdelijk terugvallen naar makkelijker level
- [ ] Mastery data migreerbaar van localStorage naar account (zelfde datastructuur)
- [ ] `skipToLevel()`: markeert alle prerequisite levels als beheerst

**Prioriteit:** Must
**Effort:** L

#### US-08-03 — Niveauscherm / wereldkaart

**Als** kind
**wil ik** zien welke niveaus ik al heb gehaald en welke ik nu kan doen
**zodat** ik gemotiveerd ben om door te gaan.

**Ontwerp:**
- Visuele "wereld" of "pad" met niveaus als eilanden/stations
- Behaalde niveaus: kleur + sterren. Ontgrendeld: uitnodigend. Vergrendeld: grijs.
- Numberblocks-stijl: elk niveau wordt vertegenwoordigd door het relevante getal/karakter.
- Twee werelden: "Rekenwereld" (Numberblocks) en "Taalwereld" (Alphablocks-stijl)

**Acceptatiecriteria:**
- [ ] Visuele weergave van de skill graph als speelwereld
- [ ] Onderscheid: beheerst (★★★) / ontgrendeld / vergrendeld
- [ ] Klikbaar: ontgrendeld level → direct starten
- [ ] Animatie bij ontgrendelen (vergelijkbaar met bestaande confetti)
- [ ] Touch-friendly (minimaal 44×44px touch targets)
- [ ] Wereld-switcher: "Rekenen" ↔ "Taal" (taal pas zichtbaar na fase 2)

**Prioriteit:** Must
**Effort:** L

#### US-08-04 — Beloningssysteem

**Als** kind
**wil ik** beloningen ontvangen bij het behalen van niveaus
**zodat** oefenen leuk blijft.

*Vervangt US-04-05 uit de oude backlog.*

**Acceptatiecriteria:**
- [ ] Sterren per level (1-3 op basis van score-drempel)
- [ ] Badges voor mijlpalen (eerste level, 10 levels, domein voltooid, streak van 5 dagen)
- [ ] Feestelijke animatie bij behalen
- [ ] Badge-overzicht in profiel
- [ ] Overdraagbaar van localStorage naar account

**Prioriteit:** Should
**Effort:** M

---

### EP-04 Vrij oefenen — herschikking

| Oude story | Wat ermee gebeurt |
|------------|-------------------|
| US-04-01 Moduskeuze | → Vervangen door US-08-03 (niveauscherm) |
| US-04-02 Gastvoortgang | → Vervangen door US-08-02 (mastery tracker) |
| US-04-03 Scorebord (anoniem) | → Verschuift naar fase 4 (vereist backend) |
| US-04-04 Aanpasbaar tempo | → Onderdeel van US-08-01 (skill graph config) |
| US-04-05 Beloningen | → Vervangen door US-08-04 |
| US-04-06 i18n | → Vervangen door EP-10 (fase 3) |

EP-04 als aparte epic vervalt. De inhoud is opgenomen in EP-08 en EP-10.

---

### Reken skill graph (initieel)

```
Domein: Rekenen (Numberblocks-wereld)
├── Optellen
│   ├── Level 1: t/m 10 (geen tientallen-overgang)
│   ├── Level 2: t/m 20 (met tientallen-overgang)
│   ├── Level 3: t/m 50
│   ├── Level 4: t/m 100
│   └── Level 5: t/m 1000
├── Aftrekken
│   ├── Level 1: t/m 10
│   ├── Level 2: t/m 20
│   ├── Level 3: t/m 50
│   ├── Level 4: t/m 100
│   └── Level 5: t/m 1000
├── Tafels
│   ├── Level 1: tafel van 1, 2, 5, 10
│   ├── Level 2: tafel van 3, 4
│   ├── Level 3: tafel van 6, 7, 8
│   ├── Level 4: tafel van 9, 11, 12
│   └── Level 5: alle tafels door elkaar
├── Delen
│   ├── Level 1: eenvoudige delingen (keersommen omgekeerd)
│   └── Level 2: delingen met rest
├── Mix
│   ├── Level 1: optellen + aftrekken t/m 20
│   ├── Level 2: optellen + aftrekken + tafels
│   └── Level 3: alles door elkaar
```

---

## Fase 2 — Taalmodule

> Doel: letters leren, woordjes schrijven, hakken en plakken — in Alphablocks-stijl.

### EP-09 — Taalvaardigheden (NIEUW)

> Kinderen leren letters herkennen, woordjes hakken (klanken splitsen), plakken (klanken samenvoegen) en schrijven.

**Visuele stijl:** Geïnspireerd door BBC Alphablocks. Elke letter is een blokkarakter met eigen persoonlijkheid en klank. Wanneer letters "elkaars hand vasthouden" (naast elkaar staan), vormen ze een woord — net als in de serie. Dit is visueel consistent met de Numberblocks-stijl die al gebruikt wordt voor rekenen.

**Belangrijk:** Alphablocks is auteursrechtelijk beschermd (© Alphablocks Ltd). Het platform gebruikt eigen karakterontwerpen die geïnspireerd zijn op het concept (letters als blokvormige karakters), niet de specifieke Alphablocks-designs.

**Afhankelijkheden:** EP-08 (progressie-engine)
**Doelgroep:** groep 3-6 (6–10 jaar)

#### US-09-01 — Letterherkenning

**Als** kind
**wil ik** letters leren herkennen
**zodat** ik weet welke letter bij welke klank hoort.

**Gameplay:**
- Een letterblok-karakter verschijnt in beeld en maakt zijn klank (TTS)
- Kind kiest de juiste letter uit 4 opties (multiple choice)
- Of: kind hoort de klank en typt de letter op een groot schermtoetsenbord
- Elke letter heeft een eigen kleurtje en "gezicht" (eigen karakter-ontwerp)

**Acceptatiecriteria:**
- [ ] Alle 26 letters beschikbaar (kleine letters eerst, hoofdletters als apart level)
- [ ] Audio per letter via TTS: klank (niet de letternaam — "sss" niet "es")
- [ ] Visuele feedback bij goed/fout (consistent met rekenspel)
- [ ] Eigen letter-karakterontwerpen in blokvorm (geïnspireerd op Alphablocks-concept, niet gekopieerd)
- [ ] Progressie via skill graph: eerst veel voorkomende letters (s, a, m, r, e), dan minder frequente
- [ ] Integratie met EP-08 mastery tracker

**Prioriteit:** Must
**Effort:** L

#### US-09-02 — Letter schrijven (tracing)

**Als** kind
**wil ik** oefenen met het schrijven van letters
**zodat** ik leer hoe ik letters vorm.

**Gameplay:**
- Letter verschijnt als stippellijn op het scherm
- Kind traceert de letter met vinger (touch) of muis
- Feedback op richting en volgorde van de lijnen

**Acceptatiecriteria:**
- [ ] Canvas-component voor letter-tracing
- [ ] Pad-data per letter (SVG-achtige path definitions)
- [ ] Tolerantie instelbaar (hoe nauwkeurig moet de trace zijn)
- [ ] Visuele hints: startpunt (groene stip), richting (pijltje)
- [ ] Werkt op tablet en telefoon (primaire use case)

**Prioriteit:** Could (technisch complex, kan later)
**Effort:** XL

#### US-09-03 — Woordjes hakken (segmenteren)

**Als** kind
**wil ik** woordjes in klanken kunnen opdelen
**zodat** ik leer hoe woorden zijn opgebouwd.

**Gameplay:**
- Kind hoort een woord (bijv. "kat") en ziet een illustratie
- Kind moet het woord opdelen in klanken door op de juiste plekken te "hakken"
- Visueel: het woord breekt in letterblokken die uit elkaar schuiven (k-a-t)
- De letterblokken zijn de Alphablocks-stijl karakters

**Acceptatiecriteria:**
- [ ] Woordenlijst: minimaal 100 NL woorden, gegroepeerd op moeilijkheid
- [ ] Woordstructuren: MKM (kat), MMKM (krab), MKMM (lamp), MMKMM (krans)
- [ ] Audio per woord (TTS) en per klank (TTS of korte clips)
- [ ] Illustraties bij woorden (eigen ontwerp, consistent Alphablocks-stijl)
- [ ] Scoring vergelijkbaar met rekenspel (combo's, sterren)
- [ ] Integratie met EP-08 mastery tracker

**Prioriteit:** Must
**Effort:** XL

#### US-09-04 — Woordjes plakken (blenden)

**Als** kind
**wil ik** losse klanken samenvoegen tot een woord
**zodat** ik leer lezen.

**Gameplay:**
- Kind ziet losse letterblokken (bijv. "b", "oo", "m") naast een illustratie
- Kind sleept de blokken in de juiste volgorde
- Bij correcte volgorde: de blokken "houden elkaars hand vast" → het woord klinkt
- Alphablocks-referentie: letters die samenwerken vormen woord-magie

**Acceptatiecriteria:**
- [ ] Drag-and-drop interface (touch-first)
- [ ] Dezelfde woordenlijst als hakken (US-09-03)
- [ ] Audio feedback per klankblok bij aanraken
- [ ] Visuele samensmelting van blokken tot woord (animatie)
- [ ] Foutieve volgorde: vriendelijke hint, niet direct antwoord tonen

**Prioriteit:** Must
**Effort:** L

#### US-09-05 — Woordjes schrijven

**Als** kind
**wil ik** woordjes leren schrijven
**zodat** ik kan spellen.

**Gameplay:**
- Kind hoort een woord en ziet de illustratie
- Kind typt het woord letter voor letter op schermtoetsenbord
- Per letter: directe feedback (groen/rood)

**Acceptatiecriteria:**
- [ ] Groot schermtoetsenbord (kindvriendelijk, minimaal 44×44px per toets)
- [ ] Optie ABC-volgorde naast QWERTY (instelling)
- [ ] Woorden uit dezelfde woordenlijst als hakken/plakken
- [ ] Letter-voor-letter feedback (niet pas aan het eind)
- [ ] Hint-knop: eerste letter tonen, of alle klinkers tonen
- [ ] Moeilijkheidsgraad via progressie-engine (korte woorden → langere)

**Prioriteit:** Should
**Effort:** L

#### US-09-06 — Taal content pipeline

**Als** ontwikkelaar
**wil ik** een gestructureerd formaat voor taalcontent
**zodat** woordenlijsten, audio en illustraties eenvoudig toe te voegen zijn.

**Content formaat:**
```json
{
  "id": "nl-mkm-kat",
  "word": "kat",
  "locale": "nl",
  "segments": ["k", "a", "t"],
  "structure": "MKM",
  "difficulty": 1,
  "audio": {
    "word": "audio/nl/words/kat.mp3",
    "segments": ["audio/nl/phonemes/k.mp3", "audio/nl/phonemes/a.mp3", "audio/nl/phonemes/t.mp3"]
  },
  "image": "images/words/kat.svg",
  "skill_level": "hakken-level-1"
}
```

**Acceptatiecriteria:**
- [ ] Content als JSON met bovenstaand schema
- [ ] Audio-bestanden: per woord en per klank (TTS-generated initieel)
- [ ] Illustraties: eenvoudige SVG, consistent stijl
- [ ] Validatie-script: controleert of alle referenties kloppen
- [ ] Documentatie: hoe je een nieuw woord toevoegt
- [ ] Locale-gescheiden: `content/nl/words/`, `content/en/words/` (klaar voor fase 3)

**Prioriteit:** Must
**Effort:** M

---

### Taal skill graph (initieel, NL, groep 3+)

```
Domein: Taal (Alphablocks-wereld)
├── Letters herkennen
│   ├── Level 1: s, a, m, r, e, i (meest voorkomend)
│   ├── Level 2: o, n, t, d, l, p
│   ├── Level 3: k, b, g, v, w, j
│   └── Level 4: h, u, z, f, c, x, q, y
├── Woordjes hakken (MKM)
│   ├── Level 1: 3-letterwoorden (kat, vis, bak, hek, bus)
│   ├── Level 2: 4-letterwoorden MMKM (krab, stem, brug)
│   ├── Level 3: 4-letterwoorden MKMM (lamp, melk, berg)
│   └── Level 4: 5+ letterwoorden (krans, strand)
├── Woordjes plakken
│   ├── Level 1-4: zelfde opbouw als hakken
├── Woordjes schrijven
│   ├── Level 1: MKM woorden
│   ├── Level 2: MMKM / MKMM woorden
│   └── Level 3: langere woorden
├── Letter schrijven (tracing) — Could
│   └── Level 1-4: zelfde lettervolgorde als herkennen
```

**Opmerking:** Lettercombinaties (oe, ie, eu, ou, ei, etc.) en meerlettergrepige woorden zijn bewust nog niet opgenomen. Dat is een uitbreiding voor wanneer de basisflow stabiel is.

---

## Fase 3 — Internationalisering (i18n)

> Doel: het platform beschikbaar maken in Nederlands (standaard) en Engels.

### EP-10 — Meertaligheid (NIEUW)

#### US-10-01 — i18n framework opzetten

**Acceptatiecriteria:**
- [ ] next-intl (of vergelijkbaar) geïntegreerd
- [ ] Alle bestaande UI-teksten verplaatst naar vertaalbestanden
- [ ] Taalwissel in UI (vlag/dropdown) op startscherm en in instellingen
- [ ] Taal onthouden in localStorage / account
- [ ] Getallen- en datumweergave lokalisatie-bewust

**Prioriteit:** Must
**Effort:** L

#### US-10-02 — Engelse vertalingen

**Acceptatiecriteria:**
- [ ] Alle UI-strings vertaald naar Engels
- [ ] Engelse woordenlijst voor taalmodule (andere woorden, andere fonetiek)
- [ ] Engelse TTS-audio voor taalmodule
- [ ] Engelse skill graph: andere lettervolgorde (Engels heeft andere frequentieverdeling)
- [ ] Review door native speaker

**Prioriteit:** Must
**Effort:** M

#### US-10-03 — Taalspecifieke content scheiding

**Acceptatiecriteria:**
- [ ] Taalcontent (woordenlijsten, audio, fonetische regels) per locale gescheiden
- [ ] Rekencontent is taalneutraal (alleen UI-labels vertalen)
- [ ] Nieuwe taal toevoegen = nieuwe content-map + vertalingen, geen code-wijziging

**Prioriteit:** Must
**Effort:** M

---

## Fase 4 — School-infrastructuur

> Doel: accounts, klassen, opdrachten en rapportage — alleen starten wanneer er een concrete school als testpartner is, of wanneer fase 1-3 stabiel draaien.

De bestaande epics EP-02 t/m EP-07 blijven inhoudelijk grotendeels ongewijzigd, met deze aanpassingen:

### EP-03 Authenticatie — aanpassingen

- US-03-01 (vrij spelen) → al werkend, markeer als done
- US-03-02 (klascode + voornaam) → ongewijzigd

### EP-05 School & klasbeheer — aanpassingen

- US-05-07 (afgeschermde omgeving) → verhoog naar Must, eerste story om te implementeren

### EP-06 Opdrachten & leerpad — aanpassingen

**Nieuw: US-06-07 — Kind plaatsen op niveau**

**Als** leerkracht
**wil ik** een leerling op een specifiek niveau plaatsen
**zodat** het kind niet door te makkelijke stof heen moet die het al beheerst.

**Acceptatiecriteria:**
- [ ] Leerkracht selecteert leerling → kiest domein → kiest startniveau
- [ ] Alle lagere niveaus worden automatisch als "beheerst" gemarkeerd
- [ ] Leerling ziet alleen het gekozen niveau en hoger als actief
- [ ] Terugplaatsen naar lager niveau is ook mogelijk
- [ ] Actie gelogd (wie, wanneer, van welk niveau naar welk niveau)

**Prioriteit:** Must
**Effort:** S
**Afhankelijkheden:** EP-08 (skipToLevel API)

**Overige aanpassingen EP-06:**
- US-06-04 (leerpad) → wordt vereenvoudigd. De progressie-engine (EP-08) is het leerpad. Leerkracht stuurt door niveauplaatsing, niet door handmatig paden samen te stellen.
- US-06-05 (sjablonen) → wordt "level-sets" die leerkrachten toewijzen aan klassen

### EP-07 Voortgang & rapportage — aanpassingen

- US-07-01 (persoonlijk voortgangsscherm) → grotendeels afgedekt door US-08-03 (niveauscherm)
- US-07-06 (inzicht voor ouders) → verschuif naar Could, niet in eerste release

---

## Herziene epic-volgorde

```
Fase 1 (nu starten):
  EP-01 Technisch fundament          ← prerequisite
  EP-08 Adaptieve progressie-engine  ← parallel aan EP-01

Fase 2 (na fase 1):
  EP-09 Taalvaardigheden             ← na EP-08

Fase 3 (na fase 2, of parallel aan eind fase 2):
  EP-10 Meertaligheid (NL + EN)      ← na EP-09

Fase 4 (wanneer school-partner beschikbaar of fase 1-3 stabiel):
  EP-02 Platform & infrastructuur    ← deels al done
  EP-03 Authenticatie & identiteit   ← na EP-02
  EP-05 School & klasbeheer          ← na EP-03
  EP-06 Opdrachten & leerpad         ← na EP-05 + EP-08
  EP-07 Voortgang & rapportage       ← na EP-06
```

---

## Overzicht — alle epics

| Fase | Epic | Titel | Prioriteit | Status | Effort |
|------|------|-------|------------|--------|--------|
| 1 | EP-01 | Technisch fundament | Must | Open | L |
| 1 | EP-08 | Adaptieve progressie-engine | Must | Nieuw | XL |
| 2 | EP-09 | Taalvaardigheden | Must | Nieuw | XL |
| 3 | EP-10 | Meertaligheid (NL + EN) | Should | Nieuw | L |
| 4 | EP-02 | Platform & infrastructuur | Must | Deels done | M |
| 4 | EP-03 | Authenticatie & identiteit | Must | Open | L |
| 4 | EP-05 | School & klasbeheer | Must | Open | L |
| 4 | EP-06 | Opdrachten & leerpad | Should | Herstructureren | L |
| 4 | EP-07 | Voortgang & rapportage | Should | Herstructureren | L |

---

## Risico's en mitigatie

| Risico | Impact | Mitigatie |
|--------|--------|----------|
| TTS-kwaliteit onvoldoende voor jonge kinderen | Letterherkenning werkt slecht | Test vroeg met doelgroep (je zoon). Fallback: korte audio-opnames voor de eerste 26 letters is beheersbaar |
| Alphablocks-stijl karakterontwerpen kosten designtijd | Fase 2 vertraagt | Start met eenvoudige gekleurde blokken met letter erin. Karakterontwerp iteratief verbeteren |
| Woordenlijst samenstellen kost tijd | Content-bottleneck | Begin met 30-50 MKM-woorden. Dat is genoeg voor level 1-2 hakken/plakken. Uitbreiden na feedback |
| Scope creep richting school-infra | Fase 1-3 vertragen | Harde grens: geen school-tickets tot fase 1 stabiel draait |
| Adaptieve progressie te complex ontworpen | Overengineering | Start met eenvoudige threshold-check (80% over 20 vragen). Complexere algoritmes zijn fase 5+ |
| Letter-tracing (US-09-02) is technisch complex | XL effort onderschatting | Bewust als "Could" geprioriteerd. Begin met herkenning en typen |
| i18n bij taalmodule verdubbelt content | Effort fase 3 stijgt | Engels pas na NL-content stabiel is. Gescheiden content-mappen maken dit beheersbaar |
| localStorage-limiet bij veel mastery-data | Data verloren | Monitor grootte. Bij >2MB: comprimeer of archiveer oude data. Account lost dit fundamenteel op |

---

## Eerste sprint suggestie

Als je morgen wilt beginnen, start hier:

1. **EP-01 US-01-01**: Split `NumberblocksGame.tsx` in kleinere componenten
2. **EP-08 US-08-01**: Ontwerp de skill graph JSON-structuur voor rekenen
3. **EP-08 US-08-02**: Bouw de `MasteryStore` interface + `LocalStorageMasteryStore` implementatie

Deze drie stories zijn onafhankelijk van elkaar en leggen het fundament voor alles wat volgt.
