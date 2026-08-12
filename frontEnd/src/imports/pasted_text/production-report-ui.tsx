Suunnittele ja toteuta web-pohjaisen tuotannon raportointijärjestelmän käyttöliittymä (frontend) meijeriteollisuuden tuotantoympäristöön. Järjestelmä kerää tietoa kolmesta osastosta — **keitto**, **pakkaamo** ja **separointi** — tallentaa ne tietokantaan ja mahdollistaa tietojen visualisoinnin ja raportoinnin. Käyttöliittymän tulee olla selkeä, teollisuus-/tuotantoympäristöön sopiva, käytettävissä sekä työpöydällä että tabletilla (työntekijät syöttävät tietoja tuotantotiloissa).
 
### Yleinen tyyli
- Puhdas, moderni "dashboard"-tyylinen teollisuussovellus (vertailukohtia: Grafana, Power BI, teollisuuden MES-järjestelmät).
- Väripaletti: neutraali pohja (valkoinen/vaaleanharmaa), yksi tumma korostusväri (esim. sininen tai petrooli) navigaatioon ja painikkeisiin, lisäksi statusvärit (vihreä/keltainen/punainen) hälytyksille ja poikkeamille.
- Selkeä typografia, hyvä kontrasti, isot kosketusystävälliset painikkeet (tabletti-käyttö huomioitava).
- Vasemmalla tai ylhäällä pysyvä päänavigaatio, joka näkyy kaikilla sivuilla.
- Käytä karttoja (cards), taulukoita ja yksinkertaisia kaavioita (pylväs-/viivakaaviot) datan esittämiseen.
### Päänavigaatio (näkyy joka sivulla)
Napit/linkit:
- **Etusivu**
- **Tietojensyöttö** (alavalikko: Keitto / Pakkaamo / Separointi)
- **Raportit** (alavalikko: Keitto / Pakkaamo / Separointi)
---
 
### SIVU 1: Etusivu (Dashboard)
Tarkoitus: yhteenveto koko tuotannon tilasta yhdellä silmäyksellä.
 
Sisältö:
- Otsikko "Raportointijärjestelmä" ja päänavigaatio ylhäällä.
- "Yhteenveto tuotannon tiedoista" -osio, jossa tietokortteja (KPI-kortteja) osastoittain (keitto, pakkaamo, separointi) — esim. tämän päivän tuotantomäärä, edellisen erän tiedot, hälytykset.
- Kaksi kaaviota rinnakkain:
  - **Tuotantomäärät osastoittain** (pylväskaavio, vertailee keittoa/pakkaamoa/separointia).
  - **Tuotantomäärät viikoittain osastoittain** (viivakaavio tai pinottu pylväskaavio, aikasarja viikon yli).
- **"Viimeisimmät tapahtumat"** -taulukko/lista, jossa näkyy tapahtumia eri osastoilta (aikaleima, osasto, tapahtuma/huomio, operaattori) — viimeisimmät ylimpänä.
- Painikkeet nopeaan siirtymiseen tietojensyöttöön ja raportteihin.
---
 
### SIVU 2: Tietojensyöttö — Keitto
Tarkoitus: työntekijä syöttää keiton tuotantotiedot lomakkeella.
 
Sisältö:
- Päänavigaatio + linkit muille syöttösivuille (Pakkaamo, Separointi) selkeästi näkyvillä (esim. välilehdet tai sivupalkki "Syöttösivut: Keitto | Pakkaamo | Separointi").
- Lomake "Syötä tiedot tietokantaan" seuraavilla kentillä (Keiton tiedot):
  - Päivämäärä (date picker)
  - Aika (time picker)
  - Tuote (dropdown, esim. maito, kerma)
  - Määrä (l) (numerokenttä)
  - Lämpötila (°C) (numerokenttä)
  - Kesto (min) (numerokenttä)
  - Operaattori (tekstikenttä / dropdown käyttäjälistasta)
  - Huomiot (tekstialue, esim. "laktoosi", "rasvainen")
- Iso, selkeä painike **"Tallenna tiedot tietokantaan"**.
- Lomakkeen alla pieni esikatselutaulukko viimeisimmistä syötetyistä riveistä (sama kenttärakenne).
---
 
### SIVU 3: Tietojensyöttö — Pakkaamo
Tarkoitus: sama rakenne kuin keiton syöttösivulla, mutta pakkaamon kentillä.
 
Sisältö:
- Päänavigaatio + linkit syöttösivuille.
- Lomake "Syötä pakkaamon tuotantotiedot":
  - Päivämäärä
  - Aika
  - Tuote (esim. jogurtti, rahka)
  - Pakkaukset (kpl) (numerokenttä)
  - Paino (kg) (numerokenttä)
  - Linja (dropdown, esim. Linja 1, Linja 2)
  - Operaattori
  - Huomiot (esim. "nopea erä")
