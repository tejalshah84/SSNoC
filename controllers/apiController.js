var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');
var util = require('.././util/util.js');
var create = require('.././util/createUtil.js');
var onlineUsers = require('.././lib/onlineUsers.js');
// -------------------------------------------------------------------------------------//

//**************************** Users ****************************//

//Retrieve all users
router.get('/users', function(req, res) {
	models.user.all(models, function(users){
		res.type('json').status(200).send(users);
	});
});

// GET all online users 
router.get('/users/online', function(req, res) {
	models.user.findAll().then(function (users) {
		var list = util.divideUsers(users);
		res.type('json').status(200).send(list);
	});
});

//Retrieve a user's record
router.get('/users/:user', function(req, res) {
	if(util.isInteger(req.params.user)){
		models.user.findById(models, req.params.user, function(user){
 	 		res.type('json').status(200).send(user);
		});
	}else{
		models.user.findByUsername(models, req.params.user, function(user){
			res.type('json').status(200).send(user);
		});
	} 
});

//Updates a user's record
router.put('/users/:id', function(req, res) {
	 
});

//Retrieve all users with whom a user has privately chat with
router.get('/users/chatbuddies/:user', function(req, res) {
});	
//**************************** Messages ****************************//

//Post an announcements 
router.post('/messages/announcement', function(req, res){
	create.createAnnouncement(req.body, function(){
		res.type('json').status(200).send();
	})
});

router.get('/messages/announcement/latest', function(req, res) {
	models.announcement.findAll({
		include: [{model: models.user, attributes: ['id','username']}],
		  order: [['id','DESC']], 
		  limit: 1
	}).then(function (announce) {
		res.json(announce[0]);
	});
});

//Retrieve all announcements 
router.get('/messages/announcement', function(req, res){
	models.announcement.findAll().then(function (announce) {
		  res.json(announce);
	});
});

//get Announce
router.get('/messages/announcement/:id', function(req, res) {
	models.announcement.findAll({
	  where: {
	    id: req.params.id
	  }
	}).then(function (announce) {
		  res.json(announce);
	});
});

// Public Messages
router.get('/messages/wall', function(req, res){
	models.chathistory.findAll({					
		include: [{model: models.user, attributes: ['id','username']}],
		order: [['id','ASC']]
	}).then(function (msg) {
		res.json(msg);
	}).catch(function (err){
		console.log(err)
	});
});

//Retrieve a public wall message by ID
router.get('/messages/wall/:id', function(req, res){
	models.chathistory.findAll({
		  where: {
		    id: req.params.id
		  }
		}).then(function (msg) {
			  res.json(msg);
		});
});

//Post a message on public wall from a user
router.post('/messages/wall', function(req, res){
	//console.log(req.body);
	create.createPublicMessage(req.body, function(){
		res.type('json').status(200);
	});
});

//Retrieve all private messages with all users with whom a user has privately done chat with
router.get('/messages/privatechat/:sender', function(req, res){
		models.privatechathistory.findAll({
		  attributes: ['id','chatauthor_id', 'chattarget_id','chatmessage', 'timestamp', 'createdAt'],
		   include: [{model: models.user, as: 'usertarget_id', attributes: ['username']},
		            {model: models.user, as: 'userauthor_id', attributes: ['username'], 
			        where: {username: req.params.sender}}],
		}).then(function (privmessages) {
		  res.json(privmessages);
		});
});

//Retrieve all private messages between sender and receiver
router.get('/messages/privatechat/:sender/:receiver', function(req, res){
	if(!util.isInteger(req.params.sender)){
	models.privatechathistory.findAll({
	  attributes: ['id','chatauthor_id', 'chattarget_id','chatmessage', 'timestamp', 'createdAt'],
	   include: [{model: models.user, as: 'usertarget_id', attributes: ['username'],where: {username: req.params.receiver}},
	            {model: models.user, as: 'userauthor_id', attributes: ['username'], 
		        where: {username: req.params.sender}}],
	}).then(function (privmessages) {
	  res.json(privmessages);
	});
	}else{
		models.privatechathistory.findAll({
			where: {
			chatauthor_id: req.params.sender,
			chattarget_id: req.params.receiver
			}
			}).then(function (msg) {
				res.json(msg); 
			});	
	}
});

//Retrieve a private wall message by ID
/*router.get('/messages/privatechat/:id', function(req, res){
	models.privatechathistory.findAll({
		  where: {
		    id: req.params.id
		  }
		}).then(function (privmsg) {
			  res.json(privmsg);
		});
});*/

//Retrieve all private chat messages between two users
//router.get('/messages/privatechat/:sender_id/:receiver_id', function(req, res){
//});

//Send a chat message to another user
router.post('/messages/privatechat/sender/receiver', function(req, res){
	create.createPrivateMessage(req.body, function(){
		res.type('json').status(200);
	})
});



module.exports = router;