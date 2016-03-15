var http = require("http");
var url = require("url");

function start(route, handle) {
	function onRequest(request, response) {

		var pathname = url.parse(request.url).pathname;
		var query = url.parse(request.url).query;
		console.log("Request for \"" + pathname + "\" received");
		if (query !== null) {
			console.log("Omg there's a query: " + query);
		}
			route(handle, pathname, response, request);
	}

	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

exports.start = start;
