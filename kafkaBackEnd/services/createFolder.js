
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
var mkdirp = require('mkdirp');
var moment = require('moment');
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of createFolder:"+ JSON.stringify(msg));

    var path = './public/uploads/'+msg.username + msg.folderPath;
    var folderName = msg.folderName;
    mkdirp(path+ '/' + folderName, function (err) {
    if (err){
       res.status(401).json({message: "Folder Creation Failed"});
     }
    else {
    reqUserName = msg.username;
    reqFileName = msg.folderName;
    //TODO: change this path to reflect the folder in which the current page is
    reqFilePath = path;
    reqStarred = 'false';
    var now = moment();
    reqCreateDate = now.format('YYYY-MM-DD HH:mm:ss');
    reqModifiedDate = now.format('YYYY-MM-DD HH:mm:ss');

        connectionPooling.findOne('filesList',{username: reqUserName,filename:reqFileName}, function(err, file){
            if (file) {
                console.log("Folder already exists");
                res.code ="401";
                callback(null, res);
            } else {
              connectionPooling.insertOne('filesList',{username: reqUserName, filename:reqFileName, filepath:reqFilePath ,starred:reqStarred, createddate:reqCreateDate,modifieddate:reqModifiedDate, type:'Folder', owner:true },{w: 1}, function(err, user){
                  if (user.insertedCount>0) {
                    console.log("Folder creation successful");
                    res.code="200";
                    callback(null, res);
                  } else {
                    console.log("User record has been created successfully");
                    res.code ="401";
                    callback(null, res);
                  }
              });
            }
        });

  }
});
}

exports.handle_request = handle_request;
