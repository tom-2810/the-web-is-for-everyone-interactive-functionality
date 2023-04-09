<!-- > _Fork_ deze leertaak en ga aan de slag. Onderstaande outline ga je gedurende deze taak in jouw eigen GitHub omgeving uitwerken. De instructie vind je in: [docs/INSTRUCTIONS.md](docs/INSTRUCTIONS.md) -->

# ⚙️ Toolgankelijk
Tool in checklist vorm om website toegankelijker te maken.

![image](https://user-images.githubusercontent.com/112861614/225776803-49c18e73-4257-42db-ad5a-83c4e93b9f2f.png)

<!--
## 📃 Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Gebruik](#gebruik)
  * [Licentie](#licentie)
  * [Bronnen](#bronnen)
 -->

## 🤔 Beschrijving
Samen met deze toegankelijkheids-tool maakt u eenvouding websites en apps toegankelijker via een checklist, geleidt door de WCAG principes en richtlijnen.
![Schermafbeelding 2023-04-06 093350](https://user-images.githubusercontent.com/112861614/230306904-0024800e-5524-4607-b6d8-fbe921c194ff.png)
Live link gehost via Cyclic: https://dull-cyan-seagull-hose.cyclic.app/

## 💻 Kenmerken
Het Toolboard is tot stand gekomen met ejs en Node.
Door middel van een nested forEach-loop worden alle richtlijnen per principe en de projecten (urls) uit de [Vervoerregio Amsterdam API](https://api.vervoerregio-amsterdam.fdnd.nl/api/v1/principles) gehaald.

```js
const url = 'https://api.vervoerregio-amsterdam.fdnd.nl/api/v1/principes'
```
Verder is navigatie mogelijk door middel van Express Routing.

Route in app.js
```js
app.get('/toolboard', function (request, response) {
  fetchJson(url).then((data) => {
  response.render('toolboard', {data: data, active: '/toolboard'})
  })
})
```

### Progressive Enhancement

Om te beginnen met de core functionaliteit van de website bepaal je de basis van een werkende website. Zo zorg je dat je website ook zonder JavaScript gewoon bruikbaar is, wat kan voorkomen op oudere apparaten. Vervolgens kan je door aanpassingen aan te brengen met JavaScript en CSS het gebruik voor de eindgebruiker verbeteren. Dit valt onder de werkwijze die Progressive Enhancement heet.
Om een project aan te kunnen maken kan de gebruiker een url samen met een gekoppelde partner versturen. Dit wilde ik met een dialog verwezenlijken. Maar een dialog is alleen werkende met JavaScript. Als dit niet beschikbaar zou zijn, heb ik dus een andere oplossing nodig. Zo heb ik de core functionaliteit eerst in beeld gebracht, namelijk het versturen. Dit is ook mogelijk met slechts een form element en verdere afhandeling aan de server-side. Als JavaScript wel aanwezig is, wordt dit vervangen met de dialog. Zo garandeer ik dat de gebruiker de website altijd iets kan versturen (mits er een internet verbinding is natuurlijk).

Zo is in ↓ deze afbeelding ↓ de "Content" het formulier, "Presentation" het container element, dus de DIALOG of enkel het FORM en als buitenste laag "client-side scripting" de detectie van JS.

![image](https://user-images.githubusercontent.com/112861614/230772476-86802f18-b7e1-43e0-ad31-44748d6f986a.png)


## ⬇️ Installatie
Fork het project en voer eerst `npm install` uit in de terminal om alle nodige packages en dependencies binnen te halen. Vervolgens maakt `npm start` een port vrij om de website te bekijken in de browser.

## 🙃 Gebruik
Werk met deze checklist de toegankelijkheidsrichtlijnen af per succescriteria om een website stap voor stap te beoordelen. Vervolgens kan je aan de hand van de onvoltooide richtlijnen verbeteringen aanbrengen aan de behandelde website.

<!-- ## Bronnen -->

## 👾 Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
