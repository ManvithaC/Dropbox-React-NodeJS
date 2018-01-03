
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';

function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of deletemember:"+ JSON.stringify(msg));

              connectionPooling.findOne('Groups',{username: msg.username, groupName:msg.GroupName, owner:"true" },function(err,file){
                  if (err) {
                    console.log("Error:" + err);
                    console.log(err);
                    console.log("delete member failed");
                    res.code ="401";
                    callback(null, res);
                  } else if(file) {
                    connectionPooling.deleteOne('Groups',{username: msg.memberName, groupName:msg.GroupName, owner:"false" },function(err,file){
                        if (err) {
                          console.log("Error:" + err);
                          console.log(err);
                          console.log("delete member failed");
                          res.code ="401";
                          callback(null, res);
                        } else if(file) {
                              res.code="201",
                              res.value="delete member successfully."
                              callback(null, res);
                              }
                          });
                        }
                    });
}

exports.handle_request = handle_request;
