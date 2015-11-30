var models = require('.././models');


exports.createUser = function(data, callback){
	models.user.create({ 
		
	}).then(function(user) {		
		console.log("New User Created!");
		callback(user['dataValues']);
	});
};

exports.createPublicMessage = function(data, callback){
	models.chathistory.create({ 
		chatauthor_id: data.chatauthor_id,
		chatmessage: data.chatmessage,
		timestamp:new Date()		
	}).then(function(message) {		
		console.log("New Message Created!");
		callback(message['dataValues']);
	});
};

exports.createPrivateMessage = function(data, callback){
	models.privatechathistory.create({ 
		chatauthor_id: data.chatauthor_id,
      	chattarget_id: data.chattarget_id,
      	chatmessage: data.chatmessage, 
        timestamp: new Date()
	}).then(function(message) {		
		console.log("New Private Message Created!");
		callback(message['dataValues']);
	});
};

exports.createAnnouncement = function(data, callback){
	models.user.findById(models, data.publisher_userid, function(user){
		models.announcement.create({ 
			publisher_userid: user.id,
			content: data.content,
			createdAt: data.createdAt
		}).then(function() {
			console.log("New Announcement Created!");
			callback();
		});
	});
	
};

