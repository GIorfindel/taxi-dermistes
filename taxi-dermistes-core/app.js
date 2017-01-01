/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
'use strict'
let express = require('express')
let app = express()
let logger = require('tracer').colorConsole()
let validator = require('validator')
let P = require('bluebird')
let async = require('async');
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
let readFile = P.promisify(require('fs').readFile)
app.get('/clients/:client_id', (req, res) => {
    let listeUser
    readFile('./clients.json', 'utf8').then((data) => {
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
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.get('/clients', (req, res) => {
    let listeUser
    readFile('./clients.json', 'utf8').then((data) => {
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
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.get('/chauffeurs/:chauffeur_id', (req, res) => {
    let listeChauffeur
    readFile('./chauffeur.json', 'utf8').then((data) => {
        listeChauffeur = JSON.parse(data)
            //let listeUser = require('./clients.json');
        let exists = false
        for (let index in listeChauffeur.chauffeurs) {
            if (listeChauffeur.chauffeurs[index].chauffeur_id == req.params['chauffeur_id']) {
                res.status(200) // Envoi le code HTTP 200 : OK
                res.json(listeChauffeur.chauffeurs[index])
                exists = true
            }
        }
        if (!exists) {
            res.status(404)
            res.json({
                error: 'notFound',
                message: 'Chauffeur inexistant'
            })
            logger.warn("Impossible d'afficher le chauffeur %d", req.params['chauffeur_id'])
        }
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.get('/chauffeurs', (req, res) => {
    let listeChauffeur
    readFile('./chauffeur.json', 'utf8').then((data) => {
        listeChauffeur = JSON.parse(data)
            //let listeUser = require('./clients.json');
        if (listeChauffeur['chauffeurs'].length > 0) {
            res.status(200)
            res.send(listeChauffeur.chauffeurs)
        } else {
            res.status(404)
            res.send({
                error: 'notFound',
                message: 'Aucun chauffeur trouvé'
            })
        }
        logger.trace('Nombre de chauffeurs : %d', listeChauffeur.chauffeurs.length)
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})


app.get('/chauffeurs/:chauffeur_id/courses', (req, res) => {
  let listeCourses
  let listeCoursesChauffeur = []
  readFile('./courses.json', 'utf8').then((data) => {
      listeCourses = JSON.parse(data)
          //let listeUser = require('./clients.json');
      let exists = false
      for (let index in listeCourses.courses) {
          logger.info(index)
          if (listeCourses.courses[index].chauffeur_id == req.params['chauffeur_id']) {
              listeCoursesChauffeur.push(listeCourses.courses[index])
              logger.info(listeCoursesChauffeur)
              exists = true
          }
      }
      if (!exists) {
          res.status(404)
          res.json({
              error: 'notFound',
              message: 'Aucune course trouvée'
          })
          logger.warn("Aucune course trouvée pour le chauffeur  %d", req.params['chauffeur_id'])
      }
      else {
        res.status(200) // Envoi le code HTTP 200 : OK
        res.json(listeCoursesChauffeur)
      }
  }).catch((e) => {
      logger.warn('Erreur : %s', e)
  })
})


app.get('/courses/:course_id', (req, res) => {
    let listeCourses
    readFile('./courses.json', 'utf8').then((data) => {
        listeCourses = JSON.parse(data)
            //let listeUser = require('./clients.json');
        let exists = false
        for (let index in listeCourses.courses) {
            if (listeCourses.courses[index].course_id == req.params['course_id']) {
                res.status(200) // Envoi le code HTTP 200 : OK
                res.json(listeCourses.courses[index])
                exists = true
            }
        }
        if (!exists) {
            res.status(404)
            res.json({
                error: 'notFound',
                message: 'Course inexistante'
            })
            logger.warn("Impossible d'afficher la course %d", req.params['course_id'])
        }
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.get('/courses', (req, res) => {
    let listeCourses
    readFile('./courses.json', 'utf8').then((data) => {
        listeCourses = JSON.parse(data)
            //let listeUser = require('./clients.json');
        if (listeCourses['courses'].length > 0) {
            res.status(200)
            res.send(listeCourses.courses)
        } else {
            res.status(404)
            res.send({
                error: 'notFound',
                message: 'Aucune course trouvée'
            })
        }
        logger.trace('Nombre de courses : %d', listeCourses.courses.length)
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

/************** POST **************/
app.post('/clients', (req, res) => {
    let obj
    readFile('./clients.json', 'utf8').then((data) => {
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
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.post('/chauffeurs', (req, res) => {
    let obj
    readFile('./chauffeur.json', 'utf8').then((data) => {
        obj = JSON.parse(data)
            //let obj = require('./clients.json');
        logger.trace(req.body.chauffeur_mail)
        if ((req.body.chauffeur_mail == null) || (req.body.chauffeur_name == null) || validator.isEmpty(req.body.chauffeur_mail) || validator.isEmpty(req.body.chauffeur_name)) {
            res.status(400) //Bad Request
            res.send({
                error: 'invalidRequest',
                message: 'Requête invalide'
            })
        } else {
            if (validator.isEmail(req.body.chauffeur_mail) == false) {
                res.status(400) //Bad Request
                res.send({
                    error: 'invalidEmail',
                    message: "L'adresse mail est invalide"
                })
            } else {
                req.body.chauffeur_id = obj.libre
                obj.chauffeurs.push(req.body)
                obj.libre = obj.libre + 1
                fs.writeFile('chauffeur.json', '')
                fs.appendFile('chauffeur.json', JSON.stringify(obj) + '\n', (err) => {
                    if (err) {
                        logger.error(err)
                        res.status(500)
                        res.send({
                            error: 'internalError',
                            message: 'Impossible de traiter la requête'
                        })
                    } else {
                        logger.trace("Chauffeur ajouté avec l'id %d", (req.body.chauffeur_id))
                        res.status(201) // 201 == Created
                        res.location('/chauffeurs/' + req.body.chauffeur_id) // Je vois pas l'intérêt mais c'est dans la spécification REST
                        res.send({
                            status: 'success',
                            id: req.body.chauffeur_id
                        })
                    }
                })
            }
        }
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.post('/courses', (req, res) => {
    let obj
    let clients
    var files = ['./clients.json', './courses.json']
    let exists = false
    async.map(files, fs.readFile, function (err, data){
        clients = JSON.parse(data[0])
        obj = JSON.parse(data[1])
            //let obj = require('./clients.json');
        logger.trace(req.body.client_id)
        logger.trace(req.body.course_date)
        logger.trace(new Date(req.body.course_date))

        for (let index in clients.clients) {
            if (clients.clients[index].client_id == req.body['client_id']) {
                exists = true
            }
        }
        if(exists)
          {
            if ((req.body.course_date == null) || validator.isEmpty(req.body.course_date) || !validator.isDate(new Date(req.body.course_date).toString()) || !validator.isAfter(new Date(req.body.course_date).toString())) {
              res.status(400) //Bad Request
              res.send({
                  error: 'invalidRequest',
                  message: 'Date invalide'
                })
              }
              else if ((req.body.client_id == null) || (req.body.course_depart == null) || (req.body.course_arrivee == null) || validator.isEmpty(req.body.client_id) || validator.isEmpty(req.body.course_depart) || validator.isEmpty(req.body.course_arrivee)) {
                res.status(400) //Bad Request
                res.send({
                  error: 'invalidRequest',
                  message: 'Requête invalide'
                })
              } else {
                  req.body.course_id = obj.libre
                  obj.courses.push(req.body)
                  obj.libre = obj.libre + 1
                  fs.writeFile('courses.json', '')
                  fs.appendFile('courses.json', JSON.stringify(obj) + '\n', (err) => {
                      if (err) {
                          logger.error(err)
                          res.status(500)
                          res.send({
                              error: 'internalError',
                              message: 'Impossible de traiter la requête'
                            })
                          } else {
                            logger.trace("Course ajouté avec l'id %d", (req.body.course_id))
                            res.status(201) // 201 == Created
                            res.location('/courses/' + req.body.course_id) // Je vois pas l'intérêt mais c'est dans la spécification REST
                            res.send({
                              status: 'success',
                              id: req.body.course_id
                            })
                          }
                        })
                      }
                    }
                    else {
                      logger.warn('Impossible de créer la course pour le client %d', req.body['client_id'])
                      res.status(404)
                      res.send({
                        error: 'notFound',
                        message: 'Client inexistant'
                      })
                    }
    })
})


/************** DELETE **************/
app.delete('/clients', (req, res) => {
    let obj
    readFile('./clients.json', 'utf8').then((data) => {
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
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.delete('/chauffeurs', (req, res) => {
    let obj
    readFile('./chauffeur.json', 'utf8').then((data) => {
        obj = JSON.parse(data)
            //let obj = require('./clients.json');
        let exists = false
        for (let index in obj.chauffeurs) {
            if (obj.chauffeurs[index].chauffeur_id == req.body['chauffeur_id']) {
                exists = true
                obj.chauffeurs.splice(index, 1)
            }
        }
        if (exists) {
            fs.writeFile('chauffeur.json', '')
            fs.appendFile('chauffeur.json', JSON.stringify(obj) + '\n', (err) => {
                if (err) {
                    logger.error(err)
                    res.status(500)
                    res.send({
                        error: 'internalError',
                        message: 'Impossible de traiter la requête'
                    })
                } else {
                    logger.trace('Chauffeur %d supprimé', req.body['chauffeur_id'])
                    res.status(200)
                    res.send({
                        status: 'success'
                    })
                }
            })
        } else {
            logger.warn('Impossible de supprimer le chauffeur %d', req.body['chauffeur_id'])
            res.status(404)
            res.send({
                error: 'notFound',
                message: 'Chauffeur inexistant'
            })
        }
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.delete('/courses', (req, res) => {
    let obj
    readFile('./courses.json', 'utf8').then((data) => {
        obj = JSON.parse(data)
            //let obj = require('./clients.json');
        let exists = false
        for (let index in obj.courses) {
            if (obj.courses[index].course_id == req.body['course_id']) {
                exists = true
                obj.courses.splice(index, 1)
            }
        }
        if (exists) {
            fs.writeFile('courses.json', '')
            fs.appendFile('courses.json', JSON.stringify(obj) + '\n', (err) => {
                if (err) {
                    logger.error(err)
                    res.status(500)
                    res.send({
                        error: 'internalError',
                        message: 'Impossible de traiter la requête'
                    })
                } else {
                    logger.trace('Course %d supprimé', req.body['course_id'])
                    res.status(200)
                    res.send({
                        status: 'success'
                    })
                }
            })
        } else {
            logger.warn('Impossible de supprimer la course %d', req.body['course_id'])
            res.status(404)
            res.send({
                error: 'notFound',
                message: 'Course inexistante'
            })
        }
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

/************** PUT **************/
app.put('/clients', (req, res) => {
    let obj
    readFile('./clients.json', 'utf8').then((data) => {
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
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.put('/chauffeurs', (req, res) => {
    let obj
    readFile('./chauffeur.json', 'utf8').then((data) => {
        obj = JSON.parse(data)
            //let obj = require('./clients.json');
        if (!validator.isEmpty(req.body.chauffeur_mail) && (validator.isEmail(req.body.chauffeur_mail) == false)) {
            res.status(400) //Bad Request
            res.send({
                error: 'invalidEmail',
                message: "Votre adresse mail n'est pas valide"
            })
        } else {
            let exists = false
            for (let index in obj.chauffeurs) {
                if (obj.chauffeurs[index].chauffeur_id == req.body['chauffeur_id']) {
                    exists = true
                    if (!validator.isEmpty(req.body.chauffeur_name)) {
                        obj.chauffeurs[index].chauffeur_name = req.body['chauffeur_name']
                    }
                    if (!validator.isEmpty(req.body.chauffeur_mail)) {
                        obj.chauffeurs[index].chauffeur_mail = req.body['chauffeur_mail']
                    }
                }
            }
            if (exists) {
                fs.writeFile('chauffeur.json', '')
                fs.appendFile('chauffeur.json', JSON.stringify(obj) + '\n', (err) => {
                    if (err) {
                        logger.error(err)
                        res.status(500)
                        res.send({
                            error: 'internalError',
                            message: 'Impossible de traiter la requête'
                        })
                    } else {
                        logger.trace('Chauffeur %d modifié', req.body['chauffeur_id'])
                        res.status(200)
                        res.send({
                            status: 'success'
                        })
                    }
                })
            } else {
                logger.warn('Impossible de modifier le chauffeur %d', req.body['chauffeur_id'])
                res.status(404)
                res.send({
                    error: 'notFound',
                    message: 'Chauffeur inexistant'
                })
            }
        }
    }).catch((e) => {
        logger.warn('Erreur : %s', e)
    })
})

app.put('/courses', (req, res) => {
    let obj
    let chauffeurs
    var files = ['./chauffeur.json', './courses.json']
    async.map(files, fs.readFile, function (err, data){
        chauffeurs = JSON.parse(data[0])
        obj = JSON.parse(data[1])
            //let obj = require('./clients.json');
        let exists = false
        let existsC = false
        for (let index in obj.courses) {
          if (obj.courses[index].course_id == req.body['course_id']) {
            exists = true
            if (!validator.isEmpty(req.body.client_id)) {
              obj.courses[index].client_id = req.body['client_id']
            }
            if (!validator.isEmpty(req.body.course_date)) {
              obj.courses[index].course_date = req.body['course_date']
            }
            if (!validator.isEmpty(req.body.course_depart)) {
              obj.courses[index].course_depart = req.body['course_depart']
            }
            if (!validator.isEmpty(req.body.course_arrivee)) {
              obj.courses[index].course_arrivee = req.body['course_arrivee']
            }
            if (!validator.isEmpty(req.body.chauffeur_id)) {
              obj.courses[index].chauffeur_id = req.body['chauffeur_id']
            }
          }
        }
        for (let index in chauffeurs.chauffeurs) {
            if (chauffeurs.chauffeurs[index].chauffeur_id == req.body['chauffeur_id']) {
                existsC = true
            }
        }
        if (exists && existsC) {
          fs.writeFile('courses.json', '')
          fs.appendFile('courses.json', JSON.stringify(obj) + '\n', (err) => {
          if (err) {
            logger.error(err)
            res.status(500)
            res.send({
              error: 'internalError',
              message: 'Impossible de traiter la requête'
            })
          } else {
              logger.trace('Course %d modifiée', req.body['course_id'])
              res.status(200)
              res.send({
                status: 'success'
              })
            }
          })
        } else {
            logger.warn('Impossible de modifier la course %d', req.body['course_id'])
            res.status(404)
            res.send({
              error: 'notFound',
              message: 'Course inexistante'
            })
          }
    })
})
