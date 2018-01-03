var express = require('express');
var router = express.Router();
var multer = require('multer');
var glob = require('glob');
var bcrypt = require('bcrypt');
var formidable = require('formidable'),
util = require('util');
var fs=require('fs');
var tokenPass = 'CMPE_273_MANJE_OCT2017';
var mkdirp = require('mkdirp');
var moment = require('moment');
var path = require('path');
var passport = require('passport');
require('./passport')(passport);
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/login";
var user;
var multerFolderName = '/';
var kafka = require('./kafka/client');

router.post('/welcome', function(req,res,next) {
  console.log("session username in /welcome - "+req.session.user);
  if(req.session.user)
  {
     console.log("in welcome- session still valid");
       res.status(200).json({message: "Session is still valid"});
  }
  else
  {
    console.log("session not valid");
    req.session.destroy();
    res.status(401).json({message: "Session is not valid"});
  }
});



router.post('/getfiles', function (req, res, next) {
  kafka.make_request('getfiles_topic',{  "username":req.session.user,"folderName":req.body.folderName}, function(err,results){
      console.log('in result - getfiles - users.js');
      if(err){
          done(err,{});
      }
      else {
        if(results.code == 200){
          console.log("results in getfiles users.js: "+ results.value);
                  res.status(200).send(results.value);
          }
          else{
              console.log("getfiles failed");
                  res.status(401).json({message: "getfiles failed"});
          }
      }
  });

});

router.post('/getrecentfiles', function (req, res, next) {
  console.log(req.session.user);
    kafka.make_request('recentFiles_topic',{"username":req.session.user}, function(err,results){
        console.log('in result - recentFiles - users.js');
        if(err){
            done(err,{});
        }
        else {
          if(results.code == 200){
            console.log("results in recentFiles users.js: "+ results.value);
                    res.status(200).send(results.value);
            }
            else{
                console.log("recentFiles failed");
                    res.status(401).json({message: "recentFiles failed"});
            }
        }
    });
});


router.post('/delete', function (req, res, next) {
  kafka.make_request('deleteFile_topic',{"username":req.session.user,"filePath":req.body.filePath,"fileName":req.body.fileName}, function(err,results){
      console.log('in result - deleteFile - users.js');
      if(err){
          done(err,{});
      }else {
        if(results.code == 201){
              res.status(201).json({message: "delete File successful"});
          }else {
              res.status(401).json({message: "delete File failed"});
          }
      }
  });
  });

router.post('/shareFile', function (req, res, next) {
if(req.body.shareToEmail){
  console.log("Share Email: "+req.body.shareToEmail);
  console.log("username: "+req.session.user);
    kafka.make_request('shareFile_topic',{"username":req.session.user,"reqFileName":req.body.filename,"reqShareToEmail":req.body.shareToEmail}, function(err,results){
        console.log('in result - shareFile - users.js');
        console.log("results message - in getfiles: " + results.value);
        if(err){
            done(err,{});
        }
        else {
          if(results.code == 200){
                res.status(200).json({message: "shareFile Successful"});
            }
            else if(results.code == 401){
                console.log("shareFile failed");
                res.status(401).json({message: "shareFile failed"});
            }
        }
    });
  }
  else if(req.body.shareToGroup){
console.log("Share to group: "+req.body.shareToGroup);
console.log("username: "+req.session.user);
  kafka.make_request('shareFile_topic',{"username":req.session.user,"reqFileName":req.body.filename,"shareToGroup":req.body.shareToGroup}, function(err,results){
      console.log('in result - shareFile - users.js');
      console.log("results message - in getfiles: " + results.value);
      if(err){
          done(err,{});
      }
      else {
        if(results.code == 200){
              res.status(200).json({message: "shareFile Successful"});
          }
          else if(results.code == 401){
              console.log("shareFile failed");
              res.status(401).json({message: "shareFile failed"});
          }
      }
  });
}
});


router.post('/createFolder', function (req, res, next) {
    kafka.make_request('createFolder_topic',{"username":req.session.user,"folderName":req.body.folderName,"folderPath":req.body.folderPath}, function(err,results){
        console.log('in result - starFile - users.js');
        if(err){
            done(err,{});
        }else {
          if(results.code == 200){
                res.status(200).json({message: "Createfolder successful"});
            }else {
                res.status(401).json({message: "Createfolder failed"});
            }
        }
    });
});

