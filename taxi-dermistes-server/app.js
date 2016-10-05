var express = require('express');
var app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
        fs.readFile('clients.json', 'utf8', function (err,data) {
  	if (err) {
    		return console.log(err);
  	}
  	res.send(data);
	});
});

app.post('/clients', function(req, res){	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
        fs.appendFile('clients.json', JSON.stringify(req.body)+"\n", (err) => {
  	if (err) throw err;
  	console.log('It\'s saved!');
	});
	console.log(req.body);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

