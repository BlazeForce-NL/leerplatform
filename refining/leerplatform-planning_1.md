# Leerplatform — Planning & Volgorde

> Dit document is de leidende planning voor het leerplatform. Elke user story heeft een volgnummer, prioriteit, effort en expliciete afhankelijkheden. Werk stories af in de aangegeven volgorde — sla geen Must-story over.

## Leeswijzer

- **#** = absoluut volgnummer over alle fasen heen
- **Prio** = Must / Should / Could (MoSCoW)
- **Effort** = XS (<2u) · S (2-4u) · M (4-8u) · L (1-2 dagen) · XL (3+ dagen)
- **Blokkeert** = welke stories pas kunnen starten als deze af is
- **Status** = Open / In progress / Done
- **∥** = kan parallel aan vorige story

---

## Fase 1 — Fundament + adaptieve progressie

> Doel: codebase opschonen, niveausysteem bouwen, rekenspel krijgt levels die meegroeien.
> Afrondcriterium: een kind kan het rekenspel spelen met automatisch oplopende moeilijkheid en ziet een visuele niveaukaart.

### EP-01 — Technisch fundament

| # | Story | Prio | Effort | Afhankelijk van | Blokkeert | Status |
|---|-------|------|--------|-----------------|-----------|--------|
| 1 | US-01-01 — Component splitsing NumberblocksGame | Must | L | — | #2, #3, #4, #5 | Open |
| 2 | US-01-03 — Linting en type-safety op orde | Must | S | #1 | — | Open |
| 3 | US-01-02 — Design tokens voor kleuren en spacing | Must | M | #1 | #11 | Open |
| 4 | US-01-04 — Unit tests voor game-logica | Should | M | #1 | — | Open |
| 5 | US-01-05 — Toegankelijkheid WCAG AA | Must | M | #1 | — | Open |

**Toelichting volgorde EP-01:**
- #1 is de absolute eerste stap — alles hangt ervan af.
- #2 (linting) direct na #1 zodat de CI-poorten werken voordat er nieuwe code bijkomt.
- #3 (design tokens) na #1 omdat het visuele systeem nodig is voor het niveauscherm (#11).
- #4 (tests) en #5 (a11y) kunnen parallel aan #2/#3, maar zijn niet blokkerend voor EP-08.

### EP-08 — Adaptieve progressie-engine

| # | Story | Prio | Effort | Afhankelijk van | Blokkeert | Status |
|---|-------|------|--------|-----------------|-----------|--------|
| 6 | US-08-01 — Skill graph datamodel | Must | M | — ∥ #1 | #7, #8, #11 | Open |
| 7 | US-08-02 — Mastery tracker (beheersingsmeting) | Must | L | #6 | #8, #11 | Open |
| 8 | US-08-05 — Rekenspel integratie met progressie-engine | Must | L | #1, #6, #7 | #11 | Open |
| 9 | US-08-04 — Beloningssysteem (sterren + badges) | Should | M | #7 | — | Open |
| 10 | ∥ Content: reken skill graph vullen (alle levels definiëren) | Must | S | #6 | #8, #11 | Open |
| 11 | US-08-03 — Niveauscherm / wereldkaart | Must | L | #3, #7, #8, #10 | — | Open |

**Toelichting volgorde EP-08:**
- #6 (skill graph) kan starten parallel aan #1 — het is puur data-ontwerp.
- #7 (mastery tracker) bouwt voort op de skill graph.
- #8 (integratie) is het scharnierpunt: hier koppel je het bestaande rekenspel aan de progressie-engine. Vereist dat zowel #1 (opgeschoonde componenten) als #6+#7 (engine) af zijn.
- #10 (content) is het vullen van de skill graph met concrete rekenlevels. Kan parallel aan #7.
- #11 (niveauscherm) is de kroon op fase 1 — visuele weergave van alles wat ervoor gebouwd is.
- #9 (beloningen) is een Should en kan op elk moment na #7.

**US-08-05 is nieuw** — expliciet gemaakt omdat de koppeling van het bestaande spel aan de progressie-engine een aparte story is:

