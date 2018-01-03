
var express = require('express');
var path = require('path');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
//var session = require('client-sessions');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var mkdirp = require('mkdirp');
var index = require('./routes/index');
var users = require('./routes/users');
require('./routes/passport')(passport);
var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo")(expressSessions);
var mongo = require('./routes/mongo');
var mongoURL = "mongodb://localhost:27017/login";

var app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}

app.use(cors(corsOptions));
app.use(expressSessions({
    secret: "CMPE273_I_KNOW_you_HaVe_one_TOO",
    resave: true,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: true, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 1 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL,
        ttl: 7 * 24 * 60 * 60 //1 week
         //ttl: 2 * 60 // 2 min
    })
}));
app.use(passport.initialize());

//Enable CORS
//app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.set('port', process.env.PORT || 3200);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(cookieParser());
//app.use(express.cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('./public/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.json('error');
});

module.exports = app;
