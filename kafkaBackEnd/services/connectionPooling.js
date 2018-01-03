var pool = [];
var poolStatus = [];
var CONNECTION_OPEN = 0;
var CONNECTION_BUSY = 1;
var minimumPoolSize = 25, maximumPoolSize = 1000;
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/login";
var db;
var connected = false;

 exports.findOne = function(collectionName,projection,callback){

     var connectionFromPool = p.getConnection();
     console.log("connectionFromPool: "+Object.keys(connectionFromPool[0].poolObjectLocation));
     var db = connectionFromPool[0].poolObject;
     var connectionLocation = connectionFromPool[0].poolObjectLocation;
     console.log("db: "+db);
     var collectionObject = db.collection(collectionName);
 		collectionObject.findOne(projection,callback);
     p.releaseConnection(connectionLocation);
 }
 exports.findOneAndUpdate = function(collectionName,projection,updateOptions,callback){

     var connectionFromPool = p.getConnection();
     console.log("connectionFromPool: "+Object.keys(connectionFromPool[0].poolObjectLocation));
     var db = connectionFromPool[0].poolObject;
     var connectionLocation = connectionFromPool[0].poolObjectLocation;
     console.log("db: "+db);
     var collectionObject = db.collection(collectionName);
 		collectionObject.findOneAndUpdate(projection,updateOptions,callback);
     p.releaseConnection(connectionLocation);
 }
 exports.deleteOne = function(collectionName,projection,callback){

     var connectionFromPool = p.getConnection();
     console.log("connectionFromPool: "+Object.keys(connectionFromPool[0].poolObjectLocation));
     var db = connectionFromPool[0].poolObject;
     var connectionLocation = connectionFromPool[0].poolObjectLocation;
     console.log("db: "+db);
     var collectionObject = db.collection(collectionName);
 		collectionObject.deleteOne(projection,callback);
     p.releaseConnection(connectionLocation);
 }
 exports.find = function(collectionName,projection,callback){

    var connectionFromPool = p.getConnection();
    var db = connectionFromPool[0].poolObject;
    var connectionLocation = connectionFromPool[0].poolObjectLocation;

    var collectionObject = db.collection(collectionName);
		collectionObject.find(projection).toArray(callback);
    p.releaseConnection(connectionLocation);
}
exports.findOptions = function(collectionName,projection,callback){

   var connectionFromPool = p.getConnection();
   var db = connectionFromPool[0].poolObject;
   var connectionLocation = connectionFromPool[0].poolObjectLocation;

   var collectionObject = db.collection(collectionName);
   collectionObject.find(projection).limit(5).toArray(callback);
   p.releaseConnection(connectionLocation);
}
exports.insertOne = function(collectionName,projection, callback){

    var connectionFromPool = p.getConnection();
    var db = connectionFromPool[0].poolObject;
    var connectionLocation = connectionFromPool[0].poolObjectLocation;
    var collectionObject = db.collection(collectionName);
		collectionObject.insertOne(projection,callback);
    p.releaseConnection(connectionLocation);

}

function Pool()
{
    for(var i=0; i < minimumPoolSize; ++i)
    {

      MongoClient.connect(mongoURL, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        connected = true;
        console.log("Connected? "+connected);
        pool.push(db);
        poolStatus.push(CONNECTION_OPEN);
      });
    }
}
function addConnectionToPool(){
  MongoClient.connect(mongoURL, function(err, _db){
    if (err) { throw new Error('Could not connect: '+err); }
    db = _db;
    connected = true;
    pool.push(db);
    poolStatus.push(CONNECTION_OPEN);
  });
}
Pool.prototype.getConnection = function(){
    var poolExausted = true;
    var poolJSON;
    for(var j = 0 ; j < pool.length ; j++)
    {
        if(poolStatus[j] === CONNECTION_OPEN)
        {
            poolStatus[j] = CONNECTION_BUSY;
            poolExausted = false;
            poolJSON = [{poolObject: pool[j],poolObjectLocation: j}];
            return poolJSON;
        }
    }

    if(poolExausted && pool.length < maximumPoolSize)
    {
        addConnectionToPool();
        poolStatus[pool.length-1] = CONNECTION_BUSY;
        poolExausted = false;
        poolJSON = [{poolObject: pool[pool.length-1],poolObjectLocation: jCount}];
        return poolJSON;
    }
}
Pool.prototype.releaseConnection = function(connectionObjectLocation)
{
    if(poolStatus[connectionObjectLocation] === CONNECTION_BUSY)
    {
        poolStatus[connectionObjectLocation] = CONNECTION_OPEN;
    }
};

var p = new Pool();
function collection(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);

};
