var connectionPooling = require("./connectionPooling");
var bcrypt = require('bcrypt');
var mkdirp = require('mkdirp');
var path = './public/uploads/';
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of signup:"+ JSON.stringify(msg));

      connectionPooling.findOne('login',{username: msg.username}, function(err, user){
          if (user) {
              console.log("User already exists");
              res.code = "500";
              res.value = "failure signup-user already exists";
              console.log("2: "+res.code);
              callback(null, res);

          } else {
            var passwordHash = bcrypt.hashSync(msg.password, 10);
            connectionPooling.insertOne('login',{username: msg.username, password:passwordHash, firstname:msg.firstname ,lastname:msg.lastname}, function(err, user){
                if (user.insertedCount>0) {
                  connectionPooling.insertOne('userActivity',{username: msg.username, uploadedFiles:0, sharedFiles:0, deletedFiles:0},{w: 1}, function(err, user){
                      if (user.insertedCount>0) {
                          console.log("document inserted");
                      } else {
                          console.log("document not inserted");
                      }
                  });
                    console.log("document inserted");
                    mkdirp(path+msg.username, function (err) {
                      res.code = "401";
                      res.value = "failure folder creation in signup";
                           });
                    res.code = "201";
                    res.value = "Success signup";


                } else {
                    //res.status(400);
                    console.log("document not inserted");
                    res.code = "401";
                    res.value = "failure signup";
                }
                  callback(null, res);
            });
          }

      });

}

exports.handle_request = handle_request;
