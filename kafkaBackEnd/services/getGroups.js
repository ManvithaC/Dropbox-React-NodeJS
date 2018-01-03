
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of getGroups:"+ JSON.stringify(msg));

      connectionPooling.find('Groups',{username: msg.username},function(err, groups){
        if (err) {
          res.code = "401";
         callback(null,res);
        } else if (groups) {
            res.code ="200";
            res.value = groups;
            callback(null,res);
        }
        else{
          res.code = "401";
        }
      });

}

exports.handle_request = handle_request;
