
var connectionPooling = require("./connectionPooling");
var path = './public/uploads/';
function handle_request(msg, callback){

    var res = {};
    console.log("In handle request of starFile:"+ JSON.stringify(msg));

    reqUsername = msg.username;
    reqFileName = msg.filename;
      connectionPooling.findOneAndUpdate('Groups',{username: reqUsername,filename : reqFileName },{$set: {canView:!canView}},function(err, fileList){
        if (err) {
            console.log("In err");
            res.code ="401";
            callback(null, res);

        }
        else if (fileList) {
            res.code="201";
            console.log("In fileList");
            callback(null, res);
        }
        else
        {
          console.log(err);
          console.log("Starring failed");
          console.log("In else");
          res.code ="401";
          callback(null, res);
        }
      });

}

exports.handle_request = handle_request;
