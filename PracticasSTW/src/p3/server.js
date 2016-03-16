var http = require("http");
var url = require("url");
var mysql = require('mysql');

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


	var pool  = mysql.createPool({
  	connectionLimit : 100,
  	host            : 'localhost',
  	user            : 'server',
  	password        : 'superpassword'
	});

	var tableQuery = 'CREATE TABLE Memos' +
	'(' +
	'ID int UNIQUE AUTO_INCREMENT,' +
	'MemoName varchar(255) NOT NULL,' +
	'MemoDesc mediumtext NOT NULL,' +
	'MemoFile blob)';

	pool.query(tableQuery, function(err, rows, fields) {
  	if (err) throw err;

 		console.log("Hoorray");
	});
	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

exports.start = start;
