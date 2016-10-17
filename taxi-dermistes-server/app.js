var express = require('express');
var app = express();
var logger = require('tracer').colorConsole();
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const port = 3000;

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
/*				DEMARRAGE SERVEUR					*/
/****************************************************/
app.listen(port, function () {
  logger.info('taxi-dermistes-server écoute sur le port %d', port);
});

/****************************************************/
/*				CRUD CLIENT							*/
/****************************************************/

/************** GET **************/
app.get('/clients/:client_id', function(req, res){
        var listeUser = require('./clients.json');
        var exists = false;
        for(index in listeUser) {
                if(listeUser[index].client_id==req.params["client_id"]){
					res.send(listeUser[index]);
					exists=true;
                }
        }
		if(!exists) {
			res.send({"error":"404"});
			logger.warn("Requête de client inexistant");
		}
});

app.get('/clients', function(req, res) {
	var listeUser = require('./clients.json');
	if(listeUser.length > 0)
		res.send(listeUser);
	else
		res.send({"error":"Aucun client trouvé"});
	logger.trace("Nombre de clients : %d",listeUser.length);
});

/************** POST **************/
app.post('/clients', function(req, res){
	var obj = require('./clients.json');
	req.body.client_id=obj.length;
	obj.push(req.body);
	fs.writeFile('clients.json', '')
   	fs.appendFile('clients.json', JSON.stringify(obj)+"\n", (err) => {
  	if (err) throw err;
  	logger.trace("Client ajouté !");
	});
	res.send({"status": "success"});
});

/************** DELETE **************/
app.delete('/clients', function(req, res){
        var obj = require('./clients.json');
        for(index in obj) {
		console.log(obj[index].client_id);
		console.log(req.body["client_id"]);
        	if(obj[index].client_id==req.body["client_id"]){
                        obj.splice(index,1);
                }
        }
        fs.writeFile('clients.json', '', function(){console.log('done')})
        fs.appendFile('clients.json', JSON.stringify(obj)+"\n", (err) => {
        if (err) throw err;
        console.log('It\'s saved!');
        });
        res.send("done");
});

/************** PUT **************/


