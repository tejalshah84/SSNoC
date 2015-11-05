
//importing models
var sequelize = require('./sequelize');
var onlineUsers = require('./lib/onlineUsers.js');
var models = require('./models');

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
		models.user.findOne({
		  where: {
		    username: data.username
		  }
		}).then(function (result) {
			result.update({
			statusid: data.status_id
		}).then(function() {
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
	  privateRooms[data.chatauthor]= socket.id;
	 	console.log ("Checking Rooms sockets");
	  console.log (privateRooms);
  });
  
  
    socket.on('PrivateChatMsg',function(data){
    	date = new Date();
    	models.privatechathistory.create({ 
          	chatauthor: data.chatauthor,
          	chattarget: data.chattarget,
          	chatmessage: data.chatmessage, 
            timestamp: date
       		}).then(function() {
       			console.log(privateRooms[data.chatauthor]);
						console.log("----- taget's socketid: "+onlineUsers.getOnlineUsers()[data.chattarget]['socket_id']);
							io.sockets.to([onlineUsers.getOnlineUsers()[data.chattarget]['socket_id']]).emit('private chat',{
       					chatauthor: data.chatauthor,
       				chattarget: data.chattarget,
       				chatmessage: data.chatmessage,
    					createdAt: date
    				});
       		});   	
    	
    });
  
  
  

  
   socket.on('new announcement', function(data) {
   		models.announcement.create({ 
   			publisher_username: data.publisher_username,
   			content: data.content,
			createdAt: data.createdAt
   		}).then(function() {
			io.sockets.emit('new annoucement', {
   			publisher_username: data.publisher_username,
   			content: data.content,
				createdAt: data.createdAt
			});
   		});
   });
	 
	 
    socket.on('new message', function(data) {
			date = new Date();
   		models.chathistory.create({ 
      	chatauthor: data.chatauthor,
        timestamp: date,
        chatmessage: data.chatmessage  			
   		}).then(function() {
				io.sockets.emit('new message', {
   				chatauthor: data.chatauthor,
   				chatmessage: data.chatmessage,
					createdAt: date
				});
   		});
    

 
    });


});


};
