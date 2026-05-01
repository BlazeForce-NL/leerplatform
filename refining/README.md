# Leerplatform — Refinement Backlog

## Visie

Een laagdrempelig leerplatform waar kinderen (6–12 jaar) zelfstandig kunnen oefenen met rekenen, én waar scholen klassen en leerlingen kunnen onboarden in een afgeschermde, beheerde omgeving.

## Twee gebruiksvormen

| Modus | Wie | Hoe |
|---|---|---|
| **Vrij oefenen** | Elk kind, anoniem of met account | Direct spelen zonder registratie |
| **Schoolomgeving** | Leerlingen in een klas | Via school/klas onboarding, afgeschermd |

## Epics — volgorde en afhankelijkheden

```
EP-01 Technisch fundament          ← start hier (geen afhankelijkheden)
EP-02 Platform & infrastructuur    ← parallel aan EP-01
EP-03 Authenticatie & identiteit   ← na EP-02
EP-04 Vrij oefenen (uitgebreid)    ← na EP-01, parallel aan EP-03
EP-05 School & klasbeheer          ← na EP-03
EP-06 Opdrachten & leerpad         ← na EP-05
EP-07 Voortgang & rapportage       ← na EP-06
```

## Overzicht

| Epic | Titel | Prioriteit | Status |
|---|---|---|---|
| [EP-01](epic-01-technisch-fundament.md) | Technisch fundament | Must | Open |
| [EP-02](epic-02-platform-infrastructuur.md) | Platform & infrastructuur | Must | Open |
| [EP-03](epic-03-authenticatie.md) | Authenticatie & identiteit | Must | Open |
| [EP-04](epic-04-vrij-oefenen.md) | Vrij oefenen (uitgebreid) | Should | Open |
| [EP-05](epic-05-school-klasbeheer.md) | School & klasbeheer | Must | Open |
| [EP-06](epic-06-opdrachten-leerpad.md) | Opdrachten & leerpad | Should | Open |
| [EP-07](epic-07-voortgang-rapportage.md) | Voortgang & rapportage | Should | Open |

## Conventies

**Rollen:**
- `kind` — leerling zonder account (vrij oefenen)
- `leerling` — leerling met account in een klas
- `leerkracht` — beheert een of meerdere klassen
- `schoolbeheerder` — beheert de school, leerkrachten en klassen
- `platform-admin` — beheert scholen op platformniveau

**Prioriteit (MoSCoW):**
- `Must` — platform werkt niet zonder dit
- `Should` — sterk gewenst, wel werkbaar zonder
- `Could` — nice to have
- `Won't` — bewust buiten scope

**Effort:** XS · S · M · L · XL
