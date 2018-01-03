
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of get_user_about:"+ JSON.stringify(msg));

      connectionPooling.find('about',{username: msg.username},function(err, about){
        if (err) {
          res.code = "401";
         callback(null,res);
        } else if (about) {
            res.code ="200";
            res.value = about;
            callback(null,res);
        }
        else{
          res.code = "401";
        }
      });


}

exports.handle_request = handle_request;
