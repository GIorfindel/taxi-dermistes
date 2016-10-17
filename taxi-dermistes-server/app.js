var express = require('express');
var app = express();
var logger = require('tracer').colorConsole();
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//PORT DU SERVEUR
const port = 3000;


/****************************************************/
/*				DEMARRAGE SERVEUR					*/
/****************************************************/
app.listen(port, function () {
  logger.info('taxi-dermistes-server écoute sur le port %d', port);
});


/****************************************************/
/*					ESSAIS    						*/
/****************************************************/
app.get('/', function(req, res){
	res.send("racine")
});

app.get('/~', function(req, res){
        res.send("home")
});

app.get('/image', function(req, res){
        res.sendFile("image.png",{ root: "./files" })
});

app.get('/page', function(req, res){
        res.sendFile("page.html",{ root: "./files" })
});

app.post('/', function(req,res){
	res.send("racine post")
});



/****************************************************/
/*				CRUD CLIENT							*/
/****************************************************/

/************** GET **************/
app.get('/clients/:client_id', function(req, res){
        var listeUser = require('./clients.json');
        var exists = false;
        for(index in listeUser.clients) {
                if(listeUser.clients[index].client_id==req.params["client_id"]){
                	res.status(200); // Envoi le code HTTP 200 : OK
					res.send(listeUser.clients[index]);
					exists=true;
                }
        }
		if(!exists) {
			res.status(404);
			res.send({"error":"Client inexistant"});
			logger.warn("Impossible d'afficher le client %d", req.params["client_id"]);
		}
});

app.get('/clients', function(req, res) {
	var listeUser = require('./clients.json');
	if(listeUser.clients.length > 0) {
		res.status(200);
		res.send(listeUser.clients);
	}
	else {
		res.status(404);
		res.send({"error":"Aucun client trouvé"});
	}
	logger.trace("Nombre de clients : %d",listeUser.clients.length);
});

/************** POST **************/
app.post('/clients', function(req, res){
	var obj = require('./clients.json');
	req.body.client_id=obj.libre;
	obj.clients.push(req.body);
	obj.libre=obj.libre+1;
	fs.writeFile('clients.json', '')
   	fs.appendFile('clients.json', JSON.stringify(obj)+"\n", (err) => {
  		if (err) {
  			logger.error(err);
  			res.status(500);
  			res.send({"error":"Impossible de traiter la requête"});
  		}
  		else {
	  		logger.trace("Client ajouté avec l'id %d", (obj.libre-1));
	  		res.status(201); // 201 == Created
			res.send({"status": "success"});
	  	}
	});
	
});

/************** DELETE **************/
app.delete('/clients', function(req, res){
        var obj = require('./clients.json');
        var exists = false;
        for(index in obj.clients) {
        	if(obj.clients[index].client_id==req.body["client_id"]){
        		exists = true;
             	obj.clients.splice(index,1);
            }
        }
        if(exists) {
		    fs.writeFile('clients.json', '')
		    fs.appendFile('clients.json', JSON.stringify(obj)+"\n", (err) => {
		    	if (err) {
		  			logger.error(err);
		  			res.status(500);
		  			res.send({"error":"Impossible de traiter la requête"});
		  		}
		  		else {
		    		logger.trace("Client %d supprimé", req.body["client_id"]);
		    		res.status(200);
					res.send({"status": "success"});
				}
		    });
		}
		else {
			logger.warn("Impossible de supprimer le client %d", req.body["client_id"]);
		  	res.status(404);
		  	res.send({"error":"Client inexistant"});
		}
});

/************** PUT **************/
app.put('/clients', function(req, res){
        var obj = require('./clients.json');
        var exists = false;
        for(index in obj.clients) {
        	if(obj.clients[index].client_id==req.body["client_id"]){
        		exists = true;
             	obj.clients[index].client_name=req.body["client_name"];
            }
        }
        if(exists) {
		    fs.writeFile('clients.json', '')
		    fs.appendFile('clients.json', JSON.stringify(obj)+"\n", (err) => {
		    	if (err) {
		  			logger.error(err);
		  			res.status(500);
		  			res.send({"error":"Impossible de traiter la requête"});
		  		}
		  		else {
		    		logger.trace("Client %d modifié", req.body["client_id"]);
		    		res.status(200);
					res.send({"status": "success"});
				}
		    });
		}
		else {
			logger.warn("Impossible de modifier le client %d", req.body["client_id"]);
		  	res.status(404);
		  	res.send({"error":"Client inexistant"});
		}
});



