**US-08-05 — Rekenspel integratie met progressie-engine**
- Bestaand rekenspel leest actief level uit skill graph (mode, maxVal, timer)
- Na elke sessie: mastery tracker bijwerken
- Bij level-up: volgende level ontgrendelen + feedback
- Bestaande "vrij spelen" modus blijft werken (backward compatible)
- `makeQ()` ontvangt config uit skill graph i.p.v. handmatige parameters

### Fase 1 — samenvattend pad (kritiek pad vet)

```
#1 Component splitsing ─────────┬──── #2 Linting
                                ├──── #3 Design tokens ──────────────────┐
                                ├──── #4 Tests (∥)                       │
                                └──── #5 A11y (∥)                        │
                                                                         │
#6 Skill graph ──── #7 Mastery tracker ──── #8 Integratie ──── #11 Niveauscherm
       │                    │                                     ↑
       └── #10 Content (∥)  └── #9 Beloningen (∥)                │
                                                    #3 tokens ───┘
```

**Kritiek pad:** #1 → #6 → #7 → #8 → #11 (met #3 en #10 als parallelle vereisten voor #11)

---

## Fase 2 — Taalmodule

> Doel: letters herkennen, woordjes hakken, plakken en schrijven — in Alphablocks-stijl.
> Afrondcriterium: een kind kan de Taalwereld openen, letters herkennen, en minimaal 30 woorden hakken/plakken.
> Startconditie: #7 (mastery tracker) en #8 (integratie) zijn af.

### EP-09 — Taalvaardigheden

| # | Story | Prio | Effort | Afhankelijk van | Blokkeert | Status |
|---|-------|------|--------|-----------------|-----------|--------|
| 12 | US-09-06 — Taal content pipeline (schema + tooling) | Must | M | #6 | #13, #15, #16, #17 | Open |
| 13 | ∥ Content: NL woordenlijst level 1-2 (30-50 MKM-woorden) | Must | M | #12 | #15, #16 | Open |
| 14 | ∥ Content: letterkarakter-ontwerpen (26 blokletters) | Must | L | — | #15, #16, #17 | Open |
| 15 | US-09-01 — Letterherkenning | Must | L | #7, #12, #13, #14 | #17 | Open |
| 16 | US-09-03 — Woordjes hakken (segmenteren) | Must | XL | #7, #12, #13, #14 | #17 | Open |
| 17 | US-09-04 — Woordjes plakken (blenden) | Must | L | #15 of #16 | #18 | Open |
| 18 | US-09-05 — Woordjes schrijven | Should | L | #17 | — | Open |
| 19 | ∥ Content: NL woordenlijst level 3-4 (50+ langere woorden) | Should | M | #12 | — | Open |
| 20 | US-09-02 — Letter schrijven (tracing) | Could | XL | #14 | — | Open |
| 21 | ∥ Taal skill graph vullen + koppelen aan niveauscherm | Must | M | #11, #12 | — | Open |
| 22 | ∥ TTS audio genereren (letters + woorden NL) | Must | M | #12, #13 | #15, #16 | Open |

**Toelichting volgorde EP-09:**
- #12 (content pipeline) eerst — dit definieert het formaat waar alle taal-content in past.
- #13 (woordenlijst) en #14 (letterontwerpen) en #22 (TTS audio) zijn content-taken die parallel lopen.
- #15 (letterherkenning) en #16 (hakken) kunnen parallel gebouwd worden zodra content er is.
- #17 (plakken) hergebruikt componenten uit #15/#16 en bouwt daar op voort.
- #18 (schrijven) is een Should — pas na de basis.
- #20 (tracing) is een Could — alleen als er capaciteit is.
- #21 koppelt de taalwereld aan het bestaande niveauscherm uit fase 1.

### Fase 2 — samenvattend pad

```
#12 Content pipeline ──┬── #13 Woordenlijst L1-2 ──┬── #15 Letterherkenning ──┐
                       │                            │                          │
                       └── #22 TTS audio ───────────┘                          ├── #17 Plakken → #18 Schrijven
                                                                               │
#14 Letterontwerpen ──────────────────────────────── #16 Hakken ───────────────┘
                                                         │
#11 Niveauscherm ──────────────────────────── #21 Taal skill graph koppelen
```

