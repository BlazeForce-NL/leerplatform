# EP-01 — Technisch fundament

> De bestaande codebase op orde brengen zodat het platform veilig en duurzaam uitgebouwd kan worden.

**Afhankelijkheden:** geen  
**Blokkerende epic voor:** alles

---

## US-01-01 — Component splitsing NumberblocksGame

**Als** ontwikkelaar  
**wil ik** dat `NumberblocksGame.tsx` opgesplitst wordt in kleinere, herbruikbare componenten  
**zodat** de code begrijpelijk, testbaar en uitbreidbaar blijft.

**Acceptatiecriteria:**
- [ ] `NumberblocksGame.tsx` heeft maximaal ~150 regels orchestration-logica
- [ ] Losse componenten: `NumberBlock`, `Numberling`, `GameScreen`, `SummaryScreen`, `Leaderboard`, `NameEntry`
- [ ] Audio-logica verplaatst naar `src/lib/useAudio.ts`
- [ ] Confetti-logica verplaatst naar `src/components/Confetti.tsx`
- [ ] Alle bestaande functionaliteit werkt ongewijzigd na de splitsing
- [ ] Browser-test: elk scherm (naam, spel, samenvatting, scorebord) werkt

**Prioriteit:** Must  
**Effort:** L  
**Afhankelijkheden:** geen

---

## US-01-02 — Design tokens voor kleuren en spacing

**Als** ontwikkelaar  
**wil ik** dat alle visuele waarden via Tailwind design tokens lopen  
**zodat** er geen hardcoded hex-kleuren of magic numbers in de componenten staan.

**Acceptatiecriteria:**
- [ ] Alle kleuren in `NumberblocksGame` (ONES_C, TENS_C, spelkleuren) staan als CSS custom properties of Tailwind-tokens in `tailwind.config.js`
- [ ] Geen `style={{ color: '#...' }}` of `bg-[#...]` meer in componenten
- [ ] Dark mode werkt via tokens, niet via hardcoded overrides
- [ ] Visueel geen verschil t.o.v. de huidige situatie

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-01-01

---

## US-01-03 — Linting en type-safety op orde

**Als** ontwikkelaar  
**wil ik** dat `pnpm lint` en `pnpm build` zonder warnings slagen  
**zodat** de kwaliteitspoorten betrouwbaar zijn.

**Acceptatiecriteria:**
- [ ] `pnpm lint` geeft 0 errors en 0 warnings
- [ ] `pnpm build` geeft 0 TypeScript-errors
- [ ] Geen `any`-types in nieuwe code
- [ ] ESLint-config uitgebreid met `@typescript-eslint/no-explicit-any`

**Prioriteit:** Must  
**Effort:** S  
**Afhankelijkheden:** US-01-01

---

## US-01-04 — Unit tests voor game-logica

**Als** ontwikkelaar  
**wil ik** unit tests voor de kern-spellogica  
**zodat** regressies direct opvallen bij wijzigingen.

**Acceptatiecriteria:**
- [ ] Testframework opgezet (Vitest of Jest, passend bij Next.js 16)
- [ ] Tests voor: scorecalculatie, combo-logica, categorienaam-generatie, tafelgeneratie
- [ ] Tests voor `storage.ts` utilities (happy path + edge cases)
- [ ] `pnpm test` draait in CI (GitHub Actions of vergelijkbaar)

**Prioriteit:** Should  
**Effort:** M  
**Afhankelijkheden:** US-01-01

---

## US-01-05 — Toegankelijkheid op WCAG AA niveau

**Als** kind met een beperking  
**wil ik** het spel kunnen bedienen met alleen een toetsenbord  
**zodat** ik niet afhankelijk ben van een muis of touch.

**Acceptatiecriteria:**
- [ ] Alle interactieve elementen zijn bereikbaar via Tab
- [ ] Focus-indicator is zichtbaar (minimaal 3:1 contrast)
- [ ] Kleurcontrast tekst/achtergrond voldoet aan WCAG AA (4.5:1)
- [ ] Knoppen hebben een label (aria-label of zichtbare tekst)
- [ ] Touch targets zijn minimaal 44×44px
- [ ] Getest met toetsenbord-only navigatie in Chrome en Firefox

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-01-01
