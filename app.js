import express, { json, request, response } from 'express'

import { fetchJson, postJson } from './helpers/fetchWrapper.js'

// base API calls
const baseUrl = 'https://api.vervoerregio-amsterdam.fdnd.nl/api/v1'

const faviconAPI = 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url='

// base API urls with endpoint and/or query params
const allProjectsData = await fetchJson(`${baseUrl}/urls?first=150`).then((data) => data);
// const urlChecksData = await fetchJson(`${baseUrl}/url?id=clf7zms5va5670bw8rb7gwll2`).then((data) => data);
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

  // gets id value from url query param
  let { id } = request.query

  // if the url contains this query param
  if (id) {
    fetchJson(`${baseUrl}/url?id=${id}`).then((data) => {
      // check if this url has succescriteria by id
      if (data.url.checks.length != 0) {
        response.render('toolboard', { currentProject: data, checkedProjectSuccescriteria: data.url.checks[0].succescriteria, principesData: principesData, active: '/toolboard' })
      } else {
        response.render('toolboard', { currentProject: data, checkedProjectSuccescriteria: data.url.checks, principesData: principesData, active: '/toolboard' })
      }
    });
  } else {
    // url doesn't contain a id for it to open in toolboard
    response.redirect('/projects')
  }
})

// Route voor contact
app.get('/contact', function (request, response) {
  fetchJson(baseUrl).then((data) => {
    response.render('contact', { data: data, active: '/contact' })
  })
})

// Route voor projects
/**
 * @author Luuk Brauckmann
 */
app.get('/projects', function (request, response) {

  // defines different sorts as JSON objects within an Array
  const sortOptions = [
    { label: 'Recent', field: 'createdAt', direction: 'DESC' },
    { label: 'Partner A-Z', field: 'titel', direction: 'ASC' },
    { label: 'Partner Z-A', field: 'titel', direction: 'DESC' }
  ]

  // gets sort value from url query param
  let { sort } = request.query
  // parses the value so it can be accessed as JSON
  if (sort) sort = JSON.parse(sort)
  // url doesn't contain a sort option, chooses default sort option
  else sort = sortOptions[0]

  // clones allProjectsData.urls so .reverse() function won't affect the original
  let urls = [...allProjectsData.urls];
  // gets the underlaying website titel and maps it straight to url as titel
  urls = urls.map((url) => ({ ...url, titel: url.website.titel }))
  // sorts every url by given sort option field of cloned allProjectsData.urls
  urls = urls.sort((a, b) => a[sort.field].localeCompare(b[sort.field]))
  //checks for sorting direction, if direction is DESC, reverse cloned urls ones
  if (sort.direction === 'DESC') urls.reverse()

  response.render('projects', { faviconAPI, sortOptions, currentSort: sort, websitesData: websitesData.websites, allProjectsData: urls, active: '/projects' })
})

// send by user generated project
app.post('/projects', (request, response) => {
  postJson(`${baseUrl}/urls`, request.body).then((data) => {
    let newURL = { ...request.body }

    if (data.success) {
      response.redirect('/?urlPosted=true')
    } else {
      const errorMessage = data.message
      const newData = { error: errorMessage, values: newURL }

      // load projects page again, after posted
      response.redirect('/projects')
    }
  })
})

// Stel het poortnummer in en start express
app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})