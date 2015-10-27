
//importing models
var sequelize = require('./sequelize');
var onlineUsers = require('./lib/onlineUsers.js');
var Announce = require('./models/announcement.js');
var Msg = require('./models/message.js');
var User = require('./models/user.js');

var PrivMsg = require('./models/privatechat.js');
var privateRooms = {};
var socket_server = "";



module.exports = function(io) {

// Handle socket traffic
io.on('connection', function(socket){
  console.log('a user connected');
	console.log('***************************');
 	console.log ("Checking Rooms sockets");
  console.log (socket.id);
	console.log('***************************');

	
	//socket change status
  socket.on('change status', function(data) {
   console.log("******** Handling change status!");
   console.log("current_user: "+data.username);
		User.findOne({
		  where: {
		    username: data.username
		  }
		}).then(function (result) {
			result.update({
			statusid: data.status_id
		}).then(function() {
			console.log("Succefully status!");
			io.sockets.emit('new status', {
				username: data.username,
				statusid: data.status_id
			});	
		});
  	});
	});

	
	
  socket.on('setUserSocketID',function(data){
		onlineUsers.addUsersSocketID(data.username, socket.id);
  });
	

	//Socket connections for Private Chat
  socket.on('setUsername',function(data){
	  console.log('Fetching Target Socket id');
	  console.log(data); 
 	 //privateRooms[data.chattarget]= socket.id;
	  privateRooms[data.chatauthor]= socket.id;
	 console.log ("Checking Rooms sockets");
	  console.log (privateRooms);
  });
  
  
    socket.on('PrivateChatMsg',function(data){
    	date = new Date();
    	console.log ("PrivateChat Msg sockets************"); 
    	PrivMsg.create({ 
          	chatauthor: data.chatauthor,
          	chattarget: data.chattarget,
          	chatmessage: data.chatmessage, 
            timestamp: date
       		}).then(function() {
       			console.log("Private Msg created!!!!!!!!!!!");
       			console.log(privateRooms[data.chatauthor]);
       			//socket_server.sockets.socket(socket.id).emit('PrivateChatMsg', {
       			//socket.broadcast.to(socket.id).emit('PrivateChatMsg', {	
       			//io.sockets.socket(privateRooms[data.chattarget]).emit('PrivateChatMsg', {
				
       	//	io.to(privateRooms[data.chatauthor]).emit('PrivateChatMsg', {
       			//socket.sockets.emit('PrivateChatMsg', {
							console.log("----- taget's socketid: "+onlineUsers.getOnlineUsers()[data.chattarget]['socket_id']);
							io.sockets.to([onlineUsers.getOnlineUsers()[data.chattarget]['socket_id']]).emit('private chat',{
       					chatauthor: data.chatauthor,
       				chattarget: data.chattarget,
       				chatmessage: data.chatmessage,
    					createdAt: date
    				});
       			//io.sockets.socket(privateRooms[data.chatauthor]).emit('PrivateChatMsg', data);
       			//io.sockets.emit('PrivateChatMsg',data);
       			//socket.broadcast.to(socket.id).emit('PrivateChatMsg', data);
       		});   	
    	
    });
  
  
  

  
   socket.on('new announcement', function(data) {
	   console.log("******** Handling new announcement!");
	   console.log("current_user: "+data.publisher_username);
   		Announce.create({ 
   			publisher_username: data.publisher_username,
   			content: data.content,
			createdAt: data.createdAt
   		}).then(function() {
   			console.log("Announcement created!");
			io.sockets.emit('new annoucement', {
   			publisher_username: data.publisher_username,
   			content: data.content,
				createdAt: data.createdAt
			});
   		});
   });
	 
	 
    socket.on('new message', function(data) {
			console.log("******** Handling new message!");
			date = new Date();
   		Msg.create({ 
      	chatauthor: data.chatauthor,
        timestamp: date,
        chatmessage: data.chatmessage  			
   		}).then(function() {
   			console.log("Msg created!");
				io.sockets.emit('new message', {
   				chatauthor: data.chatauthor,
   				chatmessage: data.chatmessage,
					createdAt: date
				});
   		});
    

 
    });


});


};
