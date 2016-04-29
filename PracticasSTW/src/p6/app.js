var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// Aceptar JSON y valores codificados en la url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Todos los endpoints del API van en este fichero
var routes = require("./routes/routes.js")(app);

var server = app.listen(3000, function(){
  console.log("Listening on port %s...", server.address().port);
});
