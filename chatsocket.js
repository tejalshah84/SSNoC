
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
	console.log(onlineUsers.getOnlineUsers());
	var onlineUserArray = onlineUsers.getOnlineUsers();
    
	for (var key in onlineUserArray) {
		
		 console.log(key + " -> " + onlineUserArray[key]);
		 for (var childKey in onlineUserArray[key]) {
			if (onlineUserArray[key][childKey] === 3) {
				console.log('Amrata is in for loop');
				var emerUser = key;
				console.log(childKey + " -> " + onlineUserArray[key][childKey]);
			  // socket.on('emergency status', function(data) {   
				   models.user.findOne({
						  where: {
						    id: key
						  }
						}).then(function(result) {
							  	 io.sockets.emit('emergency user', {
									loguser: key,
									userid: emerUser,
									username: result.username
								 }); 	
						});
			  // });
				  }
		}
		}
	
	
	
	//socket change status
  socket.on('change status', function(data) {
		models.user.findOne({
		  where: {
		    id: data.userid
		  }
		}).then(function (result) {
			result.update({
			statusid: data.status_id
		}).then(function(user) {
			io.sockets.emit('new status', {
				userid: data.userid,
				username: user.username,
				statusid: data.status_id
			});	
		});
  	});
	});

	
	
  socket.on('setUserSocketID',function(data){
		onlineUsers.addUsersSocketID(data.userid, socket.id);
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
			models.user.findOne({where: {id: data.chatauthor_id}
			}).then(function(user) {
    	models.privatechathistory.create({ 
          	chatauthor_id: data.chatauthor_id,
          	chattarget_id: data.chattarget_id,
          	chatmessage: data.chatmessage, 
            timestamp: date
       		}).then(function() {
       			console.log(privateRooms[data.chatauthor_id]);
						console.log("----- taget's socketid: "+onlineUsers.getOnlineUsers()[data.chattarget_id]['socket_id']);
							io.sockets.to([onlineUsers.getOnlineUsers()[data.chattarget_id]['socket_id']]).emit('private chat',{
					chatauthor_id: data.chatauthor_id,
					chatauthor: user.username,
       				chatmessage: data.chatmessage,
    					createdAt: date
    				});
       		});   	
    	 		});  
    });
  
  
  

  
   socket.on('new announcement', function(data) {
		models.user.findOne({where: {id: data.publisher_userid}
		}).then(function(user) {
   		models.announcement.create({ 
   			publisher_userid: user.id,
   			content: data.content,
			createdAt: data.createdAt
   		}).then(function() {
			io.sockets.emit('new annoucement', {
   			publisher_username: user.username,
   			content: data.content,
				createdAt: data.createdAt
			});
   		});
			});
   });
	 
	 
    socket.on('new message', function(data) {
			var date = new Date();
			
			models.user.findOne({where: {id: data.chatauthor_id}
			}).then(function(user) {
				console.log(user);
   		models.chathistory.create({ 
      	chatauthor_id: user.id,
        timestamp: date,
				createdAt: date,
				updateddAt: date,
        chatmessage: data.chatmessage  			
   		}).then(function() {
				io.sockets.emit('new message', {
   				chatauthor: user.username,
   				chatmessage: data.chatmessage,
					createdAt: date
				});
   		});
		});
		

    

 
    });


});


};