- Painike **"Tallenna tiedot tietokantaan"**.
- Esikatselutaulukko viimeisimmistä pakkaamon riveistä.
---
 
### SIVU 4: Tietojensyöttö — Separointi
Tarkoitus: sama rakenne, separoinnin kentillä.
 
Sisältö:
- Päänavigaatio + linkit syöttösivuille.
- Lomake "Syötä separoinnin tuotantotiedot":
  - Päivämäärä
  - Aika
  - Määrä (l) (numerokenttä)
  - Rasvapitoisuus (%) (numerokenttä)
  - Lämpötila (°C) (numerokenttä)
  - Laitteisto (dropdown, esim. Separaattori 1, Separaattori 2 — huomioi että separaattori = säiliö)
  - Operaattori
  - Huomiot
- Painike **"Tallenna tiedot tietokantaan"**.
- Esikatselutaulukko viimeisimmistä separoinnin riveistä.
---
 
### SIVU 5: Raportit — Keitto
Tarkoitus: tuotantotietojen tarkastelu ja analysointi.
 
Sisältö:
- Päänavigaatio + linkit muihin raporttisivuihin (Pakkaamo, Separointi).
- **Suodatinpalkki (Filter)**: päivämääräväli, tuote, operaattori, hakukenttä ("Hae:").
- **Kaavio**: "Keiton tuotantomäärät" — määrät ja lämpötilat ajan yli (esim. yhdistelmäkaavio: pylväät=määrä, viiva=lämpötila).
- **Datataulukko** "Keittodata" (lajiteltava, sivutettu), sarakkeet:
  - Päivämäärä | Aika | Tuote | Määrä (l) | Lämpötila | Kesto (min) | Operaattori | Huomiot
  - Näytä esimerkkirivit (2–5 riviä) samalla rakenteella kuin: 11.03.2026, 08:00, maito, 500, 80, 50, Matti Virtanen, laktoosi.
- Painike raportin viemiseen (PDF / Excel-vienti).
---
 
### SIVU 6: Raportit — Pakkaamo
Sisältö:
- Päänavigaatio + linkit muihin raporttisivuihin.
- Suodatinpalkki (Filter) + hakukenttä.
- **Kaavio**: "Pakkaamon tuotantomäärät" — pakkaukset (kpl) ja paino (tonneittain).
- **Datataulukko** "Pakkaamodata", sarakkeet:
  - Päivämäärä | Aika | Tuote | Pakkaukset (kpl) | Paino (kg) | Linja | Operaattori | Huomiot
- Painike raportin viemiseen (PDF / Excel).
---
 
### SIVU 7: Raportit — Separointi
Sisältö:
- Päänavigaatio + linkit muihin raporttisivuihin.
- Suodatinpalkki (Filter) + hakukenttä.
- **Kaavio**: "Separoinnin tuotantomäärät" — määrä ja rasvapitoisuus.
- **Datataulukko** "Separointidata", sarakkeet:
  - Päivämäärä | Aika | Määrä (l) | Rasvapitoisuus (%) | Lämpötila (°C) | Laitteisto | Operaattori | Huomiot
- Painike raportin viemiseen (PDF / Excel).
---
 
### Lisävaatimukset toteutukseen
- Kaikki sivut jakavat saman header/nav-komponentin (design system -tyylisesti: napit, värit, fontit toistuvat).
- Käytä responsiivista gridiä: dashboard-kortit ja kaaviot rinnakkain isolla näytöllä, pinottuna tabletilla/mobiililla.
- Lomakkeet: näytä validointitilat (pakollinen kenttä, virheellinen arvo) ja tallennuksen onnistumisviesti ("Tiedot tallennettu tietokantaan").
- Raporttisivut: taulukoiden yläpuolelle "Hae"-hakukenttä ja suodattimet (aikaväli, osasto/tuote, operaattori), jotka suodattavat sekä kaaviota että taulukkoa.
- Lisää käyttöoikeus-/kirjautumisnäkymä tarvittaessa (tehtävänanto mainitsee "käyttäjäoikeuksien hallinta" tietoturvavaatimuksena) — kirjautumissivu + roolin mukaan näkyvät toiminnot (esim. operaattori näkee vain syötön, esimies näkee raportit).
- Tuota kokonainen klikattava prototyyppi, jossa navigaatio toimii sivujen välillä (Etusivu → Tietojensyöttö-alasivut → Raportit-alasivut ja takaisin).