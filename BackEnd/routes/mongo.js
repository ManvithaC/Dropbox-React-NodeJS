var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;


// exports.connect(url, {
//   poolSize: 10
//   // other options can go here
// },function(err, db) {
//     assert.equal(null, err);
//     db = _db;
//     }
// );
/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback){
    MongoClient.connect(url, function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log("exports.connect "+ connected );
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    }
    console.log("exports.collection "+ connected );
    return db.collection(name);
    //MongoClient.close();    
};
