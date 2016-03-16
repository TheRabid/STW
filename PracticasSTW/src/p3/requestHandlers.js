/**
 * requestHandlers.js
 */
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function start(response, request) {
	console.log("Request handler 'start' was called.");

	var body= '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<h1>' +
	'=-=-= Memo System =-=-=' +
	'</h1>' +
	'<h2>' +
	'Choose an option' +
	'</h2>' +
	'<form action="/setMemo">' +
	'<input type="submit" value="Set Memo">' +
	'</form>' +
	'<form action="/deleteMemo">' +
	'<input type="submit" value="Delete Memo">' +
	'</form>' +
	'<form action="/showAllMemo">' +
	'<input type="submit" value="Show All Memo">' +
	'</form>' +
	'<form action="/upload" enctype="multipart/form-data" '+
	'method="post">'+
	'<input type="file" name="upload" multiple="multiple">'+
	'<input type="submit" value="Uploadfile" />'+
	'</form>'+
	'</body>'+
	'</html>';
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();

}

function upload(response, request) {
	console.log("Request handler 'upload' was called.");
	var form = new formidable.IncomingForm();
	console.log("-About to parse");
	form.parse(request, function(error, fields, files) {
		console.log("-Parsing done");
		/* Possible error on Windows systems:
		tried to rename to an already existing file */
		fs.rename(files.upload.path, "./tmp/test.png", function(error) {
			if(error) {
				fs.unlink("./tmp/test.png");
				fs.rename(files.upload.path, "./tmp/test.png");
			}
		});
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("received image:<br/>");
		response.write("<img src='/show' />");
		response.end(); });
}

function show(response, request) {
	console.log("Request handler 'show' was called.");
	response.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("./tmp/test.png").pipe(response);
}

function setMemo(response, request){
	console.log("Request handler 'setMemo' was called.")
	var body= '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" '+
	'content="text/html; charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<h1>' +
	'=-=-= Memo System =-=-=' +
	'</h1>' +
	'<h2>' +
	'New memo' +
	'</h2>' +
	'<form action="/setMemo">' +
	'Name of memo:<br>' +
	'<input type="text" name="name" required><br>' +
	'Description of memo:<br>' +
	'<textarea name="description" rows="20" cols="30" required></textarea><br>' +
	'Optional file:<br>'+
	'<input type="file" name="file" multiple="multiple"><br><br>'+
	'<input type="submit" value="Submit memo">' +
	'</form>' +
	'</body>'+
	'</html>';
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.setMemo = setMemo;
