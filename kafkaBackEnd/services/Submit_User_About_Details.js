
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of getfiles:"+ JSON.stringify(msg));

      connectionPooling.findOne('about',{username: msg.username}, function(err, user){
          if (user) {
              console.log("User about data exists");
              res.status(401).json({message: "User Data already Exists"});
          } else {
            connectionPooling.insertOne('about',{username: msg.username, work:msg.work, education:msg.education ,sec_email:msg.sec_email, mobile:msg.mobile,music:msg.music,sports:msg.sports,food:msg.food,shows:msg.shows},{w: 1}, function(err, about){
                if (about.insertedCount>0) {
                  console.log("document inserted");
                  res.code = "201";
                  callback(null,res);
                } else {
                  console.log("User record has been created successfully");
                  res.code = "401" ;
                  callback(null,res);
                }
            });
          }
      });

}

exports.handle_request = handle_request;
