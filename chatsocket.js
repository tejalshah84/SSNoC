
//importing models
var sequelize = require('./sequelize');
var onlineUsers = require('./lib/onlineUsers.js');
var models = require('./models');

var privateRooms = {};
var socket_server = "";
var create = require('./util/createUtil.js');


module.exports = function(io) {

// Handle socket traffic
io.on('connection', function(socket){
  console.log('a user connected');
	console.log('***************************');
 	console.log ("Checking Rooms sockets");
  console.log (socket.id);
	console.log('***************************');

	
	//need to be refactored
  socket.on('change status', function(data) {
		models.user.findOne({
		  where: {
		    id: data.userid
		  }
		}).then(function (result) {
			result.update({
			statusid: data.status_id
		}).then(function() {
			io.sockets.emit('new status', {
				userid: data.userid,
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
 
			models.user.findOne({
				where: {id: data.chatauthor_id}
			}).then(function(user) {
    			models.privatechathistory.create({ 
		          	chatauthor_id: data.chatauthor_id,
		          	chattarget_id: data.chattarget_id,
		          	chatmessage: data.chatmessage, 
		            timestamp: data.timestamp
       			}).then(function() {
       				console.log(privateRooms[data.chatauthor_id]);
						console.log("----- taget's socketid: "+onlineUsers.getOnlineUsers()[data.chattarget_id]['socket_id']);
							
				//create.createPrivateMessage(data, function(){
							io.sockets.to([onlineUsers.getOnlineUsers()[data.chattarget_id]['socket_id']]).emit('private chat',{

       							chatauthor_id: data.chatauthor_id,
       							chatauthor: data.chatauthor,
       							chatmessage: data.chatmessage,
    							timestamp: data.timestamp
    				});
       		//});   	
				});			
    	 		});  

    });
		
		//needs to be done
    socket.on('push notification',function(data){
			console.log("Received push notification request!");
			console.log(data);
    	date = new Date();
			console.log(onlineUsers.getOnlineUsers());	
    	models.privatechathistory.create({ 
          	chatauthor: data.founder,
          	chattarget: data.reporter_userid,
          	chatmessage: data.chatmessage, 
            timestamp: date
       		}).then(function() {
		
			//create.createPrivateMessage(data, function(){		
						io.sockets.to([onlineUsers.getOnlineUsers()[data.chattarget_id]['socket_id']]).emit('new notification', {
							chatauthor: data.chatauthor_id,
							chatauthor_id: 3
						});
			});			
       		//});   	
					
			
			
    	
    });
  
	
		//done
	  socket.on('new announcement', function(data) {
			models.user.findById(models, data.publisher_userid, function(user){
				create.createAnnouncement(data, function(){
					io.sockets.emit('new annoucement', {
		   			publisher_username: user.username,
		   			content: data.content,
						createdAt: data.createdAt
					});	
				});
			});

	   });
  
	 //done
    socket.on('new message', function(data) {
			models.user.findOne({where: {id: data.chatauthor_id}
			}).then(function(user) {
				console.log(user);
				create.createPublicMessage(data, function(){
					io.sockets.emit('new message', {
   					chatauthor: user.username,
   					chatmessage: data.chatmessage,
						timestamp: data.timestamp
					});
		   });		
		});
    });
});


};

