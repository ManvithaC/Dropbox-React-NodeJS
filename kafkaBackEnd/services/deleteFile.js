var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of deleteFile:"+ JSON.stringify(msg));

    var filePath = './public/uploads/' + msg.username;
    console.log(filePath+'filepath here');
    const fs=require('fs');

      connectionPooling.deleteOne('filesList',{username: msg.username,filename : msg.fileName, filepath:filePath, owner:"true" },function(err,file){
          if (err) {
            console.log("Error:" + err);
            console.log(err);
            console.log("delete File failed");
            res.code ="401";
            callback(null, res);
          } else {
                    console.log("Filepath deleteeeeeeeeeeeeeee: "+filePath+'/'+msg.fileName);
                    fs.unlinkSync(filePath+'/'+msg.fileName);
                    console.log("Files has been successfully deleted");
                    connectionPooling.findOneAndUpdate('userActivity',{username: msg.username},{$inc: {deletedFiles:1}},function(err, fileList){
                      if (err) {
                          console.log(err);
                      }
                      else
                      {
                        console.log("Stats updated successfully in userActivity");
                      }
                    });
                    res.code="201";
                    callback(null, res);
                }
            });
}

exports.handle_request = handle_request;
