const express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

// JSON -> Javascript Object Notation

function thingsInit(db){
// json.org

var  thingsColl = db.collection('things');

var thingsCollection = [];

var thingsStruct = {
  "id" : 0,
  "fecha": 0,
  "tipo":'',
  "tamano":'',
  "sabor":''
};

thingsCollection.push(
    Object.assign({},
        thingsStruct,
        { "id":1,
          "fecha": new Date().getTime(),
          "tipo":"helado",
          "tamano":"grande",
          "sabor":"fresa"
        }
    )
  );

  
router.get('/', (req, res, next)=>{
    thingsColl.find().toArray((err, things)=>{
      if(err) return res.status(200).json([]);
      return res.status(200).json(things);
    });//find toArray
    ///res.status(200).json(thingsCollection);
  });

  router.get('/:id', (req, res, next)=>{
    var query = {"_id": new ObjectID(req.params.id)}
    thingsColl.findOne(query, (err, doc)=>{
      if(err) {
        console.log(err);
        return res.status(401).json({"error":"Error al extraer documento"});
      }
      return res.status(200).json(doc);
    }); //findOne
  });

  router.post('/', (req, res, next)=>{
    var newElement = Object.assign({},
      thingsStruct,
      req.body,
      {
        "fecha": new Date().getTime()
        
      }
    );
  
    //thingsCollection.push(newElement);
    //res.status(200).json(newElement);
    thingsColl.insertOne(newElement, {} , (err, result)=>{
      if(err){
        console.log(err);
        return res.status(404).json({"error":"No se pudo Insertar One Thing"});
      }
      return res.status(200).json({"n": result.insertedCount,"obj": result.ops[0]});
    });//insertOne
  });
  
  
  router.put('/:idElemento', (req, res, next) => {
    var query = {"_id": new ObjectID(req.params.idElemento)};
    var update = {"$set": req.body, "$inc":{"visited": 1}};
    var modifiedObject = {};
    var originalObject = {};
    thingsColl.updateOne(query, update, (err, rst) => {
      if(err){
        consolw.log(err);
        return res.status(400).json({"error":"Error al actualizar documentos"});
      }
      return res.status(200).json(rst);
    });
  });



    router.delete('/:id', (req, res, next) =>{
      var query = {"_id": new ObjectID(req.params.id)}
      thingsColl.removeOne(query, (err, result) => {
        if(err){
          console.log(err);
          return res.status(400).json({"Error":"Error al eliminar documento"});
        }
        return res.status(200).json(result);

      })
    });

return router;
}

module.exports = thingsInit;