**Kritiek pad:** #12 → #13 + #22 → #16 → #17

---

## Fase 3 — Internationalisering (i18n)

> Doel: platform beschikbaar in NL + EN.
> Afrondcriterium: volledig Engels speelbaar inclusief taalmodule met Engelse woorden.
> Startconditie: fase 2 kern (t/m #17) is af.

### EP-10 — Meertaligheid

| # | Story | Prio | Effort | Afhankelijk van | Blokkeert | Status |
|---|-------|------|--------|-----------------|-----------|--------|
| 23 | US-10-01 — i18n framework opzetten (next-intl) | Must | L | #1 | #24, #25 | Open |
| 24 | US-10-03 — Taalspecifieke content scheiding | Must | M | #12, #23 | #25 | Open |
| 25 | US-10-02 — Engelse vertalingen + EN woordenlijst + EN audio | Must | M | #24 | — | Open |

**Toelichting:** Fase 3 is bewust compact. #23 kan technisch al eerder starten (na #1), maar het is verstandiger om te wachten tot de NL-content stabiel is zodat je weet wat je vertaalt.

---

## Fase 4 — School-infrastructuur

> Doel: accounts, klassen, opdrachten en rapportage.
> Startconditie: fase 1-3 stabiel, of concrete school als testpartner.
> Opmerking: EP-02 is deels al done (database, API, hosting). Hieronder alleen de openstaande stories.

### EP-02 — Platform & infrastructuur (openstaand)

| # | Story | Prio | Effort | Afhankelijk van | Blokkeert | Status |
|---|-------|------|--------|-----------------|-----------|--------|
| 26 | US-02-04 — Rollback-mogelijkheid (resterend AC) | Must | S | — | — | Open |
| 27 | US-02-05 — Privacy en AVG-compliance (DPA, privacyverklaring) | Must | L | — | #28 | Open |

### EP-03 — Authenticatie & identiteit

| # | Story | Prio | Effort | Afhankelijk van | Blokkeert | Status |
|---|-------|------|--------|-----------------|-----------|--------|
| 28 | US-03-01 — Vrij spelen zonder account (formaliseren) | Must | XS | — | — | ~Done |
| 29 | US-03-05 — Schoolbeheerder account aanmaken | Must | M | #27 | #30, #33 | Open |
| 30 | US-03-04 — Leerkracht inloggen via magic link | Must | M | #29 | #34 | Open |
| 31 | US-03-02 — Leerling inloggen via klascode + voornaam | Must | M | #29, #35 | #36 | Open |
| 32 | US-03-03 — Leerling kiest avatar | Should | S | #31 | — | Open |
| 33 | US-03-07 — Uitloggen en sessiebeheer | Must | S | #29 | — | Open |
| 34 | US-03-06 — SSO (Google / Microsoft) | Could | L | #30 | — | Open |

### EP-05 — School & klasbeheer

| # | Story | Prio | Effort | Afhankelijk van | Blokkeert | Status |
|---|-------|------|--------|-----------------|-----------|--------|
| 35 | US-05-07 — Afgeschermde omgeving per school (tenant isolatie) | Must | L | #29 | #36, #37 | Open |
| 36 | US-05-01 — School aanmaken en onboarden | Must | M | #29, #35 | #37 | Open |
| 37 | US-05-02 — Leerkracht uitnodigen | Must | M | #30, #36 | #38 | Open |
| 38 | US-05-03 — Klas aanmaken | Must | S | #37 | #39 | Open |
| 39 | US-05-04 — Leerlingen toevoegen aan klas | Must | M | #31, #38 | #40 | Open |
| 40 | US-05-05 — Klas-dashboard voor leerkracht | Must | M | #39 | #41, #42 | Open |
| 41 | US-05-06 — School-dashboard voor schoolbeheerder | Should | M | #40 | — | Open |

### EP-06 — Opdrachten & leerpad (herstructureerd)

| # | Story | Prio | Effort | Afhankelijk van | Blokkeert | Status |
|---|-------|------|--------|-----------------|-----------|--------|
| 42 | US-06-07 — Kind plaatsen op niveau (skipToLevel) | Must | S | #7, #40 | — | Open |
| 43 | US-06-01 — Opdracht aanmaken voor de klas | Must | M | #40 | #44, #45 | Open |
| 44 | US-06-02 — Opdracht toewijzen aan individuele leerling | Must | S | #43 | — | Open |
| 45 | US-06-03 — Opdracht zien en uitvoeren (leerling) | Must | M | #31, #43 | — | Open |
| 46 | US-06-06 — Deadline en herinnering | Could | M | #43 | — | Open |

### EP-07 — Voortgang & rapportage

| # | Story | Prio | Effort | Afhankelijk van | Blokkeert | Status |
|---|-------|------|--------|-----------------|-----------|--------|
| 47 | US-07-02 — Klasoverzicht voor leerkracht | Must | M | #40 | #48 | Open |
| 48 | US-07-03 — Individueel voortgangsscherm (leerkracht-view) | Should | M | #47 | — | Open |
| 49 | US-07-04 — Weekrapport voor leerkracht | Could | M | #47 | — | Open |
| 50 | US-07-05 — Schoolbrede rapportage voor beheerder | Should | M | #47 | — | Open |
| 51 | US-07-06 — Inzicht voor ouders | Could | L | #48 | — | Open |

### Fase 4 — samenvattend pad

```
#27 AVG ── #29 Schoolbeheerder account ──┬── #30 Magic link ── #34 SSO (Could)
                                         ├── #33 Sessiebeheer
                                         └── #35 Tenant isolatie ── #36 School aanmaken
                                                                        │
                    #31 Leerling login ←── #38 Klas aanmaken ←── #37 Leerkracht uitnodigen
                          │                      │
                          │               #39 Leerlingen toevoegen
                          │                      │
                          │               #40 Klas-dashboard ──┬── #42 Kind op niveau plaatsen
                          │                                    ├── #43 Opdrachten ── #44, #45
                          │                                    └── #47 Klasoverzicht ── #48, #49, #50
                          │
                          └── #32 Avatar (Should)
```

---

## Effort-totalen per fase

| Fase | Must | Should | Could | Totaal stories |
|------|------|--------|-------|----------------|
| 1 — Fundament + progressie | ~5-6 dagen | ~1-2 dagen | — | 11 |
| 2 — Taalmodule | ~6-8 dagen | ~1-2 dagen | ~3+ dagen | 11 |
| 3 — i18n | ~3-4 dagen | — | — | 3 |
| 4 — School-infra | ~8-10 dagen | ~3-4 dagen | ~4-5 dagen | 26 |

**Totaal Must-pad (fase 1-3):** ~14-18 werkdagen
**Totaal inclusief fase 4:** ~30-40 werkdagen

*Dit zijn schattingen op basis van effort-labels. Werkelijke doorlooptijd hangt af van beschikbare uren per week.*

---

## Regels voor deze planning

1. **Must-stories binnen een fase worden in volgnummer-volgorde afgewerkt.** Afwijken mag alleen als de afhankelijkheden het toelaten en er een expliciete reden is.
2. **Should/Could stories worden pas opgepakt als alle Must-stories van die fase af zijn**, tenzij ze parallel kunnen en niet op het kritieke pad zitten.
3. **Een fase is pas af als alle Must-stories Done zijn.** Should/Could mogen doorschuiven.
4. **Scope-bewaking:** Als een story tijdens implementatie groter blijkt dan het effort-label, splits dan in kleinere stories. Niet: "ik maak het even af."
5. **Fase 4 start niet voor fase 1 stabiel draait**, tenzij er een school-partner klaarstaat die wil testen.
6. **Content-taken (woordenlijsten, audio, illustraties) lopen parallel aan technische stories.** Ze hoeven niet te wachten op code, en code hoeft niet te wachten op alle content — begin met een minimale set.
