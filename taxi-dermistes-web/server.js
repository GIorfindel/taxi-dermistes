'use strict'
let express = require('express')
let app = express()

var proxy = require('express-http-proxy');

app.use('/api', proxy('http://localhost:3000'));
app.use(express.static('resources'));
app.use('/static', express.static('resources'));

//PORT DU SERVEUR
const port = 8080


/****************************************************/
/*				DEMARRAGE SERVEUR					*/
/****************************************************/
app.listen(port, () => {
    console.log('taxi-dermistes-web-server écoute sur le port %d', port)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/resources/index.html')
})
