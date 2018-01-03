
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of recentFiles:"+ JSON.stringify(msg));

    connectionPooling.findOptions('filesList',{username: msg.username},function(err, fileList){
      if (err) {
        res.code = "401";
        res.value = "Error fetching the data";
        callback(null,res);
      }
      else if (fileList) {
        res.code = "200";
        res.value = fileList;
        callback(null,res);
      }
      else{
        res.code = "401";
        res.value = "Error fetching the data";
        callback(null,res);
      }
    });
    // coll.find({username: msg.username}).sort( { modifieddate: -1 } ).limit(5).toArray(function(err, fileList){
    //   if (err) {
    //     res.code = "401";
    //     res.value = "Error fetching the data";
    //     callback(null,res);
    //   }
    //   else if (fileList) {
    //     res.code = "200";
    //     res.value = fileList;
    //     callback(null,res);
    //   }
    //   else{
    //     res.code = "401";
    //     res.value = "Error fetching the data";
    //     callback(null,res);
    //   }
    // });

}

exports.handle_request = handle_request;