router.post('/createGroup', function (req, res, next) {
  console.log("GroupName: "+req.body.groupName);
    kafka.make_request('createGroup_topic',{"username":req.session.user,"GroupName":req.body.groupName}, function(err,results){
        console.log('in result - create Group - users.js');
        if(err){
            done(err,{});
        }else {
          if(results.code == 201){
                res.status(201).send(results.value);
                console.log('in result - create Group - 201');
            }else {
                res.status(401).json({message: "create Group failed"});
            }
        }
    });
});

router.post('/deleteGroup', function (req, res, next) {
  console.log("GroupName: "+req.body.groupName);
    kafka.make_request('deleteGroup_topic',{"username":req.session.user,"GroupName":req.body.groupName}, function(err,results){
        console.log('in result - delete Group - users.js');
        if(err){
            done(err,{});
        }else {
          if(results.code == 200){
                res.status(200).json({message: "delete Group failed"});
                console.log('in result - delete Group - 200');
            }else {
                res.status(401).json({message: "delete Group failed"});
            }
        }
    });
});

router.post('/addMember', function (req, res, next) {
  console.log("addMember: "+req.body.memberName+req.body.groupName);
    kafka.make_request('addMember_topic',{"username":req.session.user,"GroupName":req.body.groupName,"memberName":req.body.memberName}, function(err,results){
        console.log('in result - addMember Group - users.js');
        if(err){
            done(err,{});
        }else {
          if(results.code == 201){
                res.status(201).json({message: "addMember Group failed"});
                console.log('in result - addMember Group - 200');
            }else {
                res.status(401).json({message: "addMember Group failed"});
            }
        }
    });
});

router.post('/deleteMember', function (req, res, next) {
  console.log("deleteMember: "+req.body.memberName+req.body.groupName);
    kafka.make_request('deleteMember_topic',{"username":req.session.user,"GroupName":req.body.groupName,"memberName":req.body.memberName}, function(err,results){
        console.log('in result - addMember Group - users.js');
        if(err){
            done(err,{});
        }else {
          if(results.code == 201){
                res.status(201).json({message: "addMember Group failed"});
                console.log('in result - addMember Group - 200');
            }else {
                res.status(401).json({message: "addMember Group failed"});
            }
        }
    });
});

router.get('/getGroups', function (req, res, next) {
    kafka.make_request('getGroups_topic',{"username":req.session.user}, function(err,results){
        console.log('in result - getGroups - users.js');
        if(err){
            done(err,{});
        }else {
          if(results.code == 200){
                res.status(200).send(results.value);
                console.log('in result - getGroups - 200');
            }else {
                res.status(401).json({message: "getGroups failed"});
            }
        }
    });
});

router.post('/getMemberDetails', function (req, res, next) {
  //console.log("getMemberDetails" + req.body.groupName);
    kafka.make_request('memberDetails_topic',{"username":req.session.user,"groupName":req.body.groupName}, function(err,results){
        console.log('in result - getMemberDetails - users.js');
        if(err){
            done(err,{});
        }else {
          if(results.code == 200){
                res.status(200).send(results.value);
                console.log('in result - getMemberDetails - 200');
            }else {
                res.status(401).json({message: "getMemberDetails failed"});
            }
        }
    });
});

router.post('/logout', function (req, res, next) {
  req.session.destroy();
  console.log('Session destroyed');
  res.redirect('/');
});

router.get('/', function (req, res, next) {
  res.status(200).json({message: "Home page fetch successful"});
});

router.post('/doLogin', function (req, res, next) {
  // mongo.connect(mongoURL, function(){
  //         console.log('in doLogin-users.js-Connected to mongo at: ' + mongoURL);
  //         var coll = mongo.collection('login');
  //         //console.log("req - passport: "+msg.username+msg.password);
  //         coll.findOne({username: req.body.username}, function(err, user){
  //             if (user) {
  //               if(bcrypt.compareSync(req.body.password, user.password)){
  //                       //console.log("user found");
  //                       res.status(201).json({
  //                               message: "Login successful",
  //                               username: user.username
  //                             })
  //                       //res.username = user.username;
  //                     }
  //                     else{
  //                        res.status(401).json({message: "Login failed - error"});
  //                                   }
  //             } else {
  //                res.status(401).json({message: "Login failed - error"});
  //
  //             }
  //             //callback(null, res);
  //         });
  //
  //     });
  passport.authenticate('login', function(err, user) {
      if(err) {
        console.log("err");
        res.status(401).json({message: "Login failed - error"});
      }

      if(!user) {
        console.log("user");
        res.status(401).json({message: "Login failed - no password match"});
      }
      else{
        req.session.user = user.username;
        console.log(req.session.user);
        console.log("session initilized - ?");
        res.status(201).json({
          message: "Login successful",
          username: user.username
        })
      }
  })(req, res);
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        console.log("Multer File:" + file.fieldname);
        cb(null, file.fieldname)
    }
});

