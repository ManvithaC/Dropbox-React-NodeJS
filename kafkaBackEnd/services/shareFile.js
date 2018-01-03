
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
var moment = require('moment');
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of shareFile:"+ JSON.stringify(msg));

    var filePath = './public/uploads/' + msg.username;
    reqUserName = msg.username;
    reqFileName =  msg.reqFileName;
    reqShareToEmail = msg.reqShareToEmail;
    reqShareToGroup = msg.shareToGroup;
    console.log("details: "+reqUserName+reqFileName+reqShareToGroup+reqShareToEmail);
    reqstarred = 'false';
    var now = moment();
    reqModifiedDate = now.format('YYYY-MM-DD HH:mm:ss');
      //checks to see if username with whom the file is being shared is valid
if(reqShareToEmail){
      connectionPooling.findOne('login',{username: reqShareToEmail }, function(err, ShareFileuser){
            if(ShareFileuser){
              // checks to see if the file is already shared with the user
                connectionPooling.findOne('filesList',{username: ShareFileuser.username, filename: reqFileName}, function(err, file){
                if(file){
                      if(file.filename === reqFileName){
                       res.code = "401";
                       res.value = "File already Shared";
                        callback(null,res);
                      }
                    }
                    else{
                        connectionPooling.findOne('filesList',{username: reqUserName, filename: reqFileName}, function(err, existingFile){
                        if(existingFile){
                            console.log("Valid User");
                            connectionPooling.insertOne('filesList',{username: reqShareToEmail, filename:reqFileName, filepath: existingFile.filepath, starred: reqstarred, createddate: existingFile.createddate, modifieddate: reqModifiedDate, type:existingFile.type,owner:'false'},{w: 1}, function(err, file){
                              if (file.insertedCount>0) {
                                connectionPooling.findOneAndUpdate('userActivity',{username: msg.username},{$inc: {sharedFiles:1}},function(err, fileList){
                                  if (err) {
                                      console.log(err);
                                  }
                                  else
                                  {
                                    console.log("Stats updated successfully in userActivity");
                                  }
                                });
                              res.code = "200";
                              res.value = "File share successful";
                               callback(null,res);
                              //res.status(204).json({message: "File Share successful"})
                              } else {
                                res.code = "401";
                                res.value = "File share Failed";
                                callback(null,res);
                                //res.status(401).json({message: "File Share failed"});
                              }
                            });
                      }
                      else{
                        res.code = "401";
                        res.value = "File share Failed";
                         callback(null,res);
                      }
                      });
                    }
                  });
          }
          else{
            res.code = "401";
            res.value = "Username does not exist.File share unsuccessful.";
          }
      });

}
else if(reqShareToGroup){

  connectionPooling.findOne('Groups',{groupName: reqShareToGroup }, function(err, ShareFileGroup){
    if(ShareFileGroup){
      console.log("GroupDetails: "+Object.keys(ShareFileGroup));
      connectionPooling.find('Groups',{groupName: reqShareToGroup,owner:"false"}).toArray(function(err, groupList){
        if (err) {
          res.code = "401";
          res.value = "Error fetching the data";
          callback(null,res);
        }
        else if (groupList) {
          //res.code = "200";
          //res.value = fileList;
          //callback(null,res);
          console.log("GroupDetail1s: "+Object.keys(groupList));
          //iterates through all the group members of th group and shares the file
          connectionPooling.forEach(function(value){
            console.log(value.username);
            connectionPooling.findOne('filesList',{username: msg.username, filename: reqFileName}, function(err, existingFile){
              if(existingFile){
            connectionPooling.insertOne('filesList',{username: value.username, filename:reqFileName, filepath: existingFile.filepath, starred: reqstarred, createddate: existingFile.createddate, modifieddate: reqModifiedDate, type:existingFile.type,owner:'false'},{w: 1}, function(err, file){
              if (file.insertedCount>0) {
                connectionPooling.findOneAndUpdate('userActivity',{username: msg.username},{$inc: {sharedFiles:1}},function(err, fileList){
                  if (err) {
                      console.log(err);
                  }
                  else
                  {
                    console.log("Stats updated successfully in userActivity");
                  }
                });
              res.code = "200";
              res.value = "File share to Group successful";
               callback(null,res);
              //res.status(204).json({message: "File Share successful"})
              } else {
                res.code = "401";
                res.value = "File share to Group Failed";
                callback(null,res);
                //res.status(401).json({message: "File Share failed"});
              }
            });
          }
          else{
            res.code = "401";
            res.value = "File share to Group Failed";
            callback(null,res);
          }
        });
          });

        }
        else{
          res.code = "401";
          res.value = "Error fetching the data";
          callback(null,res);
        }
      });
    }
    else{
      res.code = "401";
      res.value = "Group Not Found";
       callback(null,res);
    }
  });

}



}

exports.handle_request = handle_request;
