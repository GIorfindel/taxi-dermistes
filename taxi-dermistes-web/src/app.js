'use strict'
let express = require('express')
let app = express()
let fs = require('fs')
let morgan = require('morgan')
let proxy = require('express-http-proxy')
let path = require('path')

let accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}))

app.use('/api', proxy('http://localhost:3000'))
app.use(express.static('resource'))
app.use('/resource', express.static('resource'))
app.use('/resource/js', express.static(path.join(__dirname, 'resource/js')))
app.use('/resource/css', express.static(path.join(__dirname, 'resource/css')))
app.use('/resource/img', express.static(path.join(__dirname, 'resource/img')))

//PORT DU SERVEUR
const port = 3001


/****************************************************/
/*				DEMARRAGE SERVEUR					*/
/****************************************************/
app.listen(port, () => {
    console.log('taxi-dermistes-web-server écoute sur le port %d', port)
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/resource/index.html'))
})

app.get('/admin/', (req, res) => {
    res.sendFile(path.join(__dirname, '/resource/admin/index.html'))
})

app.get('/admin/clients', (req, res) => {
    res.sendFile(path.join(__dirname, '/resource/admin/clients.html'))
})


