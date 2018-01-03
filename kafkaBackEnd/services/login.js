
var connectionPooling = require("./connectionPooling");
var bcrypt = require('bcrypt');
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));

            console.log("req - login: "+msg.username+msg.password);
            connectionPooling.findOne('login',{username: msg.username}, function(err, user){
                if (user) {
                  if(bcrypt.compareSync(msg.password, user.password)){
                          console.log("user found");
                          res.code = "200";
                          res.value = "Success Login";
                          res.username = user.username;
                        }
                        else{
                          res.code = "401";
                          res.value = "Failed Login";
                                      }
                } else {
                  res.code = "401";
                  res.value = "Failed Login";

                }
                callback(null, res);
            });
}
//
// var mongo = require("./mongo");
// var bcrypt = require('bcrypt');
// var mongoURL = "mongodb://localhost:27017/login";
// function handle_request(msg, callback){
//
//     var res = {};
//     console.log("In handle request:"+ JSON.stringify(msg));
//
//     mongo.connect(mongoURL, function(){
//             console.log('Connected to mongo at: ' + mongoURL);
//             //var coll = mongo.collection('login');
//             console.log("req - passport: "+msg.username+msg.password);
//             coll.findOne({username: msg.username}, function(err, user){
//                 if (user) {
//                   if(bcrypt.compareSync(msg.password, user.password)){
//                           console.log("user found");
//                           res.code = "200";
//                           res.value = "Success Login";
//                           res.username = user.username;
//                         }
//                         else{
//                           res.code = "401";
//                           res.value = "Failed Login";
//                                       }
//                 } else {
//                   res.code = "401";
//                   res.value = "Failed Login";
//
//                 }
//                 callback(null, res);
//             });
//
//         });

//}
 exports.handle_request = handle_request;
