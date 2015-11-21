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
		res.json(users);
	});
});

// GET all online users 
router.get('/users/online', function(req, res) {
	models.user.findAll().then(function (users) {
		var list = util.divideUsers(users);
		res.json(list);
	});
});

//Retrieve a user's record
router.get('/users/:user', function(req, res) {
	if(isInteger(req.params.user)){
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




//Retrieve all users with whom a user has privately chatted with
router.put('/users/chatbuddies/:user', function(req, res) {
	 
});

//**************************** Messages ****************************//



//Post an announcements 
router.post('/messages/announcement', function(req, res){
	create.createAnnouncement(req.body, function(){
		res.type('json').status(200);
	})
});

router.get('/messages/announcement/latest', function(req, res) {
	models.announcement.findAll({
		  order:'id DESC', 
		  limit: 1
	}).then(function (announce) {
		models.user.findById(models, announce[0].publisher_userid, function(user){
			announce[0]['publisher_userid'] = user.username;
			res.json(announce);
		});
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
	
});

//Retrieve a message by ID
router.get('/messages/public/:id', function(req, res){
	
});

//Retrieve all private chat messages between two users
router.get('/messages/:sender/:receiver', function(req, res){
	
});

//Send a chat message to another user
router.post('/messages/:sender/:receiver', function(req, res){
	
});

//Post a message on public wall from a user
router.post('/messages/:user', function(req, res){
	
});









function isInteger(x) {
	return x % 1 === 0;
}

module.exports = router;