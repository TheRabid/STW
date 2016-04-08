var http = require("http");
var url = require("url");

/**
 * Server.js
 * Este fichero contiene el funcionamiento principal del servidor.
 * Atiende las peticiones y llama a la funcion de enrutamiento
 */

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for \"" + pathname + "\" received");
		route(handle, pathname, response, request);
	}

	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

exports.start = start;
