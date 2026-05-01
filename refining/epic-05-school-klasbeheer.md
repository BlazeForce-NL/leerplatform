# EP-05 — School & klasbeheer

> Scholen en leerkrachten kunnen klassen aanmaken, leerlingen onboarden en de omgeving beheren. Elke school is een afgeschermde omgeving.

**Afhankelijkheden:** EP-03  
**Blokkerende epic voor:** EP-06, EP-07

---

## US-05-01 — School aanmaken en onboarden

**Als** schoolbeheerder  
**wil ik** mijn school registreren op het platform  
**zodat** onze leerlingen in een eigen, afgeschermde omgeving kunnen werken.

**Acceptatiecriteria:**
- [ ] Registratiewizard: schoolnaam → type school → contactpersoon → akkoord met gebruiksvoorwaarden/DPA
- [ ] School krijgt unieke schoolcode (bijv. `LP-2026-XYZ`)
- [ ] Schoolbeheerder ontvangt bevestigingsmail met instructies
- [ ] School is standaard in "proef"-modus (30 dagen, max 3 klassen)
- [ ] Upgrade naar volledig account via contactformulier of zelfservice

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-03-05

---

## US-05-02 — Leerkracht uitnodigen

**Als** schoolbeheerder  
**wil ik** leerkrachten uitnodigen voor het platform  
**zodat** zij hun eigen klassen kunnen beheren.

**Acceptatiecriteria:**
- [ ] Beheerder voert e-mailadres en naam in → uitnodigingsmail verstuurd
- [ ] Uitnodiging geldig voor 7 dagen
- [ ] Leerkracht accepteert uitnodiging, kiest wachtwoord of logt in via magic link
- [ ] Leerkracht is direct gekoppeld aan de school
- [ ] Beheerder ziet status: uitgenodigd / actief / inactief
- [ ] Leerkracht-rol intrekbaar door beheerder

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-05-01, US-03-04

---

## US-05-03 — Klas aanmaken

**Als** leerkracht  
**wil ik** een klas aanmaken  
**zodat** ik mijn leerlingen kan groeperen en beheren.

**Acceptatiecriteria:**
- [ ] Klasnaam invullen (bijv. "Groep 4A") en schooljaar kiezen
- [ ] Klas krijgt automatisch een unieke klascode (6-cijferig, makkelijk leesbaar: geen O/0, geen I/l)
- [ ] Klascode zichtbaar en kopieerbaar in het klas-dashboard
- [ ] Meerdere leerkrachten kunnen aan één klas gekoppeld worden
- [ ] Klas archiveerbaar aan het einde van het schooljaar (data behouden, klas inactief)

**Prioriteit:** Must  
**Effort:** S  
**Afhankelijkheden:** US-05-02

---

## US-05-04 — Leerlingen toevoegen aan een klas

**Als** leerkracht  
**wil ik** leerlingen kunnen toevoegen aan mijn klas  
**zodat** ik hun voortgang kan volgen.

**Methode A — Leerling logt zelf in (aanbevolen):**
- [ ] Leerkracht deelt klascode met leerlingen
- [ ] Leerling voert klascode + voornaam in → account aangemaakt en gekoppeld

**Methode B — Bulk import door leerkracht:**
- [ ] Leerkracht importeert een lijst met voornamen (CSV of handmatige invoer)
- [ ] Accounts worden aangemaakt voor de hele klas in één actie
- [ ] Leerlingen krijgen geen e-mail (geen e-mailadres nodig)

**Acceptatiecriteria:**
- [ ] Beide methoden werken
- [ ] Leerkracht ziet direct wie er ingelogd is en wie nog niet
- [ ] Naamconflicten (twee kinderen met dezelfde voornaam) worden netjes afgehandeld (initiaal toevoegen)
- [ ] Leerling verwijderen of overzetten naar andere klas mogelijk

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-05-03, US-03-02

---

## US-05-05 — Klas-dashboard voor leerkracht

**Als** leerkracht  
**wil ik** een overzicht van mijn klas zien  
**zodat** ik in één oogopslag zie hoe het gaat.

**Acceptatiecriteria:**
- [ ] Dashboard toont: alle leerlingen, laatste actieve sessie, gemiddelde score per modus
- [ ] Sorteerbaar op naam, score, activiteit
- [ ] Klikbaar op leerling → detailpagina met individuele voortgang
- [ ] Klascode prominent weergegeven (makkelijk te kopiëren voor op het bord)
- [ ] Indicatie: leerlingen die de afgelopen 7 dagen niet actief zijn geweest

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-05-04

---

## US-05-06 — School-dashboard voor schoolbeheerder

**Als** schoolbeheerder  
**wil ik** een overzicht van de hele school  
**zodat** ik een beeld heb van het gebruik per klas en leerkracht.

**Acceptatiecriteria:**
- [ ] Overzicht van alle klassen met: aantal leerlingen, actieve sessies afgelopen week
- [ ] Overzicht van alle leerkrachten met laatste login
- [ ] Geaggregeerde statistieken: totaal aantal sessies, meest gebruikte modus
- [ ] Geen individuele leerlinggegevens op schoolniveau (privacy)
- [ ] Exporteerbaar als PDF/CSV voor rapportage

**Prioriteit:** Should  
**Effort:** M  
**Afhankelijkheden:** US-05-05

---

## US-05-07 — Afgeschermde omgeving per school

**Als** school  
**wil ik** dat leerlingen van andere scholen geen toegang hebben tot onze data  
**zodat** de privacy van onze leerlingen gewaarborgd is.

**Acceptatiecriteria:**
- [ ] Alle API-routes controleren school-tenant bij elke request
- [ ] Leerling kan alleen de klascode van zijn eigen school gebruiken
- [ ] Leerkracht ziet alleen klassen van zijn eigen school
- [ ] Scoreborden zijn per school of per klas — niet platform-breed (tenzij anoniem)
- [ ] Penetratietest: probeer cross-tenant data-access (minstens handmatige test met twee testscholen)

**Prioriteit:** Must  
**Effort:** L  
**Afhankelijkheden:** US-02-02, US-05-03
