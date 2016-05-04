var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// Aceptar JSON y valores codificados en la url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Todos los endpoints del API van en este fichero
var routes = require("./routes/routes.js")(app);

app.get('/', function(req, res) {
      res.sendfile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/core.js', function(req, res) {
      res.sendfile('./core.js');
});


var server = app.listen(3000, function(){
  console.log("Listening on port %s...", server.address().port);
});
