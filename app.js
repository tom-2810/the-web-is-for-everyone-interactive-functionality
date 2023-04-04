import express, { json, request, response } from 'express'

import { fetchJson, postJson } from './helpers/fetchWrapper.js'

const baseUrl = 'https://api.vervoerregio-amsterdam.fdnd.nl/api/v1'


const allProjectsData = await fetchJson(`${baseUrl}/urls?first=100`).then((data) => data);
const urlChecksData = await fetchJson(`${baseUrl}/url?id=clf7zms5va5670bw8rb7gwll2`).then((data) => data);
const websitesData = await fetchJson(`${baseUrl}/websites`).then((data) => data);
// const checksData = await fetchJson(`${baseUrl}/checks`).then((data) => data);
const principesData = await fetchJson(`${baseUrl}/principes`).then((data) => data);

// console.log(checksData)

// Maak een nieuwe express app
const app = express()

// Stel in hoe we express gebruiken
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

// Stel afhandeling van formulieren in
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Maak een route voor de index
app.get('/', (request, response) => {
  fetchJson(baseUrl).then((data) => {
    response.render('index', { data: data, active: '/' })
  })
})

// Route voor het toolboard
app.get('/toolboard', function (request, response) {

  console.log("de checks van clf7zms5va5670bw8rb7gwll2: " + JSON.stringify(urlChecksData.url.checks[0].succescriteria));
    response.render('toolboard', { checkedProjectSuccescriteria: urlChecksData.url.checks[0].succescriteria, principesData: principesData, active: '/toolboard' })
})

// Route voor contact
app.get('/contact', function (request, response) {
  fetchJson(baseUrl).then((data) => {
    response.render('contact', { data: data, active: '/contact' })
  })
})

// Route voor projects
app.get('/projects', function (request, response) {

  // let urls = structuredClone(urlsData.urls);
  let urls = [ ...allProjectsData.urls ];

  let direction;
  
  if (request.query.sort == 'DESC') {
    urls = urls.sort(function (a, b) {
      return a.website.titel.localeCompare(b.website.titel);
    }).reverse();
  } else {
    urls = urls.sort(function (a, b) {
      return a.website.titel.localeCompare(b.website.titel);
    });
  }
  direction = request.query.sort;
  response.render('projects', { websitesData: websitesData.websites, allProjectsData: urls, active: '/projects', direction: direction })
})

app.post('/projects', (request, response) => {
  postJson(`${baseUrl}/urls`, request.body).then((data) => {
    let newURL = { ...request.body }

    if (data.success) {
      response.redirect('/?urlPosted=true')
    } else {
      const errorMessage = data.message
      const newData = { error: errorMessage, values: newURL }

      response.redirect('/projects')
    }
  })
})

// Stel het poortnummer in en start express
app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})