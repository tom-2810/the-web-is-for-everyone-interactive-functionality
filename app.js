import express, { json, request, response } from 'express'

import { fetchJson, postJson } from './helpers/fetchWrapper.js'

const url = 'https://api.vervoerregio-amsterdam.fdnd.nl/api/v1'


const urlsData = await fetchJson(`${url}/urls?first=100`).then((data) => data);
const websitesData = await fetchJson(`${url}/websites`).then((data) => data);

console.log(websitesData)

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
  fetchJson(url).then((data) => {
    response.render('index', { data: data, active: '/' })
  })
})

// Route voor het toolboard
app.get('/toolboard', function (request, response) {
  fetchJson(`${url}/principes`).then((data) => {
    response.render('toolboard', { data: data, active: '/toolboard' })
  })
})

// Route voor het toolboard
app.get('/contact', function (request, response) {
  fetchJson(url).then((data) => {
    response.render('contact', { data: data, active: '/contact' })
  })
})

// Route voor projects
app.get('/projects', function (request, response) {

  // let urls = structuredClone(urlsData.urls);
  let urls = [ ...urlsData.urls ];

  let direction;
  
  if (request.query.sort == 'DESC') {
    urls = urls.sort(function (a, b) {
      return a.website.titel.localeCompare(b.website.titel);
    }).reverse();
    console.log(urls)
  } else {
    urls = urls.sort(function (a, b) {
      return a.website.titel.localeCompare(b.website.titel);
    });
  }
  direction = request.query.sort;
  response.render('projects', { websitesData: websitesData.websites, urlsData: urls, active: '/projects', direction: direction })
})

app.post('/projects', (request, response) => {
  console.log(request.body)
  postJson(`${url}/urls`, request.body).then((data) => {
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