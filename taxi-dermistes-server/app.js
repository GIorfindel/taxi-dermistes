"use strict";
let express = require('express');
let app = express();
let logger = require('tracer').colorConsole();
let validator = require('validator');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('json spaces', 0)


//PORT DU SERVEUR
const port = 3000;


/****************************************************/
/*				DEMARRAGE SERVEUR					*/
/****************************************************/
app.listen(port, function() {
    logger.info('taxi-dermistes-server écoute sur le port %d', port);
});


/****************************************************/
/*					ESSAIS    						*/
/****************************************************/
app.get('/', function(req, res) {
    res.send("racine")
});

app.get('/~', function(req, res) {
    res.send("home")
});

app.get('/image', function(req, res) {
    res.sendFile("image.png", {
        root: "./files"
    })
});

app.get('/page', function(req, res) {
    res.sendFile("page.html", {
        root: "./files"
    })
});

app.post('/', function(req, res) {
    res.send("racine post")
});



/****************************************************/
/*				CRUD CLIENT							*/
/****************************************************/

/************** GET **************/
app.get('/clients/:client_id', function(req, res) {
    let listeUser
    fs.readFile('./clients.json', 'utf8', function(err, data) {
        if (err) throw err;
        listeUser = JSON.parse(data);
        //let listeUser = require('./clients.json');
        let exists = false;
        for (var index in listeUser.clients) {
            if (listeUser.clients[index].client_id == req.params["client_id"]) {
                res.status(200); // Envoi le code HTTP 200 : OK
                res.send(listeUser.clients[index]);
                exists = true;
            }
        }
        if (!exists) {
            res.status(404);
            res.send({
                "error": "Client inexistant"
            });
            logger.warn("Impossible d'afficher le client %d", req.params["client_id"]);
        }
    });
});

app.get('/clients', function(req, res) {
    let listeUser;
    fs.readFile('./clients.json', 'utf8', function(err, data) {
        if (err) throw err;
        listeUser = JSON.parse(data);
        //let listeUser = require('./clients.json');
        if (listeUser["clients"].length > 0) {
            res.status(200);
            res.send(listeUser.clients);
        } else {
            res.status(404);
            res.send({
                "error": "Aucun client trouvé"
            });
        }
        logger.trace("Nombre de clients : %d", listeUser.clients.length);
    });
});

/************** POST **************/
app.post('/clients', function(req, res) {
    let obj;
    fs.readFile('./clients.json', 'utf8', function(err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        //let obj = require('./clients.json');
        logger.trace(req.body.client_mail);
        if ((req.body.client_mail == null) || (validator.isEmail(req.body.client_mail) == false)) {
            res.status(400); //Bad Request
            res.send({
                "error": "Votre adresse mail n'est pas valide"
            });
        } else {
            req.body.client_id = obj.libre;
            obj.clients.push(req.body);
            obj.libre = obj.libre + 1;
            fs.writeFile('clients.json', '')
            fs.appendFile('clients.json', JSON.stringify(obj) + "\n", (err) => {
                if (err) {
                    logger.error(err);
                    res.status(500);
                    res.send({
                        "error": "Impossible de traiter la requête"
                    });
                } else {
                    logger.trace("Client ajouté avec l'id %d", (obj.libre - 1));
                    res.status(201); // 201 == Created
                    res.send({
                        "status": "success"
                    });
                }
            });
        }
    });
});

/************** DELETE **************/
app.delete('/clients', function(req, res) {
    let obj;
    fs.readFile('./clients.json', 'utf8', function(err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        //let obj = require('./clients.json');
        let exists = false;
        for (var index in obj.clients) {
            if (obj.clients[index].client_id == req.body["client_id"]) {
                exists = true;
                obj.clients.splice(index, 1);
            }
        }
        if (exists) {
            fs.writeFile('clients.json', '')
            fs.appendFile('clients.json', JSON.stringify(obj) + "\n", (err) => {
                if (err) {
                    logger.error(err);
                    res.status(500);
                    res.send({
                        "error": "Impossible de traiter la requête"
                    });
                } else {
                    logger.trace("Client %d supprimé", req.body["client_id"]);
                    res.status(200);
                    res.send({
                        "status": "success"
                    });
                }
            });
        } else {
            logger.warn("Impossible de supprimer le client %d", req.body["client_id"]);
            res.status(404);
            res.send({
                "error": "Client inexistant"
            });
        }
    });
});

/************** PUT **************/
app.put('/clients', function(req, res) {
    let obj;
    fs.readFile('./clients.json', 'utf8', function(err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        //let obj = require('./clients.json');
        if ((req.body.client_mail == null) || (validator.isEmail(req.body.client_mail) == false)) {
            res.status(400); //Bad Request
            res.send({
                "error": "Votre adresse mail n'est pas valide"
            });
        } else {
            let exists = false;
            for (var index in obj.clients) {
                if (obj.clients[index].client_id == req.body["client_id"]) {
                    exists = true;
                    obj.clients[index].client_name = req.body["client_name"];
                    obj.clients[index].client_mail = req.body["client_mail"];
                }
            }
            if (exists) {
                fs.writeFile('clients.json', '')
                fs.appendFile('clients.json', JSON.stringify(obj) + "\n", (err) => {
                    if (err) {
                        logger.error(err);
                        res.status(500);
                        res.send({
                            "error": "Impossible de traiter la requête"
                        });
                    } else {
                        logger.trace("Client %d modifié", req.body["client_id"]);
                        res.status(200);
                        res.send({
                            "status": "success"
                        });
                    }
                });
            } else {
                logger.warn("Impossible de modifier le client %d", req.body["client_id"]);
                res.status(404);
                res.send({
                    "error": "Client inexistant"
                });
            }
        }
    });
});
