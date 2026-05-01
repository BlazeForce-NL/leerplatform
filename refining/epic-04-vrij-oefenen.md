# EP-04 — Vrij oefenen (uitgebreid)

> Het bestaande spel verbeteren en uitbreiden zodat kinderen zelfstandig en motiverend kunnen oefenen, met of zonder account.

**Afhankelijkheden:** EP-01  
**Parallel aan:** EP-03

---

## US-04-01 — Oefenmodus kiezen zonder drempel

**Als** kind  
**wil ik** snel de juiste oefenmodus kiezen  
**zodat** ik direct kan starten met wat ik wil oefenen.

**Acceptatiecriteria:**
- [ ] Startscherm toont grote, duidelijke tegels per modus (optellen, aftrekken, tafels, mix)
- [ ] Iconen en kleurcodering per modus (geen kleine tekst)
- [ ] Tafelmodus toont aanvullend welke tafel (×1 t/m ×10) direct als subkeuze
- [ ] Timer-instelling zichtbaar vóór het spelen (niet verstopt in instellingen)
- [ ] Keuze wordt onthouden voor de volgende sessie (localStorage)

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-01-01

---

## US-04-02 — Voortgang bijhouden voor gastgebruiker

**Als** kind zonder account  
**wil ik** mijn scores en highscores zien  
**zodat** ik weet hoe ik me verbeter.

**Acceptatiecriteria:**
- [ ] Highscores per modus opgeslagen in localStorage (bestaand gedrag uitgebreid)
- [ ] Persoonlijk scorebord toont: beste score, gemiddelde, aantal gespeelde sessies
- [ ] Grafiek of visuele weergave van voortgang over de laatste 7 sessies
- [ ] Duidelijke prompt: "Maak een account aan om je voortgang nooit kwijt te raken"

**Prioriteit:** Should  
**Effort:** M  
**Afhankelijkheden:** US-01-01

---

## US-04-03 — Scorebord vergelijken (anoniem)

**Als** kind  
**wil ik** mijn score vergelijken met andere kinderen  
**zodat** er een element van gezonde competitie is.

**Acceptatiecriteria:**
- [ ] Globaal anoniem scorebord per modus (top 10)
- [ ] Score opgeslagen met alleen een zelfgekozen bijnaam (geen persoonsgegevens)
- [ ] Scorebord verversbaar zonder pagina-refresh
- [ ] Mogelijkheid om eigen score te verwijderen (privacyrecht)
- [ ] Moderatie: vloekwoorden of ongepaste namen gefilterd

**Prioriteit:** Could  
**Effort:** L  
**Afhankelijkheden:** US-02-02, US-04-01

---

## US-04-04 — Aanpasbaar tempo en moeilijkheidsgraad

**Als** kind  
**wil ik** zelf het tempo en de moeilijkheid aanpassen  
**zodat** het spel uitdagend maar niet frustrerend is.

**Acceptatiecriteria:**
- [ ] Getalbereik instelbaar per modus (bijv. optellen t/m 10, t/m 20, t/m 100)
- [ ] Timer: uit / 30s / 20s / 15s / 10s (bestaand) + vrije invoer (5–60s)
- [ ] Vragen adaptief: bij 3 opeenvolgende fouten wordt het bereik tijdelijk teruggeschroefd
- [ ] Instellingen worden onthouden

**Prioriteit:** Should  
**Effort:** M  
**Afhankelijkheden:** US-01-01

---

## US-04-05 — Beloningssysteem (badges en sterren)

**Als** kind  
**wil ik** beloningen ontvangen voor mijn prestaties  
**zodat** ik gemotiveerd blijf.

**Acceptatiecriteria:**
- [ ] Badges voor mijlpalen: eerste sessie, eerste highscore, 10 sessies gespeeld, tafel ×10 voltooid, etc.
- [ ] Badges zichtbaar in profiel (ook voor gastgebruiker in localStorage)
- [ ] Bij behalen van badge: feestelijke animatie (uitbreiding op bestaande confetti)
- [ ] Sterren-systeem per modus: ★☆☆ / ★★☆ / ★★★ op basis van score-drempel
- [ ] Badges overdraagbaar naar account als kind later inlogt

**Prioriteit:** Should  
**Effort:** L  
**Afhankelijkheden:** US-04-01, US-03-02

---

## US-04-06 — Meerdere talen (NL + EN)

**Als** school met anderstalige leerlingen  
**wil ik** het platform in meerdere talen kunnen gebruiken  
**zodat** ook leerlingen die minder Nederlands spreken mee kunnen doen.

**Acceptatiecriteria:**
- [ ] Nederlands (standaard) en Engels ondersteund
- [ ] Taalinstelling kiesbaar in gebruikersinstellingen en op loginscherm
- [ ] Alle UI-teksten via i18n-systeem (next-intl of vergelijkbaar)
- [ ] Getallen en tijdweergave lokalisatie-bewust (komma vs punt)

**Prioriteit:** Could  
**Effort:** L  
**Afhankelijkheden:** US-01-01
