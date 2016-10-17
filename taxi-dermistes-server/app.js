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
        var exists = false;
        for(index in listeUser) {
                if(listeUser[index].client_id==req.params["client_id"]){
					res.send(listeUser[index]);
					exists=true;
                }
        }
		console.log(listeUser.length);
		if(!exists)
			res.send({"error":"404"});
});

app.post('/clients', function(req, res){
	var obj = require('./clients.json');
	req.body.client_id=obj.length;
	obj.push(req.body);
	fs.writeFile('clients.json', '', function(){console.log('done')})
   	fs.appendFile('clients.json', JSON.stringify(obj)+"\n", (err) => {
  	if (err) throw err;
  	console.log('It\'s saved!');
	});
	res.send("done");
});

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


app.get('/clients', function(req, res) {
	var listeUser = require('./clients.json');
	var output ="";
	for(index in listeUser){
		output+=("id: "+listeUser[index].client_id+", nom: "+listeUser[index].client_name)+"<br/>";
	}
	res.send(output);
	
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

