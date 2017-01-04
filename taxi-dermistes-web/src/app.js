'use strict'
let express = require('express')
let app = express()
let fs = require('fs')
let morgan = require('morgan')
let proxy = require('express-http-proxy')
let path = require('path')
let logger = require('tracer').colorConsole()

let nunjucks = require('nunjucks')
let PATH_TO_TEMPLATES = path.join(__dirname, 'resource/')
nunjucks.configure(PATH_TO_TEMPLATES, {
    autoescape: true,
    express: app
})

let accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), {
    flags: 'a'
})
app.use(morgan('combined', {
    stream: accessLogStream
}))

app.use('/api', proxy('http://localhost:3000'))
app.use(express.static('resource'))
app.use('/resource', express.static('resource'))
app.use('/js', express.static(path.join(__dirname, 'resource/js')))
app.use('/css', express.static(path.join(__dirname, 'resource/css')))
app.use('/img', express.static(path.join(__dirname, 'resource/img')))
app.use('/fonts', express.static(path.join(__dirname, 'resource/fonts/'))) // Pour les glyphicon de bootstrap


//PORT DU SERVEUR
const port = 3001


/****************************************************/
/*				DEMARRAGE SERVEUR					*/
/****************************************************/
app.listen(port, () => {
    logger.info('taxi-dermistes-web-server écoute sur le port %d', port)
})


app.get('/', (req, res) => {
    return res.render('index.html')
})

app.get('/index.html', (req, res) => {
    return res.render('index.html')
})

app.get('/client.html/', (req, res) => {
    return res.render(path.join(__dirname, '/resource/client.html'))
})

app.get('/chauffeur.html/', (req, res) => {
    return res.render(path.join(__dirname, '/resource/chauffeur.html'))
})

app.get('/aide.html/', (req, res) => {
    return res.render(path.join(__dirname, '/resource/aide.html'))
})

app.get('/admin', (req, res) => {
    return res.render(path.join(__dirname, '/resource/admin/index.html'))
})

app.get('/admin/index.html', (req, res) => {
    return res.render(path.join(__dirname, '/resource/admin/index.html'))
})

app.get('/admin/clients.html', (req, res) => {
    return res.render(path.join(__dirname, '/resource/admin/clients.html'))
})

app.get('/admin/chauffeurs.html', (req, res) => {
    return res.render(path.join(__dirname, '/resource/admin/chauffeurs.html'))
})

app.get('/admin/courses.html', (req, res) => {
    return res.render(path.join(__dirname, '/resource/admin/courses.html'))
})
