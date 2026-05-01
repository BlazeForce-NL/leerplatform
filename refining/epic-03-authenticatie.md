# EP-03 — Authenticatie & identiteit

> Laagdrempelige maar veilige login voor alle rollen, passend bij de leeftijd van de gebruiker.

**Afhankelijkheden:** EP-02  
**Blokkerende epic voor:** EP-05, EP-06, EP-07

---

## Ontwerpprincipes voor auth

- **Kinderen** (6–12): zo min mogelijk wrijving. Geen wachtwoord onthouden. PIN-code of klascode volstaat.
- **Leerkrachten**: e-mail + magic link (geen wachtwoord te onthouden, geen phishing-risico).
- **Schoolbeheerders**: e-mail + wachtwoord of SSO (Google Workspace / Microsoft 365).
- **Vrije oefenaar**: geen account nodig — altijd toegankelijk.

---

## US-03-01 — Vrij spelen zonder account

**Als** kind  
**wil ik** direct kunnen beginnen te spelen zonder registratie  
**zodat** de drempel zo laag mogelijk is.

**Acceptatiecriteria:**
- [ ] Homepagina heeft prominent een "Direct spelen" knop — geen login vereist
- [ ] Voortgang opgeslagen in localStorage (bestaand gedrag)
- [ ] Geen cookies of tracking voor anonieme spelers
- [ ] Duidelijk onderscheid in UI: "Je speelt als gast — maak een account om je scores bij te houden"

**Prioriteit:** Must  
**Effort:** XS  
**Afhankelijkheden:** geen (EP-01 voldoende)

---

## US-03-02 — Leerling inloggen via klascode + voornaam

**Als** leerling in een klas  
**wil ik** inloggen met de klascode van mijn juf/meester en mijn voornaam  
**zodat** ik geen wachtwoord hoef te onthouden.

**Acceptatiecriteria:**
- [ ] Loginscherm: invoer klascode (6-cijferig) + voornaam
- [ ] Als voornaam uniek is in de klas → direct ingelogd
- [ ] Als voornaam meerdere keren voorkomt → extra stap: kies avatar of geef achternaam-initiaal
- [ ] Sessie geldig voor 8 uur (schooldag), daarna opnieuw inloggen
- [ ] Geen wachtwoord, geen e-mail vereist voor leerling
- [ ] Foutmelding bij ongeldige klascode (vriendelijk, in kindertaal)

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-02-02, US-03-05

---

## US-03-03 — Leerling kiest een avatar

**Als** leerling  
**wil ik** een avatar kiezen die bij mijn account hoort  
**zodat** ik mezelf herken op het scorebord en het leuker is.

**Acceptatiecriteria:**
- [ ] Bij eerste login kiest leerling uit minimaal 12 avatars (dier- of figuuricoontjes)
- [ ] Avatar opgeslagen bij het leerling-account
- [ ] Avatar zichtbaar op scorebord en voortgangsscherm
- [ ] Avatar later te wijzigen in profiel-instellingen

**Prioriteit:** Should  
**Effort:** S  
**Afhankelijkheden:** US-03-02

---

## US-03-04 — Leerkracht inloggen via magic link

**Als** leerkracht  
**wil ik** inloggen via een link die naar mijn e-mailadres gestuurd wordt  
**zodat** ik geen wachtwoord hoef te beheren.

**Acceptatiecriteria:**
- [ ] Loginpagina: e-mailadres invullen → magic link ontvangen
- [ ] Link geldig voor 15 minuten, eenmalig bruikbaar
- [ ] Na klikken op link: direct ingelogd, sessie 7 dagen geldig
- [ ] Sessieverlenging bij actief gebruik (sliding session)
- [ ] E-mail heeft duidelijk afzender "Leerplatform" en bevat geen gevoelige informatie

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-02-02, US-02-04

---

## US-03-05 — Schoolbeheerder account aanmaken

**Als** schoolbeheerder  
**wil ik** een account aanmaken voor mijn school  
**zodat** ik leerkrachten en klassen kan beheren.

**Acceptatiecriteria:**
- [ ] Registratieformulier: schoolnaam, eigen naam, e-mailadres
- [ ] Bevestigingsmail verstuurd na registratie
- [ ] Account actief na e-mailbevestiging
- [ ] Schoolbeheerder krijgt eigen dashboard (ziet alle klassen en leerkrachten van de school)
- [ ] Eén school kan meerdere schoolbeheerders hebben
- [ ] Wachtwoord-optie als alternatief voor magic link (schoolbeheerder kiest zelf)

**Prioriteit:** Must  
**Effort:** M  
**Afhankelijkheden:** US-02-02, US-02-03

---

## US-03-06 — SSO via Google Workspace / Microsoft 365

**Als** school die Google Workspace of Microsoft 365 gebruikt  
**wil ik** inloggen met mijn bestaande schoolaccount  
**zodat** ik geen apart wachtwoord nodig heb.

**Acceptatiecriteria:**
- [ ] "Inloggen met Google" knop op loginpagina (voor leerkrachten en beheerders)
- [ ] "Inloggen met Microsoft" knop op loginpagina
- [ ] OAuth 2.0 flow correct afgehandeld via NextAuth.js of vergelijkbaar
- [ ] Account gekoppeld aan school op basis van e-maildomein (configureerbaar per school)
- [ ] Bestaand account via magic link kan gekoppeld worden aan SSO

**Prioriteit:** Could  
**Effort:** L  
**Afhankelijkheden:** US-03-04, US-03-05

---

## US-03-07 — Uitloggen en sessiebeheer

**Als** gebruiker  
**wil ik** veilig kunnen uitloggen  
**zodat** anderen op hetzelfde apparaat mijn account niet kunnen gebruiken.

**Acceptatiecriteria:**
- [ ] Uitlog-knop zichtbaar in navigatie voor ingelogde gebruikers
- [ ] Uitloggen verwijdert sessie-token server-side
- [ ] Na uitloggen: redirect naar homepagina
- [ ] Verlopen sessies resulteren in vriendelijke melding, niet in een foutpagina
- [ ] Leerling-sessie vervalt na 8 uur (schooldagbeveiliging)

**Prioriteit:** Must  
**Effort:** S  
**Afhankelijkheden:** US-03-02, US-03-04
