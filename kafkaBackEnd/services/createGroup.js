
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
var moment = require('moment');
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of createGroup:"+ JSON.stringify(msg));

              connectionPooling.insertOne('Groups',{username: msg.username,groupName:msg.GroupName, owner:"true" }, function(err, group){
                  if (group) {
                    console.log("Group creation successful");
                    res.code="201";
                    res.value=group.groupName;
                    callback(null, res);
                  } else {
                    console.log("Group Creation unsuccessful");
                    res.code ="401";
                    callback(null, res);
                  }
              });
}

exports.handle_request = handle_request;
