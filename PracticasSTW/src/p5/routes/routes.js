var database = require("../database");

var appRouter = function(app){

  app.get("/memo", function(req,res){
    console.log("Api received GET /memo");
    database.getAllMemo(function(err,docs){
      if(!err){
        var returned = [];
        for(i = 0; i < docs.length; i++){
          returned.push({"MemoID":docs[i]._id, "href":"localhost:3000/memo/"+docs[i]._id});
        }
        res.send(returned);
      } else{
        res.send({"error":true,"message":"couldn't retrieve the info"});
      }
    });
  });

  app.post("/memo", function(req,res){
    console.log("Api received POST /memo");
    var name = req.body.name;
    var desc = req.body.desc;
    var date = req.body.date;
    var fName = req.body.fileName;
    var file = req.body.file;
    console.log(name);
    if(!name || !desc || !date){
      res.send({"error": "true", "message": "missing a parameter"});
    } else{
      // Sin fichero
      if(!fName || !file){
        database.insertMemo(name,desc,date,function(err){
          if(err === ""){
            res.send({"error":"false", "message":"memo inserted"})
          } else{
            res.send({"error": "true", "message": "error inserting memo"});
          }
        });
      }
      // Con fichero
      else{
        database.insertMemoComplete(name,desc,date,file,fName,function(err){
          if(err === ""){
            res.send({"error":"false", "message":"memo inserted"})
          } else{
            res.send({"error": "true", "message": "error inserting memo"});
          }
        });
      }
    }
  });

  app.get("/memo/:id", function(req,res){
    console.log("Api received GET /memo/:id");
    var id = req.params.id;
    database.getMemo(id, function(err,rows){
      // Si hay error informar al usuario
      if(err !== null){
        res.send({"error":true,"message":"couldn't retrieve the info"});
      }
      else{
        if(rows !== null){
          // Generar el html con la informacion obtenida de la bd
          memoId = rows[0]._id;
          memoName = rows[0].MemoName;
          memoDesc = rows[0].MemoDesc;
          memoDate = rows[0].MemoDate;
          memoFileName = rows[0].MemoFileName;
          memoFile = rows[0].MemoFile;
          res.send({"MemoID":memoId,"MemoName":memoName,"MemoDesc":memoDesc,
          "MemoFileName":memoFileName, "MemoFile":memoFile});
        } else {
          res.send({"error":true,"message":"couldn't retrieve the info"});
        }
      } // Fin if hubo error al acceder a la bd
    }); // Fin acceso a la bd
  });

  app.delete("/memo/:id", function(req,res){
    console.log("Api received DELETE /memo/:id");
    var id = req.params.id;
    database.dropMemo(id, function(err){
      // Si hay error informar al usuario
      if(err !== null){
        res.send({"error":true,"message":"couldn't retrieve the info"});
      }
      else{
        res.send({"error":false,"message":"deleted successfully"});
      }
    }); // Fin acceso a la bd
  });


}

module.exports = appRouter;
