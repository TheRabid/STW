/**
 * Router.js
 * Este fichero contiene el enrutamiento de las peticiones get que recibe
 * el servidor. Con el pathname y las funciones de handle, es capaz de
 * llamar al requestHandler apropiado según la peticion que recibe
 */
function route(handle, pathname, response, request){
	console.log("About to route a request for " + pathname);
	if(typeof handle[pathname] === 'function'){
		handle[pathname](response, request);
	} else{
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {"Content-Type":"text/plain"});
		response.write("404 Not found");
		response.end();
	}
}

exports.route = route;
