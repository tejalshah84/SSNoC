
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

	
	//need to be refactored
  socket.on('change status', function(data) {
		models.user.updateUserStatus(models, data, function(user){
			io.sockets.emit('new status', {
				userid: data.userid,
				statusid: data.status_id
			});	
		});
	});

	
  socket.on('setUserSocketID',function(data){
		onlineUsers.addUsersSocketID(data.userid, socket.id);
  });
	


	//Fetching socket.id for Private Chat
  socket.on('setUsername',function(data){
	  	  privateRooms[data.chatauthor]= socket.id;
  });
  
  
  
  

  
  //Socket trigger performing private msg DB insertion
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
       						console.log(onlineUsers.getOnlineUsers());				
       						var onlinetarget = 	(onlineUsers.getOnlineUsers().hasOwnProperty(data.chattarget_id))	
       						if(onlinetarget){	
       							console.log('testing priv chat');	
										io.sockets.to([onlineUsers.getOnlineUsers()[data.chattarget_id]['socket_id']]).emit('private chat',{
       								chatauthor_id: data.chatauthor_id,
       								chatauthor: data.chatauthor,
       								chatmessage: data.chatmessage,
    									timestamp: data.timestamp
    								});   	
										io.sockets.to([onlineUsers.getOnlineUsers()[data.chattarget_id]['socket_id']]).emit('new notification chat',{
       								chatauthor_id: data.chatauthor_id,
       								chatauthor: data.chatauthor,
    								}); 
									}
						});			
    	 	});  
    });
		
		//needs to be done
    socket.on('push notification',function(data){
			console.log("Received push notification request!");
			console.log(data);
    	date = new Date();
			console.log(onlineUsers.getOnlineUsers());	
    	/*models.privatechathistory.create({ 
		          	chatauthor_id: data.founder_id,
		          	chattarget_id: data.reporter_userid,
		          	chatmessage: data.chatmessage, 
								timestamp: new Date()
          	
       		}).then(function() {		*/
			models.privatechathistory.createPrivMessage(models,data, function(){
						io.sockets.to([onlineUsers.getOnlineUsers()[data.reporter_userid]['socket_id']]).emit('new notification', {
							chatauthor: data.founder,
							chatauthor_id: data.founder_id
						});
			});			
       		//});     	
    });
  
	
		//done
	  socket.on('new announcement', function(data) {
			models.user.findById(models, data.publisher_userid, function(user){
				models.announcement.createAnnouncement(models, data, function(){
					io.sockets.emit('new annoucement', {
		   			publisher_username: user.username,
		   			content: data.content,
						createdAt: data.createdAt
					});	
				});
			});

	   });
  
	
	  //Socket trigger performing public msg DB insertion//done
    socket.on('new message', function(data) {
			models.user.findOne({where: {id: data.chatauthor_id}
			}).then(function(user) {
				console.log(user);
				//create.createPublicMessage(data, function(){
				models.chathistory.createPubMessage(models,data, function(){
					io.sockets.emit('new message', {
   					chatauthor: user.username,
   					chatmessage: data.chatmessage,
						timestamp: data.timestamp
					});
		   });		
		});
    });
		
	// when the user disconnects.. perform this
	  socket.on('disconnect', function () {
			 console.log('user disconnected');
	    // remove the username from global usernames list
	  });
});




};

