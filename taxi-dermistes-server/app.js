var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send("racine")
});

app.get('/~', function(req, res){
        res.send("home")
});

app.post('/', function(req,res){
	res.send("racine post")
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

