
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
var moment = require('moment');
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of addMember:"+ JSON.stringify(msg));
    var now = moment();
    createdDate = now.format('YYYY-MM-DD HH:mm:ss');

              connectionPooling.insertOne('Groups',{username: msg.memberName,groupName:msg.GroupName, owner:"false",addedBy:msg.username,addedDate:createdDate },{w: 1}, function(err, member){
                  if (member.insertedCount>0) {
                    console.log("Member Addition successful");
                    res.code="201";
                    callback(null, res);
                  } else {
                    console.log("Member Addition unsuccessful");
                    res.code ="401";
                    callback(null, res);
                  }
              });


}

exports.handle_request = handle_request;
