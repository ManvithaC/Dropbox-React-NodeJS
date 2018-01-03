var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var bcrypt = require('bcrypt');
var kafka = require('./kafka/client');

module.exports = function(passport) {


      passport.use('signup', new LocalStrategy({
        usernameField :'SignUpusername',
        passwordField:'SignUppassword',
        passReqToCallback : true
      },function(req, username, password,done,SignUpfirstname,SignUplastname) {
      console.log('in signup strategy - passport.js');
      console.log("username: " + username);
      //console.log("Firstname: " + req.body.SignUpfirstname);
      kafka.make_request('signup_topic',{"firstname":req.body.SignUpfirstname,"username":username,"password":password,"lastname":req.body.SignUplastname}, function(err,results){
      console.log('in result- signup strategy - passport.js');
      console.log(results);
      if(err){
          done(err,{});
      }
      else
      {
          if(results.code == 201){
              done(null,results);
          }
          else {
              console.log("passport.js - no user fetched");
              done(null,false);
          }
      }
        });
      }));

      // passport.use('login', new LocalStrategy(function(username, password, done) {
      //         try {
      //             mongo.connect(mongoURL, function(){
      //                 console.log('Connected to mongo at: ' + mongoURL);
      //                 var coll = mongo.collection('login');
      //                 //console.log('user'+username+password);
      //                 coll.findOne({username:username}, function(err, user){
      //                     if (user) {
      //                       if(bcrypt.compareSync(password, user.password)){
      //
      //                         console.log('user');
      //                           done(null, user);
      //                       }
      //
      //
      //                     } else {
      //                       console.log('err');
      //                         done(null, false);
      //                     }
      //                 });
      //             });
      //         }
      //         catch (e){
      //             done(e,{});
      //         }
      //     }));

    passport.use('login', new LocalStrategy(function(username, password, done) {
    console.log('in login strategy - passport.js');
    kafka.make_request('login_topic',{"username":username,"password":password}, function(err,results){
    console.log('in result- login strategy - passport.js');
    console.log(results);
    if(err){
        done(err,{});
    }
    else
    {
        if(results.code == 200){
            done(null,results);
        }
        else {
            console.log("passport.js - no user fetched");
            done(null,false);
        }
    }
      });
    }));


};
