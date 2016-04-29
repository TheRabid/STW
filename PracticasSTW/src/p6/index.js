var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

/**
 * Index.js
 * Este fichero contiene la puesta en marcha del servidor
 * y la asociación de enlaces con sus handlers
 */

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/setMemo"] = requestHandlers.setMemo;
handle["/submitMemo"] = requestHandlers.submitMemo;
handle["/showAllMemo"] = requestHandlers.showAllMemo;
handle["/showMemo"] = requestHandlers.showMemo;
handle["/deleteMemo"] = requestHandlers.deleteMemo;
handle["/removeMemo"] = requestHandlers.removeMemo;
handle["/getFile"] = requestHandlers.getFile;
handle["/login"] = requestHandlers.doLogin;
handle["/logout"] = requestHandlers.doLogout;

server.start(router.route, handle);
