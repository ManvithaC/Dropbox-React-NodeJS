
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
var multer = require('multer');
var moment = require('moment');
var glob = require('glob');
var fs=require('fs');
function handle_request(msg, callback){

    var res={};
    reqStarred = 'false';
    var now = moment();
    reqCreateDate = now.format('YYYY-MM-DD HH:mm:ss');
    reqModifiedDate = now.format('YYYY-MM-DD HH:mm:ss');
    reqFileName = msg.reqFileName;

    reqFilePath = msg.reqFilePath;
    console.log("userFilepath"+reqFilePath );

    fs.writeFile(reqFilePath+'/'+reqFileName,msg.data, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});

      connectionPooling.findOne('filesList',{username: msg.username, filename:reqFileName }, function(err, file){
          if (file) {
              console.log("File already exists");
              res.code = "401";
              res.value = "File upload failed";
              callback(null, res);
          } else {
            connectionPooling.insertOne('filesList',{username: msg.username, filename:reqFileName, filepath: reqFilePath+msg.username+'/', starred: reqStarred, createddate: reqCreateDate, modifieddate: reqModifiedDate, type: 'File', Owner:"true"},{w: 1}, function(err, file){
                if (file.insertedCount>0) {
                  connectionPooling.findOneAndUpdate('userActivity',{username: msg.username},{$inc:{uploadedFiles:1}},function(err, fileList){
                    if (err) {
                        console.log(err);
                    }
                    else
                    {
                      console.log("Stats updated successfully in userActivity");
                    }
                  });
                  console.log("document inserted");
                  res.code = "201";
                  res.value = "File Upload Successful";
                  callback(null, res);
                } else {
                  console.log("File already exists");
                  res.code = "401";
                  res.value = "File upload failed";
                  callback(null, res);
                }
            });
          }
      });


}

exports.handle_request = handle_request;
