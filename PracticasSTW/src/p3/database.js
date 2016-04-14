var mysql     =    require('mysql');

/**
 * Database.js
 * Este fichero contiene todas las funciones de llamada a la base de datos
 */

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'node',
    password : 'nodejs1@',
    database : 'memosystem',
    debug    :  false
});

function insertMemo(memoName, memoDesc, memoDate, callback){
	pool.getConnection(function(err,connection){
			if (err) {
				connection.release();
				console.log(err);
				callback(err);
			}

			console.log('--Connected to database with id:  ' + connection.threadId);
			var queryString = "INSERT INTO memos (MemoName,MemoDesc,MemoDate) VALUES('" +
			memoName + "',' " + memoDesc + "', '" + memoDate + "')";
			connection.query(queryString,function(err,rows){
					connection.release();
					if(!err) {
						 console.log("--Insertion complete!");
						 callback("");
					} else{
						console.log("--Insertion failure");
						console.log(err);
						callback(err);
					}
			});

			connection.on('error', function(err) {
					  console.log("--Error in connection database!")
						callback(err);
			});
		});
}

function insertMemoComplete(memoName, memoDesc, memoDate, memoFile,
            memoFileName, callback){
	pool.getConnection(function(err,connection){
			if (err) {
				connection.release();
				console.log(err);
				callback(err);
			}

			console.log('--Connected to database with id:  ' + connection.threadId);

			var queryString = "INSERT INTO memos (MemoName,MemoDesc,MemoDate," +
      "MemoFile,MemoFileName) VALUES('" +	memoName + "',' " + memoDesc +
      "', '" + memoDate + "', 0x" + memoFile + ", '" + memoFileName + "')";
			connection.query(queryString,function(err,rows){
					connection.release();
					if(!err) {
						 console.log("--Insertion complete!");
						 callback("");
					} else{
						console.log("--Insertion failure");
						console.log(err);
						callback(err);
					}
			});

			connection.on('error', function(err) {
					  console.log("--Error in connection database!")
						callback(err);
			});
		});
}

function getAllMemo(callback){
  pool.getConnection(function(err,connection){
			if (err) {
				connection.release();
				console.log(err);
				callback(err,null);
			}

			console.log('--Connected to database with id:  ' + connection.threadId);

			var queryString = "SELECT *, DATE_FORMAT(MemoDate,'%d/%m/%Y') AS NiceDate FROM memos";
			connection.query(queryString,function(err,rows){
					connection.release();
					if(!err) {
						 console.log("--Obtained all memos!");
             console.log(rows);
						 callback(null, rows);
					} else{
						console.log("--Failed to get all memos");
						console.log(err);
						callback(err,null);
					}
			});

			connection.on('error', function(err) {
					  console.log("--Error in connection database!")
						callback(err,null);
			});
		});
}

function getMemo(idMemo, callback){
  pool.getConnection(function(err,connection){
			if (err) {
				connection.release();
				console.log(err);
				callback(err,null);
			}

			console.log('--Connected to database with id:  ' + connection.threadId);

			var queryString = "SELECT *, DATE_FORMAT(MemoDate,'%d/%m/%Y') AS NiceDate" +
      " FROM memos WHERE idMemo = " + idMemo;
			connection.query(queryString,function(err,rows){
					connection.release();
					if(!err) {
            if(rows.length > 0){
              console.log("--Obtained the memo!");
              callback(null, rows);
            } else{
              console.log("--Memo does not exist!");
              callback(null,null);
            }
					} else{
						console.log("--Failed to get the memo");
						console.log(err);
						callback(err,null);
					}
			});

			connection.on('error', function(err) {
					  console.log("--Error in connection database!")
						callback(err,null);
			});
		});
}

function dropMemo(idMemo, callback){
  pool.getConnection(function(err,connection){
			if (err) {
				connection.release();
				console.log(err);
				callback(err);
			}

			console.log('--Connected to database with id:  ' + connection.threadId);

			var queryString = "DELETE FROM memos WHERE idMemo = " + idMemo;
			connection.query(queryString,function(err,rows){
					connection.release();
					if(rows.affectedRows > 0) {
            console.log("--Deleted the memo " + idMemo + " succesfully!");
            callback(null);
					} else{
						console.log("--Failed to delete the memo " + idMemo);
						console.log("--No affected rows");
						callback(rows.affectedRows);
					}
			});

			connection.on('error', function(err) {
					  console.log("--Error in connection database!")
						callback(err);
			});
		});
}

function blobMemo(idMemo, callback){
  pool.getConnection(function(err,connection){
			if (err) {
				connection.release();
				console.log(err);
				callback(err,null, null);
			}

			console.log('--Connected to database with id:  ' + connection.threadId);

			var queryString = "SELECT MemoFile, MemoFileName FROM memos WHERE idMemo = " + idMemo;
			connection.query(queryString,function(err,rows){
					connection.release();
					if(!err) {
            if(rows.length > 0){
              console.log(rows);
              var blob = rows[0].MemoFile;
              console.log(blob);
              var name = rows[0].MemoFileName;
              console.log("--Obtained the memo!");
              callback(null, blob, name);
            } else{
              console.log("--Memo does not exist!");
              callback(null,null, null);
            }
					} else{
						console.log("--Failed to get the memo");
						console.log(err);
						callback(err,null);
					}
			});

			connection.on('error', function(err) {
					  console.log("--Error in connection database!")
						callback(err,null);
			});
		});
}

exports.insertMemo = insertMemo;
exports.insertMemoComplete = insertMemoComplete;
exports.getAllMemo = getAllMemo;
exports.getMemo = getMemo;
exports.dropMemo = dropMemo;
exports.blobMemo = blobMemo;
