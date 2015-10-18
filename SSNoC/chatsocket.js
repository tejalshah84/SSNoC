
//importing models
var sequelize = require('./sequelize');
var onlineUsers = require('./lib/onlineUsers.js');
var Announce = require('./models/announcement.js');
var Msg = require('./models/message.js');
var privateRooms = {};

module.exports = function(io) {

// Handle socket traffic
io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('setUsername',function(data){
	  privateRooms[data.chatauthor]= socket.id;
	 // console.log ("Checking Rooms sockets");
	  console.log (privateRooms);
  });
  
  
    socket.on('PrivateChatMsg',function(data){
    	date = new Date();
    	console.log ("PrivateChat Msg sockets************"); 
    	Msg.create({ 
          	chatauthor: data.chatauthor,
          	chattarget: data.chattarget,
          	chattype: data.chattype,
          	chatmessage: data.chatmessage, 
            timestamp: date
       		}).then(function() {
       			console.log("Private Msg created!!!!!!!!!!!");
       			//io.sockets.socket(privateRooms[data.chatauthor]).emit('PrivateChatMsg', data);
       			io.sockets.emit('PrivateChatMsg',data);
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
        chattype: data.chattype,
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
