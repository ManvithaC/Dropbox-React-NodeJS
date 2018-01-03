var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var signup = require('./services/signup');
var getfiles = require('./services/getfiles');
var upload = require('./services/upload');
var shareFile = require('./services/shareFile');
var get_user_about = require('./services/get_user_about');
var Submit_User_About_Details = require('./services/Submit_User_About_Details');
var starFile = require('./services/starFile');
var unstarFile = require('./services/unstarFile');
var createFolder = require('./services/createFolder');
var deleteFile = require('./services/deleteFile');
var userActivity = require('./services/userActivity');
var recentFiles = require('./services/recentFiles');
var createGroup = require('./services/createGroup');
var getGroups = require('./services/getGroups');
var deleteGroup = require('./services/deleteGroup');
var addMember = require('./services/addMember');
var memberDetails = require('./services/memberDetails');
var deleteMember = require('./services/deleteMember');


console.log('server is running');
var producer = connection.getProducer();

var starFile_topic = connection.getConsumer('starUnstar_topic');
starFile_topic.on('message', function (message) {
    console.log('message received starFile_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    if(data.data.sub_topic === "starFile"){
      starFile.handle_request(data.data, function(err,res){
            console.log('after handle in starFile_topic - server.js '+ res.value);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
      }
      else if(data.data.sub_topic === "unstarFile"){
        unstarFile.handle_request(data.data, function(err,res){
            console.log('after handle in unstarFile_topic - server.js '+ res.value);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });

      }
});

var consumer_login_topic = connection.getConsumer('login_topic');
consumer_login_topic.on('message', function (message) {
    console.log('message received consumer_login_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    login.handle_request(data.data, function(err,res){
        console.log('after handle in login_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var consumer_signup_topic = connection.getConsumer('signup_topic');
consumer_signup_topic.on('message', function (message) {
    console.log('message received in consumer_signup_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    signup.handle_request(data.data, function(err,res){
        console.log('after handle in signup_topic server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var consumer_getfiles_topic = connection.getConsumer('getfiles_topic');
consumer_getfiles_topic.on('message', function (message) {
    console.log('message received in consumer_getfiles_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    getfiles.handle_request(data.data, function(err,res){
        //console.log('after handle in server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log("data sent form getfiles_topic producer: " + data);
        });
        return;
    });
});

var consumer_recentFiles_topic = connection.getConsumer('recentFiles_topic');
consumer_recentFiles_topic.on('message', function (message) {
    console.log('message received in consumer_recentFiles_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    recentFiles.handle_request(data.data, function(err,res){
        //console.log('after handle in server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log("data sent form recentFiles_topic producer: " + data);
        });
        return;
    });
});

var consumer_upload_topic = connection.getConsumer('upload_topic');
consumer_upload_topic.on('message', function (message) {
    console.log('message received in consumer_upload_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    upload.handle_request(data.data, function(err,res){
        console.log('after handle in upload_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var consumer_deleteFile_topic = connection.getConsumer('deleteFile_topic');
consumer_deleteFile_topic.on('message', function (message) {
    console.log('message received in deleteFile_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    deleteFile.handle_request(data.data, function(err,res){
        console.log('after handle in deleteFile_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var consumer_shareFile_topic = connection.getConsumer('shareFile_topic');
consumer_shareFile_topic.on('message', function (message) {
    console.log('message received in consumer_shareFile_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    shareFile.handle_request(data.data, function(err,res){
        console.log('after handle in shareFile_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});



var createFolder_topic = connection.getConsumer('createFolder_topic');
createFolder_topic.on('message', function (message) {
    console.log('message received createFolder_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    createFolder.handle_request(data.data, function(err,res){
        console.log('after handle in createFolder_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var createGroup_topic = connection.getConsumer('createGroup_topic');
createGroup_topic.on('message', function (message) {
    console.log('message received createGroup_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    createGroup.handle_request(data.data, function(err,res){
        console.log('after handle in createGroup_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var deleteGroup_topic = connection.getConsumer('deleteGroup_topic');
deleteGroup_topic.on('message', function (message) {
    console.log('message received deleteGroup_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    deleteGroup.handle_request(data.data, function(err,res){
        console.log('after handle in deleteGroup_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var addMember_topic = connection.getConsumer('addMember_topic');
addMember_topic.on('message', function (message) {
    console.log('message received addMember_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    addMember.handle_request(data.data, function(err,res){
        console.log('after handle in addMember_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var deleteMember_topic = connection.getConsumer('deleteMember_topic');
deleteMember_topic.on('message', function (message) {
    console.log('message received deleteMember_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    deleteMember.handle_request(data.data, function(err,res){
        console.log('after handle in deleteMember_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var getGroups_topic = connection.getConsumer('getGroups_topic');
getGroups_topic.on('message', function (message) {
    console.log('message received getGroups_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    getGroups.handle_request(data.data, function(err,res){
        console.log('after handle in getGroups_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var memberDetails_topic = connection.getConsumer('memberDetails_topic');
memberDetails_topic.on('message', function (message) {
    console.log('message received memberDetails_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    memberDetails.handle_request(data.data, function(err,res){
        console.log('after handle in memberDetails_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var consumer_userActivity_topic = connection.getConsumer('userActivity_topic');
consumer_userActivity_topic.on('message', function (message) {
    console.log('message received userActivity_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    userActivity.handle_request(data.data, function(err,res){
        console.log('after handle in userActivity_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var consumer_AboutSubmit_topic = connection.getConsumer('AboutSubmit_topic');
//var producer_AboutSubmit_topic = connection.getProducer();
consumer_AboutSubmit_topic.on('message', function (message) {
    console.log('message received in consumer_AboutSubmit_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    Submit_User_About_Details.handle_request(data.data, function(err,res){
        console.log('after handle in AboutSubmit_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

var consumer_Get_User_About_topic = connection.getConsumer('Get_User_About_topic');
//var producer_Get_User_About_topic = connection.getProducer();
consumer_Get_User_About_topic.on('message', function (message) {
    console.log('message received in Get_User_About_topic - server.js');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    get_user_about.handle_request(data.data, function(err,res){
        console.log('after handle in Get_User_About_topic - server.js '+ res.value);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

// consumer_getfiles_topic.addTopics([
//   { topic: login_topic, partition: 0, offset: 0}
// ], () => console.log("topic "+login_topic+" added to consumer for listening"));
