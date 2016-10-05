var express = require('express');
var app = express();
const fs = require('fs');

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

app.get('/clients/:client_id', function(req, res){
        res.send(req.params)
});

app.post('/clients/:client_id', function(req, res){
        fs.appendFile('clients.json', JSON.stringify(req.params), (err) => {
  	if (err) throw err;
  	console.log('It\'s saved!');
	});
	res.send('done');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

