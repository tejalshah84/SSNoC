var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
//importing models
var models = require('.././models');

// -------------------------------------------------------------------------------------//


var ifSignIn = function (req, res, next) {
	if (req.session && req.session.user) { 
		console.log('~~~~~~~~~~~~~~~ Session exist!!!');
		next();
	}else{
		res.redirect('/');
	}  
}

// GET all messages
router.get('/deck', ifSignIn, function(req, res) {
	models.user.findAll().then(function (user) {	
		var users = user;
		
		  	res.render('missing', { 
					user: req.session.user,
					userDirectory : users,
					onlineUsers: onlineUsers.getOnlineUsers()
					});

	});
	
});

// GET all messages
router.get('/', function(req, res) {
	
});

//get message
router.get('/:id', function(req, res) {
	
});

//create message
router.post('/', function(req, res) {
  res.send('respond with a resource');
});







module.exports = router;
