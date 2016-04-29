var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var server = "mongodb://TestUser:testpassword1#@ds013310.mlab.com:13310/felinotweetsdb";
//var server =

/**
 * Database.js
 * Este fichero contiene todas las funciones de llamada a la base de datos
 */

 /**
  * Funcion insertMemo. Se encarga de insertar en la base de datos
  * una memo que no tenga fichero asociado. Si no hay error llama a la funcion
  * de callback sin error asociado
  */

function insertMemo(memoName, memoDesc, memoDate, callback){
	MongoClient.connect(server,function(err,connection){
			if (err) {
				console.log(err);
				callback(err);
			}

      var collection = connection.collection('memos');

			console.log('--Connected to database');

      collection.insert({'MemoName':memoName,'MemoDesc':memoDesc,'MemoDate':memoDate},
        function(err, count){
					connection.close();
					if(!err) {
						 console.log("--Insertion complete!");
						 callback("");
					} else{
						console.log("--Insertion failure");
						console.log(err);
						callback(err);
					}
			});
		});
}

/**
 * Funcion insertMemoComplete. Se encarga de insertar en la base de datos
 * una memo que tenga fichero asociado. Si no hay error llama a la funcion
 * de callback sin error asociado
 */

function insertMemoComplete(memoName, memoDesc, memoDate, memoFile,
            memoFileName, callback){
  MongoClient.connect(server,function(err,connection){
  		if (err) {
  			console.log(err);
  			callback(err);
  		}

      var collection = connection.collection('memos');

  		console.log('--Connected to database');

			collection.insert(
        {'MemoName':memoName,'MemoDesc':memoDesc,'MemoDate':memoDate,
        'MemoFile':memoFile,'MemoFileName':memoFileName},
        function(err,count){
					connection.close();
					if(!err) {
						 console.log("--Insertion complete!");
						 callback("");
					} else{
						console.log("--Insertion failure");
						console.log(err);
						callback(err);
					}
			});
		});
}

/**
 * Funcion getAllMemo. Se encarga de devolver todas las memos de la base de
 * datos. Si no hay error llama a la funcion de callback sin error asociado y
 * con las memos encontradas
 */

function getAllMemo(callback){
  MongoClient.connect(server,function(err,connection){
			if (err) {
				console.log(err);
				callback(err,null);
			}

      var collection = connection.collection('memos');

			console.log('--Connected to database');

			collection.find().toArray(function(err,documents){
					connection.close();
          console.log(documents);
					if(!err) {
						 console.log("--Obtained all memos!");
             var rows = documents;
						 callback(null, rows);
					} else{
						console.log("--Failed to get all memos");
						console.log(err);
						callback(err,null);
					}
			});
		});
}

/**
 * Funcion getMemo. Se encarga de devolver la memo referenciada de la base de
 * datos. Si no hay error llama a la funcion de callback sin error asociado y
 * con la memo en cuestion
 */

