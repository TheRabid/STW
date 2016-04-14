var querystring = require("querystring");
var url = require("url");
var fs = require("fs");
var formidable = require("formidable");
var database = require("./database");
var utils = require("./utils");

/**
 * RequestHandlers.js
 * Este fichero contiene todas las funciones de handling que son llamadas
 * por el fichero router.js para cada uno de los endpoints del servidor
 */

/**
 * Funcion start. Se encarga de gestionar el endpoint '/' y el endpoint '/start'
 * Muestra el html de inicio por pantalla
 */
function start(response, request) {
	console.log("Request handler 'start' was called.");
	var body = utils.generateResponse("start");
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

/**
 * Funcion setMemo. Se encarga de gestionar el endpoint '/setMemo'
 * Muestra el html de crear una nueva memo por pantalla
 */

function setMemo(response, request){
	console.log("Request handler 'setMemo' was called.");
	var body = utils.generateResponse("setMemo");
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

/**
 * Funcion submitMemo. Se encarga de gestionar el endpoint '/submitMemo'
 * Procesa la informacion del formulario recogida por setMemo y muestra por
 * pantalla si la memo fue insertada en la base de datos o si hubo algun error
 */

function submitMemo(response, request){
	console.log("Request handler 'submitMemo' was called.");

	// Procesamiento del formulario
	var form = new formidable.IncomingForm();
	console.log("-About to parse");
	form.parse(request, function(error, fields, files) {
		// Si no hay errores
		if(!error){
			var memoName = fields.memoName;
			var memoDesc = fields.memoDesc;
			var memoDate = fields.memoDate;
			var memoFile = files.memoFile;
			console.log("-Parsing done");
			console.log("-About to insert a new memo with this data: '" + memoName
										+ "', '" + memoDesc + "', '" + memoDate + "'");
			// Caso de que haya un fichero
			if(memoFile.size > 0){
				console.log("-Insertion with a file")
				var name = memoFile.name;
				var tmpPath = memoFile.path;
				var fileSize = memoFile.size;

				fs.open(tmpPath, 'r', function(status, fd){
					// Si hay algun error al abrirlo, informar
					if(status){
						var body = utils.generateResponse("insertMemo") +
						utils.generateResponse("insertMemoFailed");
						response.writeHead(200, {
							"Content-Type" : "text/html"
						});
						response.write(body);
						response.end();
					} else{
						console.log("-Fichero abierto");

						// Buffer para almacenar el fichero al leerlo con read
						var buffer = new Buffer(fileSize);
						fs.read(fd, buffer, 0, fileSize, 0, function(error, num){
							// Si hay algun error al leerlo informar
							if(error){
								var body = utils.generateResponse("insertMemo") +
								utils.generateResponse("insertMemoFailed");
								response.writeHead(200, {
									"Content-Type" : "text/html"
								});
								response.write(body);
								response.end();
							} else{

								// Si todo fue bien, almacenar la memo con el fichero en la bd
								var blob = buffer.toString('hex');
								database.insertMemoComplete(memoName, memoDesc, memoDate, blob,
									name, function(err){
									var body = utils.generateResponse("insertMemo");
									if(err === ""){
										body = body + '<h2>New memo created</h2>' +
										'<h3>Name:<br></h3>' + memoName + '<br>' +
										'<h3>Description:<br></h3>' +	memoDesc + '<br>' +
										'<h3>Date:<br></h3>' + memoDate + '<br>' +
										utils.generateResponse("buttonAndEnd");
									}
									// Si hubo error al insertar en la bd, informar al usuario
									else{
										body = body + utils.generateResponse("insertMemoFailed");
									}
									response.writeHead(200, {
										"Content-Type" : "text/html"
									});
									response.write(body);
									response.end();
								}); // Fin acceso a la bd
							} // Fin if error al leer el fichero
						}); // Fin read fichero
					} // Fin if error al abrir el fichero
				}); // Fin open fichero
			}
			// Caso de que no haya un fichero
			else{
				// Llamada a la base de datos
				database.insertMemo(memoName,memoDesc,memoDate, function(err){
					var body = utils.generateResponse("insertMemo");
					if(err === ""){
						body = body + '<h2>New memo created</h2>' +
						'<h3>Name:<br></h3>' + memoName + '<br>' +
						'<h3>Description:<br></h3>' +	memoDesc + '<br>' +
						'<h3>Date:<br></h3>' + memoDate + '<br>' +
						utils.generateResponse("buttonAndEnd");
					}
					// Si hubo algun error al insertar en la bd informar al usuario
					else{
						body = body + utils.generateResponse("insertMemoFailed");
					}
					response.writeHead(200, {
						"Content-Type" : "text/html"
					});
					response.write(body);
					response.end();
				}); // Fin database insert
			} // Fin if memoFile.size > 0
		}
		// Si hubo error al parsear el formulario, informar al usuario
		else{
			var body = utils.generateResponse("insertMemo") +
			utils.generateResponse("insertMemoFailed");
			response.writeHead(200, {
				"Content-Type" : "text/html"
			});
			response.write(body);
			response.end();
		} // Fin if error al parsear el formulario
	}); // Fin del parseo del formulario
}

/**
 * Funcion showAllMemo. Se encarga de gestionar el endpoint '/showAllMemo'
 * Muestra por pantalla todas las memos de la base de datos y proporciona
 * enlaces a los endpoints '/showMemo' para cada una de las memos de la lista
 */

function showAllMemo(response, request){
	console.log("Request handler 'showAllMemo' was called.");

	// Llamada a la base de datos para obtener las memos
	database.getAllMemo(function(err,rows){
		// Si hay algun error al leerlo informar
		if(err){
			var body = utils.generateResponse("showAllMemoFailed");
			response.writeHead(200, {
				"Content-Type" : "text/html"
			});
			response.write(body);
			response.end();
		} else{
			// Generar la respuesta en base a la info de la bd
			var body = utils.generateResponse("showAllMemo") +
			'<table style="width:100%">' +
			'<tr> <th>Name</th> <th>Description</th> ' +
			'<th>Date</th> <th>File</th>  </tr>';
			for(i = 0; i<rows.length; i++){
				memoId = rows[i].idMemo;
				memoName = rows[i].MemoName;
				memoDesc = rows[i].MemoDesc;
				memoDate = rows[i].NiceDate;
				memoFileName = rows[i].MemoFileName;
				var download = "";
				if(memoFileName === null){
					memoFileName = "No file attached";
				} else{
					download = '<form action="/getFile">' +
					'<button name="id" value="' + memoId + '">Download file</button>' +
					'</form>';
				}
				body = body + '<tr> <th>' +
				'<form action="/showMemo">' + memoName + '<br>' +
				'<button name="id" value="' + memoId + '">Show this memo</button>' +
				'</form></th> <th>' + memoDesc + '</th> ' +
				'<th>' + memoDate + '</th> <th>' + memoFileName + download + '</th>  </tr>';
			}
			body = body + '</table>' + utils.generateResponse("buttonAndEnd");
			response.writeHead(200, {
				"Content-Type" : "text/html"
			});
			response.write(body);
			response.end();
		} // Fin if hubo error al acceder a la base de datos
	}); // Fin llamada a la bd
}

/**
 * Funcion showMemo. Se encarga de gestionar el endpoint '/showMemo'
 * Muestra por pantalla la informacion de una memo concreta, pasada por
 * parametro en la peticion GET
 */

function showMemo(response, request){
	console.log("Request handler 'showMemo' was called.");
	var query = url.parse(request.url).query;
	if (query !== null) {
		var memoId = querystring.parse(query).id;

		// Llamada a la base de datos para obtener la memo
		database.getMemo(memoId, function(err,rows){
			var body;
			// Si hay error informar al usuario
			if(err !== null){
				body = utils.generateResponse("showMemoFailed");
				response.writeHead(200, {
					"Content-Type" : "text/html"
				});
				response.write(body);
				response.end();
			}
			else{
				if(rows !== null){
					// Generar el html con la informacion obtenida de la bd
					memoId = rows[0].idMemo;
					memoName = rows[0].MemoName;
					memoDesc = rows[0].MemoDesc;
					memoDate = rows[0].NiceDate;
					memoFileName = rows[0].MemoFileName;
					var download = "";
					if(memoFileName === null){
						memoFileName = "No file attached";
					} else{
						download = '<form action="/getFile"><br>' +
						'<button name="id" value="' + memoId + '">Download file</button>' +
						'</form>';
					}
					body = utils.generateResponse("showMemo") +
					'<h2>Memo Details</h2>' +
					'<h3>Name:<br></h3>' + memoName + '<br>' +
					'<h3>Description:<br></h3>' +	memoDesc + '<br>' +
					'<h3>Date:<br></h3>' +	memoDate + '<br>' +
					'<h3>File:<br></h3>' + memoFileName + '<br>' + download +
					utils.generateResponse("listButtonAndEnd");
				} else {
					body = utils.generateResponse("showMemoFailed");
				}
				response.writeHead(200, {
					"Content-Type" : "text/html"
				});
				response.write(body);
				response.end();
			} // Fin if hubo error al acceder a la bd
		}); // Fin acceso a la bd
	}
	// Si la query esta vacia redirigimos a start
	else{
		start(response,request);
	} // Fin if la query estaba vacia
}

/**
 * Funcion deleteMemo. Se encarga de gestionar el endpoint '/deleteMemo'
 * Muestra por pantalla la lista de memos para permitir al usuario borrar
 * la que seleccione
 */

function deleteMemo(response, request){
	console.log("Request handler 'deleteMemo' was called.");

	// Llamada a la bd para obtener las memos
	database.getAllMemo(function(err,rows){
		// Si hay algun error, informar al usuario
		if(err){
			var body = utils.generateResponse("showAllMemoFailed");
			response.writeHead(200, {
				"Content-Type" : "text/html"
			});
			response.write(body);
			response.end();
		} else{
			// Generate response
			var body = utils.generateResponse("showAllMemoToDelete") +
			'<table style="width:100%">' +
			'<tr> <th>Name</th> <th>Description</th> ' +
			'<th>Date</th> <th>File</th>  </tr>';
			for(i = 0; i<rows.length; i++){
				memoId = rows[i].idMemo;
				memoName = rows[i].MemoName;
				memoDesc = rows[i].MemoDesc;
				memoDate = rows[i].NiceDate;
				memoFileName = rows[i].MemoFileName;
				var download = "";
				if(memoFileName === null){
					memoFileName = "No file attached";
				} else{
					download = '<form action="/getFile">' +
					'<button name="id" value="' + memoId + '">Download file</button>' +
					'</form>';
				}

				body = body + '<tr> <th>' +
				'<form action="/removeMemo">' + memoName + '<br>' +
				'<button name="id" value="' + memoId + '" onclick="return confirm' +
				'(\'Are you sure?\')">Delete this memo</button>' +
				'</form></th> <th>' + memoDesc + '</th> ' +
				'<th>' + memoDate + '</th> <th>' + memoFileName + '</th>  </tr>';
			}
			body = body + '</table>' + utils.generateResponse("buttonAndEnd");
			response.writeHead(200, {
				"Content-Type" : "text/html"
			});
			response.write(body);
			response.end();
		} // Fin if error en la llamada a la bd
	}); // Fin llamada a la bd
}

/**
 * Funcion removeMemo. Se encarga de gestionar el endpoint '/removeMemo'
 * Elimina la tarea referenciada mediante el parametro id en la peticion
 * GET
 */

function removeMemo(response, request){
	console.log("Request handler 'removeMemo' was called.");
	var query = url.parse(request.url).query;
	if (query !== null) {
		var memoId = querystring.parse(query).id;
		// Call to bd get
		// If everything went ok then callback function is called
		database.dropMemo(memoId, function(err){
			var body;
			if(err !== null){
				body = utils.generateResponse("removeMemoFailed");
			}
			else{
				body = utils.generateResponse("removeMemo");
			}
			response.writeHead(200, {
				"Content-Type" : "text/html"
			});
			response.write(body);
			response.end();
		});
	} else{
		// Redirigir a start
		start(response,request);
	}
}

/**
 * Funcion getFile. Se encarga de gestionar el endpoint '/getFile'
 * Devuelve el fichero de la memo referenciada por el parametro de la peticion
 * GET llamado 'id'
 */

function getFile(response, request){
	console.log("Request handler 'getFile' was called.");
	var query = url.parse(request.url).query;
	if (query !== null) {
		var memoId = querystring.parse(query).id;

		// Llamada a la bd para obtener el blob
		database.blobMemo(memoId, function(err, blob, name){
			if(blob !== null && name !== null){
				response.setHeader('Content-disposition', 'attachment; filename="' +
				name +'"');
				response.writeHead(200, {
					"Content-Type" : "application/octet-stream",
				});
				console.log(blob);
				response.end(blob);
			} else{
				start(response,request);
			}
		});
	} else{
		start(response,request);
	}
}

exports.start = start;
exports.setMemo = setMemo;
exports.submitMemo = submitMemo;
exports.showAllMemo = showAllMemo;
exports.showMemo = showMemo;
exports.deleteMemo = deleteMemo;
exports.removeMemo = removeMemo;
exports.getFile = getFile;
