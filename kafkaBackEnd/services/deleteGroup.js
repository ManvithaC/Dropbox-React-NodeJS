
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
var moment = require('moment');
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of deleteGroup:"+ JSON.stringify(msg));

        connectionPooling.deleteOne('Groups',{username: msg.username, groupName:msg.GroupName, owner:"true" },function(err,file){
            if (err) {
              console.log("Error:" + err);
              console.log(err);
              console.log("delete Group failed");
              res.code ="401";
              callback(null, res);
            } else if(file) {
                  res.code="200",
                  res.value="Group deleted successfully."
                  callback(null, res);
                  }
              });
}

exports.handle_request = handle_request;
