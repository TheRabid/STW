/**
 * Utils.js
 * Este fichero contiene todas las generaciones de paginas html estaticas
 * para facilitar su uso en el fichero requestHandlers
 */

var head = '<head>'+
'<meta http-equiv="Content-Type" '+
'content="text/html; charset=UTF-8" />'+
'</head>';

var headTest = '<head>'+
'<meta http-equiv="Content-Type" '+
'content="application/octet-stream; charset=UTF-8" />'+
'</head>';

var headTable = '<head>'+
'<meta http-equiv="Content-Type" '+
'content="text/html; charset=UTF-8" />'+
'</head>' +
'<style>' +
'table, th, td {' +
'border: 1px solid black;' +
'border-collapse: collapse;' +
'}' +
'th, td {' +
'padding: 5px;' +
'text-align: center;' +
'}</style>';

var mainHeader = '<h1>' +
'=-=-= Memo System =-=-=' +
'</h1>';

var backButton = '<form action="/start">' +
'<input type="submit" value="Back to Main Menu">' +
'</form>';

var startBody = '<h2>' +
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
'</form>';

var setMemoBody = '<h2>' +
'New memo' +
'</h2>' +
'<form action="/submitMemo" enctype="multipart/form-data" method="post">' +
'Name of memo:<br>' +
'<input type="text" name="memoName" required><br>' +
'Description of memo:<br>' +
'<textarea name="memoDesc" rows="20" cols="30" required></textarea><br>' +
'Date of memo:<br>' +
'<input type="date" name="memoDate"><br>' +
'Optional file:<br>'+
'<input type="file" name="memoFile" multiple="multiple"><br><br>'+
'<input type="submit" value="Submit memo">' +
'</form>';

var insertMemoFailed = '<h2>' +
'Memo not created' +
'</h2>' +
'<h3>' +
'The memo could not be inserted into the database' +
'</h3>' +
'Please try again' +
'<br><br>' +
'<form action="/start">' +
'<input type="submit" value="Back to Main Menu">' +
'</form>' +
'</body>'+
'</html>';

var showAllBody = '<h2>' +
'Memo List' +
'</h2>';

var showAllBodyToDelete = '<h2>' +
'Choose a memo to delete' +
'</h2>';

var buttonList = '<br><form action="/showAllMemo">' +
'<input type="submit" value="Back to memo list">' +
'</form>';

var buttonDelete = '<br><form action="/deleteMemo">' +
'<input type="submit" value="Back to memo list">' +
'</form>';

var buttonAndEnd = '<br><form action="/start">' +
'<input type="submit" value="Back to Main Menu">' +
'</form>' +
'</body>'+
'</html>';

var showMemoFailed = '<h2>' +
'Memo not found' +
'</h2>' +
'<h3>' +
'The memo does not exist in the database or either you have a connection error ' +
'</h3>' +
'Please try again' +
'<br>' + buttonList +
'<br><form action="/start">' +
'<input type="submit" value="Back to Main Menu">' +
'</form>' +
'</body>'+
'</html>';

var showAllMemoFailed = '<h2>' +
'Error accessing the database' +
'</h2>' +
'<h3>' +
'Maybe there is a connection error ' +
'</h3>' +
'Please try again' +
'<br>' + buttonList +
'<br><form action="/start">' +
'<input type="submit" value="Back to Main Menu">' +
'</form>' +
'</body>'+
'</html>';

var removeMemo = '<h2>' +
'Memo deleted successfully' +
'</h2>' + buttonDelete +
'<br><form action="/start">' +
'<input type="submit" value="Back to Main Menu">' +
'</form>' +
'</body>'+
'</html>';

var removeMemoFailed = '<h2>' +
'Memo not deleted' +
'</h2><h3>There was an error while deleting the memo. Please try again</h3>' +
buttonDelete + '<br><form action="/start">' +
'<input type="submit" value="Back to Main Menu">' +
'</form>' +
'</body>'+
'</html>';

/*
 * Funcion generateResponse. En base al tipo pasado por parametro devuelve
 * un String u otro para generar el Html
 */
function generateResponse(kind) {
  var returned;
  if(kind === "start"){
    returned = '<html>' + head + '<body>' + mainHeader + startBody +
    '</body></html>';
  } else if (kind === "setMemo") {
    returned = '<html>' + head + '<body>' + mainHeader + setMemoBody +
    backButton + '</body></html>';
  } else if(kind === "insertMemo"){
    returned = '<html>' + head + '<body>' + mainHeader;
  } else if(kind === "insertMemoFailed"){
    returned = insertMemoFailed;
  } else if(kind === "buttonAndEnd"){
    returned = buttonAndEnd;
  } else if(kind === "showAllMemo"){
    returned = '<html>' + headTable + '<body>' + mainHeader + showAllBody;
  } else if(kind === "showMemo"){
    returned = '<html>' + head + '<body>' + mainHeader;
  } else if(kind === "showMemoFailed"){
    returned = '<html>' + head + '<body>' + mainHeader + showMemoFailed;
  } else if(kind === "listButtonAndEnd"){
    returned = buttonList + buttonAndEnd;
  } else if(kind === "showAllMemoToDelete"){
    returned = '<html>' + headTable + '<body>' + mainHeader + showAllBodyToDelete;
  }else if(kind === "removeMemo"){
    returned = '<html>' + head + '<body>' + mainHeader + removeMemo;
  } else if(kind === "removeMemoFailed"){
    returned = '<html>' + head + '<body>' + mainHeader + removeMemoFailed;
  } else if(kind === "showAllMemoFailed"){
    returned = '<html>' + head + '<body>' + mainHeader + showAllMemoFailed;
  }
  return returned;
}

exports.generateResponse = generateResponse;
