# EP-07 — Voortgang & rapportage

> Leerlingen, leerkrachten en schoolbeheerders krijgen inzicht in de voortgang, passend bij hun rol en verantwoordelijkheid.

**Afhankelijkheden:** EP-06

---

## US-07-01 — Persoonlijk voortgangsscherm (leerling)

**Als** leerling  
**wil ik** mijn eigen voortgang zien  
**zodat** ik trots ben op mijn groei en weet wat ik nog kan verbeteren.

**Acceptatiecriteria:**
- [ ] Scherm toont: sterren per modus, behaalde badges, beste scores, aantal gespeelde sessies
- [ ] Grafiek van scores over de afgelopen 2 weken (eenvoudige lijndiagram)
- [ ] Vergelijking met eigen vorige highscore (niet met andere leerlingen, tenzij klasscoreboard actief)
- [ ] Taal en weergave passend voor kinderen (groot, kleurrijk, begrijpelijk zonder tekst)
- [ ] Voortgangsscherm bereikbaar via profielknop na inloggen

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-06-03

---

## US-07-02 — Klasoverzicht voor leerkracht

**Als** leerkracht  
**wil ik** de voortgang van de hele klas in één scherm zien  
**zodat** ik snel zie wie hulp nodig heeft en wie uitgedaagd kan worden.

**Acceptatiecriteria:**
- [ ] Tabel met leerlingen: naam, scores per modus, opdrachten voltooid, badge-teller
- [ ] Kleurcodering: groen (op schema), oranje (aandacht nodig), rood (al meerdere dagen inactief)
- [ ] Filter op: modus, tijdperiode, opdrachttype
- [ ] Klik op leerling → individueel voortgangsscherm
- [ ] Klasgemiddelde zichtbaar per modus (benchmarking)

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-07-01

---

## US-07-03 — Individueel voortgangsscherm (leerkracht-view)

**Als** leerkracht  
**wil ik** de gedetailleerde voortgang van één leerling zien  
**zodat** ik gerichte feedback kan geven of een opdracht kan aanpassen.

**Acceptatiecriteria:**
- [ ] Sessiegeschiedenis: datum, modus, score, duur, aantal fouten
- [ ] Veelgemaakte fouten: welke sommen gaan structureel mis
- [ ] Voortgang per modus over tijd (grafiek)
- [ ] Opdrachtstatus: welke opdrachten gedaan/niet gedaan
- [ ] Notitieveld voor de leerkracht (intern, leerling ziet dit niet)

**Prioriteit:** Should  
**Effort:** M  
**Afhankelijkheden:** US-07-02

---

## US-07-04 — Weekrapport voor leerkracht

**Als** leerkracht  
**wil ik** elke week een samenvatting ontvangen van de activiteit in mijn klas  
**zodat** ik zonder in te loggen een beeld heb.

**Acceptatiecriteria:**
- [ ] Optionele wekelijkse e-mail (opt-in, standaard uit)
- [ ] Inhoud: aantal actieve leerlingen, gemiddelde score, uitschieters (hoog en laag), voltooide opdrachten
- [ ] Ingesteld per klas, niet per leerkracht (zodat meerdere leerkrachten hetzelfde rapport ontvangen)
- [ ] Direct uitschakelbaar via link in de e-mail (one-click unsubscribe)

**Prioriteit:** Could  
**Effort:** M  
**Afhankelijkheden:** US-07-02

---

## US-07-05 — Schoolbrede rapportage voor beheerder

**Als** schoolbeheerder  
**wil ik** een overzicht van het gebruik per klas  
**zodat** ik kan rapporteren aan het schoolbestuur.

**Acceptatiecriteria:**
- [ ] Dashboard toont: actieve leerlingen per week, gemiddelde sessieduur, meest gebruikte modus
- [ ] Vergelijking tussen klassen (anoniem geaggregeerd)
- [ ] Geen individuele leerlinggegevens op schoolniveau (privacy)
- [ ] Export als CSV of PDF
- [ ] Tijdfilter: afgelopen week / maand / schooljaar

**Prioriteit:** Should  
**Effort:** M  
**Afhankelijkheden:** US-07-02

---

## US-07-06 — Inzicht voor ouders

**Als** ouder  
**wil ik** de voortgang van mijn kind kunnen volgen  
**zodat** ik thuis kan ondersteunen en betrokken blijf.

**Acceptatiecriteria:**
- [ ] Leerkracht kan ouder-toegang per leerling inschakelen (opt-in)
- [ ] Ouder ontvangt wekelijkse samenvatting per e-mail (opt-in, met AVG-toestemming)
- [ ] Ouder kan optioneel een eigen portaal-login aanvragen (lees-only, alleen eigen kind)
- [ ] Geen wachtwoord onthouden: ouder-portaal via magic link
- [ ] Ouder ziet alleen eigen kind, niet de rest van de klas

**Prioriteit:** Could  
**Effort:** L  
**Afhankelijkheden:** US-07-03, US-03-04
