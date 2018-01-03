
var connectionPooling = require("./connectionPooling");
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));

            connectionPooling.findOne('userActivity',{username: msg.username}, function(err, user){
                if (user) {
                  res.code = "200";
                  res.value = user;
                } else {
                  res.code = "401";
                  res.value = "User Activity Details Fetch Successful";

                }
                callback(null, res);
            });
}

exports.handle_request = handle_request;
