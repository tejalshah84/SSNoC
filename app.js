var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
//var sequelize = require('./sequelize');
var models = require('./models');
var db_s = require('./testdb');



var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.io = io;

http.listen(8888, function(){
	console.log('listening on *:8888');
});


if(!module.parent){ 
	http.listen(8888, function(){
		console.log('listening on *:8888');
	});
}


// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
    


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: '1234567890QWERTY'}));
app.use(express.static(path.join(__dirname, 'public')));





var models = require('./models');




var onlineUsers = require('./lib/onlineUsers.js');
var measurePerformance = require('./lib/measurePerformance.js');

var socket_server = require('socket.io').listen(http);
require('./chatsocket')(socket_server);





//importing models
var Announce = require('./models/announcement.js');
var Msg = require('./models/publicwall.js');



var router = require('./controllers')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
