
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of memberDetails:"+ JSON.stringify(msg));

    connectionPooling.find('Groups',{groupName: msg.groupName,owner:"false"},function(err, members){
      if (err) {
        res.code = "401";
        res.value = "Error fetching the data";
        callback(null,res);
      }
      else if (members.length>0) {
        res.code = "200";
        res.value = members;
        callback(null,res);
      }
      else{
        res.code = "401";
        res.value = "Error fetching the data";
        callback(null,res);
      }
    });
}

exports.handle_request = handle_request;
