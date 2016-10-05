var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send("racine")
});

app.get('/~', function(req, res){
        res.send("home")
});

app.get('/image', function(req, res){
        res.sendFile("/export/home/users/master/master2/m2pls2017/11200452/git/JSAU/taxi-dermistes-server/files/image.png")
});

app.get('/page', function(req, res){
        res.sendFile("/export/home/users/master/master2/m2pls2017/11200452/git/JSAU/taxi-dermistes-server/files/page.html")
});

app.post('/', function(req,res){
	res.send("racine post")
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

