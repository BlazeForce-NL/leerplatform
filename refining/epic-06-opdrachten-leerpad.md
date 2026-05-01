# EP-06 — Opdrachten & leerpad

> Leerkrachten kunnen gerichte oefeningen toewijzen aan klassen of individuele leerlingen, afgestemd op de behoefte van elk kind.

**Afhankelijkheden:** EP-05  
**Blokkerende epic voor:** EP-07

---

## US-06-01 — Opdracht aanmaken voor de klas

**Als** leerkracht  
**wil ik** een oefening toewijzen aan mijn klas  
**zodat** alle leerlingen hetzelfde onderwerp oefenen.

**Acceptatiecriteria:**
- [ ] Leerkracht kiest: modus, getalbereik, timer, deadline (optioneel)
- [ ] Opdracht zichtbaar voor alle leerlingen in de klas bij inloggen
- [ ] Leerling kan opdracht starten via een prominente "Nu oefenen"-knop
- [ ] Leerling kan nog steeds vrij oefenen naast de opdracht
- [ ] Opdracht toont voortgangsindicator: hoeveel leerlingen hebben het gedaan

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-05-05

---

## US-06-02 — Opdracht toewijzen aan individuele leerling

**Als** leerkracht  
**wil ik** een specifieke oefening toewijzen aan één leerling  
**zodat** ik kan differentiëren op niveau.

**Acceptatiecriteria:**
- [ ] Leerling selecteren in klas-dashboard → opdracht aanmaken
- [ ] Individuele opdracht toont als eerste bij de leerling bij inloggen
- [ ] Andere leerlingen zien deze opdracht niet
- [ ] Leerkracht ziet of de individuele opdracht gedaan is

**Prioriteit:** Must  
**Effort:** S  
**Afhankelijkheden:** US-06-01

---

## US-06-03 — Opdracht zien en uitvoeren (leerling)

**Als** leerling  
**wil ik** duidelijk zien welke opdrachten ik moet maken  
**zodat** ik weet wat er van me verwacht wordt.

**Acceptatiecriteria:**
- [ ] Opdrachtenpaneel zichtbaar op het startscherm na inloggen
- [ ] Opdracht toont: beschrijving, modus-icoon, deadline (als ingesteld), status (te doen / gedaan)
- [ ] Opdracht starten gaat direct naar de juiste modus (geen extra keuzes)
- [ ] Na voltooien: visueel bevestigd ("Opdracht gedaan! 🎉")
- [ ] Leerling kan opdracht meerdere keren spelen (best score telt)

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-06-01, US-03-02

---

## US-06-04 — Leerpad per leerling instellen

**Als** leerkracht  
**wil ik** een reeks oefeningen instellen voor een leerling  
**zodat** hij/zij stap voor stap een leerpad doorloopt.

**Acceptatiecriteria:**
- [ ] Leerpad bestaat uit geordende stappen (bijv. tafel ×2 → ×3 → ×4)
- [ ] Volgende stap ontgrendelt na behalen van minimale score (instelbaar door leerkracht)
- [ ] Leerling ziet voortgang in het leerpad (visuele progressie-indicator)
- [ ] Leerkracht kan leerpad op elk moment aanpassen
- [ ] Meerdere leerlingen kunnen hetzelfde leerpad-template gebruiken

**Prioriteit:** Should  
**Effort:** L  
**Afhankelijkheden:** US-06-02

---

## US-06-05 — Sjablonen voor opdrachten en leerpaden

**Als** leerkracht  
**wil ik** gebruik kunnen maken van kant-en-klare oefensjablonen  
**zodat** ik snel opdrachten kan aanmaken zonder alles zelf te bedenken.

**Acceptatiecriteria:**
- [ ] Bibliotheek met standaard-sjablonen per groep/leerjaar (bijv. "Groep 4: tafels ×2, ×3, ×5")
- [ ] Sjabloon is aanpasbaar na selectie
- [ ] Leerkracht kan eigen sjablonen opslaan en hergebruiken
- [ ] Sjablonen deelbaar binnen de school (schoolbeheerder beheert dit)

**Prioriteit:** Could  
**Effort:** M  
**Afhankelijkheden:** US-06-04

---

## US-06-06 — Deadline en herinnering

**Als** leerkracht  
**wil ik** een deadline instellen voor een opdracht  
**zodat** leerlingen weten wanneer ze klaar moeten zijn.

**Acceptatiecriteria:**
- [ ] Deadline kiesbaar bij het aanmaken van een opdracht (datum + optioneel tijdstip)
- [ ] Leerling ziet resterende tijd ("Nog 2 dagen") bij de opdracht
- [ ] Na de deadline: opdracht gemarkeerd als verlopen, leerling kan nog wel spelen maar score telt niet meer mee voor de opdracht-statistieken
- [ ] Optioneel: herinneringsnotificatie (push of e-mail, alleen als ouders toestemming hebben gegeven)

**Prioriteit:** Could  
**Effort:** M  
**Afhankelijkheden:** US-06-01
