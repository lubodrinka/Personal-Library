/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

const assert = require('assert');





// Use connect method to connect to the Server

module.exports = function (app) {

  app.route('/api/books')
  //finddall
    .get(function (req, res){
  //  console.log('/api/books'+req.body)
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
//ObjectId (req.body._id)
    var arr =[];
           var cursor = db.collection('books').find({}) .toArray(function(err, doc) {
   //  console.log( JSON.parse(JSON.stringify(doc)))
             var jsondoc=JSON.parse(JSON.stringify(doc))
      var arr=    jsondoc.map(d=> d={"_id": d._id,"commentcount": d.comments.length, "title": d.title})
       
              // console.log(JSON.stringify(jsondoc))
           res.send(arr )  
          });
          
   
        })
        })
           
           
  

      //response will be array of book objects){, ,  "comment": d.comment}
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    //{explain:true}
    
    .post(function (req, res){
      var title = req.body.title;
    var comment=[] ;
     
      //response will contain new book object including atleast _id and title
    if (!title){res.json('missing title');return 'missing title'}else{
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db.collection('books').insertOne({
        title: title,
       comments: comment
    }, function(err, doc){
    res.json(doc["ops"][0]);
  console.log(doc["ops"][0]["_id"])});

}); }    
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
        MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
    db.collection('books').deleteMany({}),function(err, doc) {
                  res.json('complete delete successful')}
  
}); 
    });
function find( bookid,req,res){    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
//ObjectId (req.body._id)
    
     var objid;
     
    try{ 
    objid=ObjectId (bookid)
    
    
      var query=bookid.length>0?{_id:objid}: {}
      
   db.collection('books').find(query).toArray(function(err, doc) {
    
            res.json(doc)                        
          });
   
 } catch (error){ console.log( 'no book exists')  
      res.json('no book exists')    }
});

}


  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
     console.log('/api/books/:id'+bookid )
find(bookid,req,res)
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
    console.log({'bookid':bookid  })
      //json res format same as .get
    
    var objid;
     
    try{ 
    objid=ObjectId (bookid)
     

    
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
   var ooo= db.collection('books').updateOne({
        "_id": objid
    }, {
        $push : {
            "comments":comment
        }}          
    );
         find(bookid,req,res)
}); } catch (error){ console.log( 'no book exists')  
      res.json('no book exists')    }
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      console.log(req.params)
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {
    db.collection('books').deleteOne({"_id": ObjectId (bookid)},function(err, doc) {
                  res.json('delete successful')}
    );
}); 
    });
  
};
