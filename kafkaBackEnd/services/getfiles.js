
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of getfiles:"+ JSON.stringify(msg));

    folderpath = './public/uploads/' + msg.username + msg.folderName;
    console.log("folderpath: "+folderpath);

      connectionPooling.find('filesList',{username: msg.username,filepath:folderpath },function(err, fileList){
          if (err) {
              res.code = "401";
              res.value = "Error fetching the data";
          }
          else if (fileList) {
            res.value = fileList;
            if(msg.folderName === '/'){
              connectionPooling.find('filesList',{username: msg.username,owner:"false" },function(err, SharefileList){
                if(err){
                  res.code = "401";
                  res.value = "Error fetching the data";
                  callback(null,res);
                }
                else if(SharefileList){
                  res.value = fileList.concat(SharefileList);
                  res.code ="200";
                  console.log();res.valu
                  callback(null,res);
                }
              });
            }
            else{
            res.code ="200";
            callback(null,res);
          }
          }
          else
          {
            console.log(err);
            res.code = "401";
            callback(null,res);
          }
      });

}

exports.handle_request = handle_request;