var upload = multer({storage:storage});

router.post('/upload', upload.any(),function (req, res, next) {
  reqFileName = req.files[0].filename;
  reqFilePath = req.files[0].destination;
  //reads the input file
    fs.readFile(reqFilePath+reqFileName, function (err, data) {
      if (err) throw err;
      //deletes the file after reading the bytes.
      fs.unlink(reqFilePath+reqFileName, function (err) {
        if (err) throw err;
        console.log('successfully deleted ' + reqFilePath+reqFileName);
      //sends the bytes through kafka and saves it in kafka
      kafka.make_request('upload_topic',{"username":req.session.user,"reqFilePath":reqFilePath,"reqFileName":reqFileName,"data":data}, function(err,results){
          console.log('in result - upload - users.js');
          if(err){
              done(err,{});
          }else {
            if(results.code == 201){
                  res.status(201).json({message: "File Upload successful"});
              }else {
                  res.status(401).json({message: "delete File failed"});
              }
          }
      });
      });
    });

});

router.post('/doSignUp', function (req, res, next) {
  console.log("doSignup");
  passport.authenticate('signup', function(err, user) {
      console.log(user);
      if(err) {
        res.status(401).json({message: "Signup failed"});
      }
      else if(user){
        res.status(201).json({message: "Signup successful"})
      }
      else{
        res.status(500).json({message: "User already exists"})
      }
  })(req, res);
});

router.post('/favoriteFile', function (req, res, next) {
  kafka.make_request('starUnstar_topic',{"sub_topic":"starFile","username":req.session.user,"filename":req.body.fileName}, function(err,results){
      console.log('in result - starFile - users.js');
      if(err){
          done(err,{});
      }else {
        if(results.code == 201){
                  res.status(201).json({message: "Star File successful"});
          }else {
                  res.status(401).json({message: "Star File failed"});
          }
      }
  });
});

router.post('/unFavoriteFile', function (req, res, next) {
  kafka.make_request('starUnstar_topic',{ "sub_topic":"unstarFile", "username":req.session.user,"filename":req.body.fileName}, function(err,results){
      console.log('in result - unstarFile - users.js');
      if(err){
          done(err,{});
      }else {
        if(results.code == 201){
                  res.status(201).json({message: "unStar File successful"});
          }else {
                  res.status(401).json({message: "unStar File failed"});
          }
      }
  });
});

router.post('/getUserActivity', function (req, res, next) {
  kafka.make_request('userActivity_topic',{ "username":req.session.user}, function(err,results){
      console.log('in result - userActivity_topic - users.js');
      if(err){
          done(err,{});
      }else {
        if(results.code == 200){
          console.log(results.value);
                res.status(200).send(results.value);
          }else {
                res.status(401).json({message: "unStar File failed"});
                console.log("some error in userActivity");
          }
      }
  });
});

router.post('/AboutSubmit', function (req, res, next) {
  kafka.make_request('AboutSubmit_topic',{  "username":req.session.user,"work":req.body.about_work,"education":req.body.about_education,"sec_email":req.body.about_secEmail,"mobile":req.body.about_mobile,"music":req.body.about_music,"sports":req.body.about_sports,"food":req.body.about_food,"shows":req.body.about_shows }, function(err,results){
      console.log('in result - AboutSubmit - users.js');
      if(err){
          done(err,{});
      }else {
        if(results.code == 201){
                  res.status(201).json({message: "User About Details update successful"});
          }else {
                  res.status(401).json({message: "User About Details update failed"});
          }
      }
  });
});
router.post('/About', function (req, res, next) {
  kafka.make_request('Get_User_About_topic',{  "username":req.session.user}, function(err,results){
      if(err){
          done(err,{});
      }else {
        if(results.code == 200){
                  res.status(200).send(results.value);
          }else {
                  res.status(401).json({message: "User About Details fetch failed"});
          }
      }
  });
});

router.get('/download', function (req, res, next) {
  var path = require('path');
  var pathFolder = 'H:\\lab2\\lab2-DropboxApp\\nodelogin\\public\\uploads\\';
  //var filePath = pathFolder + req.body.filename;
  console.log("filepath: "+filePath);
  //res.contentType("application/pdf");
  res.download(pathFolder);
  // res.download(filePath, function (err) {
  //      if (err) {
  //          console.log("Error");
  //          console.log(err);
  //      } else {
  //          console.log("Success");
  //      }
  //  });
  //res.status(200).json({message: "download successful"});
});
module.exports = router;
