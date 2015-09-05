var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('C:\\Users\\Amrata\\node_modules\\socket.io')(http);
var path = require('path');
var sqlite3 = require("C:\\Users\\Amrata\\node_modules\\sqlite3").verbose();
var db = new sqlite3.Database('C:\\sqlite-3_6_23\\sqlite-3\\ChatUsers.db');
var db_user;
var db_msg;
var db_tstamp;

//Setting up directory name for route files and for stylesheets
app.use(express.static(__dirname));
app.use('/stylesheets', express.static(path.join(__dirname, '../public/stylesheets')));

//Chat app listening on PORT 3000
http.listen(3000, function(){
	console.log('listening on *:3000');
});

//route handle
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '../Public','login.html'));
});
app.get('/ongoingChat', function(req, res){	  
	res.sendFile(path.join(__dirname,'../Public', 'chat.html'));
});
app.get('/logout', function(req, res){	  
	res.sendFile(path.join(__dirname, '../Public','logout.html'));
});

//Registering events on socket connection
io.on('connection', function(socket){
	socket.on('chatMessage', function(from, msg,ctime){
		io.emit('chatMessage', from, msg,ctime);
		//inserting chat messages  in database
		var stmt = db.prepare("INSERT INTO users VALUES (?,?,?,?)");
		stmt.run(from,msg,'active',ctime);
		stmt.finalize();
	});

	//retrieving messages for history
	socket.on('retrieveMessage', function (data) {
		db.each("SELECT username, message, timestamp from users order by timestamp ASC", function(err, row) {
			db_user = row.username;
			db_msg =  row.message;
			db_tstamp = row.timestamp;
			data = db_user+"~"+db_msg+"~"+db_tstamp;
			socket.emit('oldMessages',data);
		});

	});	  
	socket.on('notifyUser', function(user){
		io.emit('notifyUser', user);
	});
});

