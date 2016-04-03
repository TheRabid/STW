// Lectura síncrona
var fs = require("fs");
console.log("\n *Comienzo lectura* \n");
var content = fs.readFileSync("ejemplo.json");
console.log("Contenido: \n"+content);
console.log("* Fin lectura *");

var obj = {'key' : 'value'};
console.log(
  /* define stringify */
  JSON.stringify(obj)
);

//obj contiene la información del json
var string = '{"key" : "value"}';
var obj = JSON.parse(string);
console.log(obj.key);

// Carga en obj el json
var obj = require("./ejemplo.json");

var exjson = {'key' : 'value'};
//define key value
exjson.key2 = '...abc...';
exjson.key3 = 'ops';
//define another key value
//exjson[key3] = '...xyz...';

var otherjson = {'key':'...abc...', 'key2':'...xyz...'};
for(var exKey in otherjson){
  console.log("key:"+exKey+", value:"+exjson[exKey]);
}