function getMemo(idMemo, callback){
	console.log(idMemo);
  MongoClient.connect(server,function(err,connection){
			if (err) {
				console.log(err);
				callback(err,null);
			}

      var collection = connection.collection('memos');
			console.log('--Connected to database');
			collection.find(ObjectId(idMemo)).toArray(function(err,documents){
        console.log(documents);
        connection.close();
					if(!err) {
            if(documents.length > 0){
              console.log("--Obtained the memo!");
              callback(null, documents);
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
		});
}

/**
 * Funcion dropMemo. Se encarga de eliminar la memo referenciada de la base de
 * datos. Si no hay error llama a la funcion de callback sin error asociado y
 * con el numero de memos afectadas
 */

function dropMemo(idMemo, callback){
  MongoClient.connect(server,function(err,connection){
			if (err) {
				console.log(err);
				callback(err);
			}

			var collection = connection.collection('memos');
			console.log('--Connected to database');

			collection.remove({"_id":ObjectId(idMemo)},true,function(err,documents){
					connection.close();
					console.log(documents);
					if(documents > 0) {
            console.log("--Deleted the memo " + idMemo + " succesfully!");
            callback(null);
					} else{
						console.log("--Failed to delete the memo " + idMemo);
						console.log("--No affected rows");
						callback(documents);
					}
			});
		});
}

function blobMemo(idMemo, callback){
  MongoClient.connect(server,function(err,connection){
			if (err) {
				console.log(err);
				callback(err,null, null);
			}

			var collection = connection.collection('memos');
			console.log('--Connected to database');

			if(idMemo!=null){

				collection.find(ObjectId(idMemo)).toArray(function(err, rows){
						connection.close();
						if(!err) {
	            if(rows.length > 0 && rows[0] != null){
	              var blob = rows[0].MemoFile;
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
			} else{
				console.log("--Failed to get the memo");
				console.log(err);
				callback(err,null);
			}
		});
}

/**
 * Funcion loginUser
 */

function loginUser(user, pass, callback){
 MongoClient.connect(server,function(err,connection){
		 if (err) {
			 console.log(err);
			 callback(err,null,null);
		 }

		 var collection = connection.collection('users');

		 console.log('--Connected to database');

		 collection.find({"user":""+user}).toArray(function(err, documents){
				 if(!err) {
					 // The user exists
					 if(documents.length > 0){
						 var userPass = documents[0].pass;
						 // Password matches
						 if(userPass === pass){
							 console.log("--Login succesfull!");
							 connection.close();
							 callback(null,true,documents[0]._id);
						 }
						 // Password doesn't match
						 else{
							 console.log("--Password doesn't match");
							 connection.close();
							 callback(null,false,null);
						 }
				 	 } else{
					 	console.log("--User doesn't exist! Auto-inserting!");
					 	collection.insert({'user':user,'pass':pass},function(err, count){
						 connection.close();
						 if(!err) {
							 console.log("--User insertion complete!");
							 callback(null,true,count[0]._id);
						 } else{
							 console.log("--User insertion failure!");
							 console.log(err);
							 callback(err,false,null);
						 }
						});
				 	}
				} else{
					console.log("--User insertion failure!");
					console.log(err);
					callback(err,false,null);
				}
		 });
	 });
}

/**
 * Funcion checkLogin
 */

function checkLogin(id, callback){
 MongoClient.connect(server,function(err,connection){
		 if (err) {
			 console.log(err);
			 callback(err);
		 }

		 var collection = connection.collection('users');

		 console.log('--Connected to database');
		 collection.find(ObjectId(id)).toArray(function(err, documents){
				 if(!err) {
					// The user exists
					if(documents.length > 0){
						connection.close();
						console.log("--Check login successfull");
						callback(null,true);
					}
					else{
						console.log("--Check login unsuccessfull");
						console.log(user);
						callback(null,false);
						}
				}
				else{
					console.log("--Error! ");
					connection.close();
					callback(err,false);
				}
		 });
	 });
}

/**
 * Funcion delete all memos
 */

function deleteAllMemos(callback){
 MongoClient.connect(server,function(err,connection){
		 if (err) {
			 console.log(err);
			 callback(err);
		 }

		 var collection = connection.collection('memos');
		 console.log('--Connected to database');
		 collection.remove({},function(err,documents){
				 connection.close();
				 console.log(documents);
				 if(documents > 0) {
					 console.log("--Deleted all memos succesfully!");
					 callback(null);
				 } else{
					 console.log("--Failed to delete the memos " + idMemo);
					 console.log("--No affected rows");
					 callback(documents);
				 }
		 });
	 });
}

/**
 * Funcion updateMemo. Se encarga de actualizar la info de una memo
 */
 function updateMemo(idMemo, memoName, memoDesc, memoDate, memoFile,
             memoFileName, callback){
   MongoClient.connect(server,function(err,connection){
   		if (err) {
   			console.log(err);
   			callback(err);
   		}

 			if(!memoFile || !memoFileName){
				memoFile = undefined;
				memoFileName = undefined;
			}
      var collection = connection.collection('memos');

   		console.log('--Connected to database');

 			collection.update({'_id':ObjectId(idMemo)},
         {$set:{'MemoName':memoName,'MemoDesc':memoDesc,'MemoDate':memoDate,
         'MemoFile':memoFile,'MemoFileName':memoFileName}},
         function(err,count){
 					connection.close();
 					if(!err && count!=0) {
 						 console.log("--Update complete!");
 						 callback("");
 					} else{
 						console.log("--Update failure");
 						console.log(err);
 						callback(err);
 					}
 			});
 		});
 }

 /**
  * Funcion getAllUser. Se encarga de devolver todos los users de la base de
  * datos. Si no hay error llama a la funcion de callback sin error asociado y
  * con los users encontrados
  */

 function getAllUser(callback){
   MongoClient.connect(server,function(err,connection){
 			if (err) {
 				console.log(err);
 				callback(err,null);
 			}

       var collection = connection.collection('users');

 			console.log('--Connected to database');

 			collection.find().toArray(function(err,documents){
 					connection.close();
           console.log(documents);
 					if(!err) {
 						 console.log("--Obtained all users!");
              var rows = documents;
 						 callback(null, rows);
 					} else{
 						console.log("--Failed to get all users");
 						console.log(err);
 						callback(err,null);
 					}
 			});
 		});
 }

 /**
  * Funcion insertUser. Se encarga de insertar en la base de datos
  * un user. Si no hay error llama a la funcion
  * de callback sin error asociado
  */

 function insertUser(username, password, callback){
   MongoClient.connect(server,function(err,connection){
   		if (err) {
   			console.log(err);
   			callback(err);
   		}

      var collection = connection.collection('users');

   		console.log('--Connected to database');

 			collection.insert(
         {'user':username,'pass':password},
         function(err,count){
 					connection.close();
 					if(!err) {
 						 console.log("--Insertion complete!");
 						 callback("");
 					} else{
 						console.log("--Insertion failure");
 						console.log(err);
 						callback(err);
 					}
 			});
 		});
 }

 /**
  * Funcion delete all users
	*/

 function deleteAllUsers(callback){
  MongoClient.connect(server,function(err,connection){
 		 if (err) {
 			 console.log(err);
 			 callback(err);
 		 }

 		 var collection = connection.collection('users');
 		 console.log('--Connected to database');
 		 collection.remove({},function(err,documents){
 				 connection.close();
 				 console.log(documents);
 				 if(documents > 0) {
 					 console.log("--Deleted all users succesfully!");
 					 callback(null);
 				 } else{
 					 console.log("--Failed to delete the users " + idMemo);
 					 console.log("--No affected rows");
 					 callback(documents);
 				 }
 		 });
 	 });
 }

 /**
  * Funcion getUser. Se encarga de devolver el user referenciado de la base de
  * datos. Si no hay error llama a la funcion de callback sin error asociado y
  * con el user en cuestion
  */

 function getUser(idUser, callback){
   MongoClient.connect(server,function(err,connection){
 			if (err) {
 				console.log(err);
 				callback(err,null);
 			}

      var collection = connection.collection('users');
 			console.log('--Connected to database');
 			collection.find(ObjectId(idUser)).toArray(function(err,documents){
         console.log(documents);
         connection.close();
 					if(!err) {
             if(documents.length > 0){
               console.log("--Obtained the user!");
               callback(null, documents);
             } else{
               console.log("--User does not exist!");
               callback(null,null);
             }
 					} else{
 						console.log("--Failed to get the user");
 						console.log(err);
 						callback(err,null);
 					}
 			});
 		});
 }

 /**
  * Funcion updateUser. Se encarga de actualizar la info de un user
  */
  function updateUser(idMemo, username, password, callback){
    MongoClient.connect(server,function(err,connection){
    		if (err) {
    			console.log(err);
    			callback(err);
    		}

        var collection = connection.collection('users');

    		console.log('--Connected to database');

  			collection.update({'_id':ObjectId(idMemo)},
          {$set:{'user':username,'pass':password}},
          function(err,count){
  					connection.close();
  					if(!err && count!=0) {
  						 console.log("--Update complete!");
  						 callback("");
  					} else{
  						console.log("--Update failure");
  						console.log(err);
  						callback(err);
  					}
  			});
  		});
  }

	/**
	 * Funcion deleteUser. Se encarga de eliminar el user referenciado
	 */

	function deleteUser(idUser, callback){
	  MongoClient.connect(server,function(err,connection){
				if (err) {
					console.log(err);
					callback(err);
				}

				var collection = connection.collection('users');
				console.log('--Connected to database');

				collection.remove({"_id":ObjectId(idUser)},true,function(err,documents){
						connection.close();
						console.log(documents);
						if(documents > 0) {
	            console.log("--Deleted the user " + idUser + " succesfully!");
	            callback(null);
						} else{
							console.log("--Failed to delete the user " + idUser);
							console.log("--No affected rows");
							callback(documents);
						}
				});
			});
	}

exports.insertMemo = insertMemo;
exports.insertMemoComplete = insertMemoComplete;
exports.getAllMemo = getAllMemo;
exports.getMemo = getMemo;
exports.dropMemo = dropMemo;
exports.blobMemo = blobMemo;
exports.loginUser = loginUser;
exports.checkLogin = checkLogin;
exports.deleteAllMemos = deleteAllMemos;
exports.updateMemo = updateMemo;
exports.getAllUser = getAllUser;
exports.insertUser = insertUser;
exports.deleteAllUsers = deleteAllUsers;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
