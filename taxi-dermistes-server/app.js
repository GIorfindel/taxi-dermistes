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
        var listeUser = require('./clients.json');
        var output ="";
        for(index in listeUser) {
                if(listeUser[index].client_id==req.params["client_id"]){
                        output+=("id: "+listeUser[index].client_id+", nom: "+listeUser[index].client_name)+"<br/>";
                }
        }
        res.send(output);
});

app.post('/clients', function(req, res){	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	var obj = require('./clients.json');
	obj.push(req.body);
	fs.writeFile('clients.json', '', function(){console.log('done')})
   fs.appendFile('clients.json', JSON.stringify(obj)+"\n", (err) => {
  	if (err) throw err;
  	console.log('It\'s saved!');
	});
	res.send("done");
});

app.get('/clients', function(req, res) {
	var listeUser = require('./clients.json');
	var output ="";
	for(index in listeUser){
		output+=("id: "+listeUser[index].client_id+", nom: "+listeUser[index].client_name)+"<br/>";
	}
	res.send(output);
	
	
	obj.push({id: 1, square:2});
	var json = JSON.stringify(obj);
	console.log(json);
	
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

