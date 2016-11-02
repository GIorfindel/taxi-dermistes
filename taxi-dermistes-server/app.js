/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
'use strict'
let express = require('express')
let app = express()
let logger = require('tracer').colorConsole()
let validator = require('validator')
const fs = require('fs')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.set('json spaces', 0)


//PORT DU SERVEUR
const port = 3000


/****************************************************/
/*				DEMARRAGE SERVEUR					*/
/****************************************************/
app.listen(port, () => {
    logger.info('taxi-dermistes-server écoute sur le port %d', port)
})


/****************************************************/
/*					ESSAIS    						*/
/****************************************************/
app.get('/', (req, res) => {
    res.send('racine')
})

app.get('/~', (req, res) => {
    res.send('home')
})

app.get('/image', (req, res) => {
    res.sendFile('image.png', {
        root: './files'
    })
})

app.get('/page', (req, res) => {
    res.sendFile('page.html', {
        root: './files'
    })
})

app.post('/', (req, res) => {
    res.send('racine post')
})


/****************************************************/
/*				CRUD CLIENT							*/
/****************************************************/

/************** GET **************/
app.get('/clients/:client_id', (req, res) => {
    let listeUser
    fs.readFile('./clients.json', 'utf8', (err, data) => {
        if (err) {
            throw err
        }
        listeUser = JSON.parse(data)
            //let listeUser = require('./clients.json');
        let exists = false
        for (let index in listeUser.clients) {
            if (listeUser.clients[index].client_id == req.params['client_id']) {
                res.status(200) // Envoi le code HTTP 200 : OK
                res.json(listeUser.clients[index])
                exists = true
            }
        }
        if (!exists) {
            res.status(404)
            res.json({
                error: 'notFound',
                message: 'Client inexistant'
            })
            logger.warn("Impossible d'afficher le client %d", req.params['client_id'])
        }
    })
})

app.get('/clients', (req, res) => {
    let listeUser
    fs.readFile('./clients.json', 'utf8', (err, data) => {
        if (err) {
            throw err
        }
        listeUser = JSON.parse(data)
            //let listeUser = require('./clients.json');
        if (listeUser['clients'].length > 0) {
            res.status(200)
            res.send(listeUser.clients)
        } else {
            res.status(404)
            res.send({
                error: 'notFound',
                message: 'Aucun client trouvé'
            })
        }
        logger.trace('Nombre de clients : %d', listeUser.clients.length)
    })
})

/************** POST **************/
app.post('/clients', (req, res) => {
    let obj
    fs.readFile('./clients.json', 'utf8', (err, data) => {
        if (err) {
            throw err
        }
        obj = JSON.parse(data)
            //let obj = require('./clients.json');
        logger.trace(req.body.client_mail)
        if ((req.body.client_mail == null) || (req.body.client_name == null) || validator.isEmpty(req.body.client_mail) || validator.isEmpty(req.body.client_name)) {
            res.status(400) //Bad Request
            res.send({
                error: 'invalidRequest',
                message: 'Requête invalide'
            })
        } else {
            if (validator.isEmail(req.body.client_mail) == false) {
                res.status(400) //Bad Request
                res.send({
                    error: 'invalidEmail',
                    message: "L'adresse mail est invalide"
                })
            } else {
                req.body.client_id = obj.libre
                obj.clients.push(req.body)
                obj.libre = obj.libre + 1
                fs.writeFile('clients.json', '')
                fs.appendFile('clients.json', JSON.stringify(obj) + '\n', (err) => {
                    if (err) {
                        logger.error(err)
                        res.status(500)
                        res.send({
                            error: 'internalError',
                            message: 'Impossible de traiter la requête'
                        })
                    } else {
                        logger.trace("Client ajouté avec l'id %d", (req.body.client_id))
                        res.status(201) // 201 == Created
                        res.location('/clients/' + req.body.client_id) // Je vois pas l'intérêt mais c'est dans la spécification REST
                        res.send({
                            status: 'success',
                            id: req.body.client_id
                        })
                    }
                })
            }
        }
    })
})

/************** DELETE **************/
app.delete('/clients', (req, res) => {
    let obj
    fs.readFile('./clients.json', 'utf8', (err, data) => {
        if (err) {
            throw err
        }
        obj = JSON.parse(data)
            //let obj = require('./clients.json');
        let exists = false
        for (let index in obj.clients) {
            if (obj.clients[index].client_id == req.body['client_id']) {
                exists = true
                obj.clients.splice(index, 1)
            }
        }
        if (exists) {
            fs.writeFile('clients.json', '')
            fs.appendFile('clients.json', JSON.stringify(obj) + '\n', (err) => {
                if (err) {
                    logger.error(err)
                    res.status(500)
                    res.send({
                        error: 'internalError',
                        message: 'Impossible de traiter la requête'
                    })
                } else {
                    logger.trace('Client %d supprimé', req.body['client_id'])
                    res.status(200)
                    res.send({
                        status: 'success'
                    })
                }
            })
        } else {
            logger.warn('Impossible de supprimer le client %d', req.body['client_id'])
            res.status(404)
            res.send({
                error: 'notFound',
                message: 'Client inexistant'
            })
        }
    })
})

/************** PUT **************/
app.put('/clients', (req, res) => {
    let obj
    fs.readFile('./clients.json', 'utf8', (err, data) => {
        if (err) {
            throw err
        }
        obj = JSON.parse(data)
            //let obj = require('./clients.json');
        if (!validator.isEmpty(req.body.client_mail) && (validator.isEmail(req.body.client_mail) == false)) {
            res.status(400) //Bad Request
            res.send({
                error: 'invalidEmail',
                message: "Votre adresse mail n'est pas valide"
            })
        } else {
            let exists = false
            for (let index in obj.clients) {
                if (obj.clients[index].client_id == req.body['client_id']) {
                    exists = true
                    if (!validator.isEmpty(req.body.client_name)) {
                        obj.clients[index].client_name = req.body['client_name']
                    }
                    if (!validator.isEmpty(req.body.client_mail)) {
                        obj.clients[index].client_mail = req.body['client_mail']
                    }
                }
            }
            if (exists) {
                fs.writeFile('clients.json', '')
                fs.appendFile('clients.json', JSON.stringify(obj) + '\n', (err) => {
                    if (err) {
                        logger.error(err)
                        res.status(500)
                        res.send({
                            error: 'internalError',
                            message: 'Impossible de traiter la requête'
                        })
                    } else {
                        logger.trace('Client %d modifié', req.body['client_id'])
                        res.status(200)
                        res.send({
                            status: 'success'
                        })
                    }
                })
            } else {
                logger.warn('Impossible de modifier le client %d', req.body['client_id'])
                res.status(404)
                res.send({
                    error: 'notFound',
                    message: 'Client inexistant'
                })
            }
        }
    })
})
