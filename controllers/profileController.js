var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
//var measurePerformance = require('.././lib/measurePerformance.js');
//model
var bcrypt = require('bcryptjs');// Load the bcrypt module
var salt = bcrypt.genSaltSync(10);// Generate a salt
var models = require('.././models');


// -------------------------------------------------------------------------------------//



router.get('/', function(req, res) {
	if (req.session && req.session.user) { 
		models.user.findAll().then(function (user) {
		  	res.render('profile', { 
					user: req.session.user,
					userDirectory : user,
					onlineUsers: onlineUsers.getOnlineUsers()
					});
				});
	}else {
    res.redirect('/signin');
  }
});


router.get('/profile', function(req, res, next) {
	res.render('profile', { error: ""});
});

//handle user signup request
router.post('/update', function(req, res, next){
		var username = req.body.username;
		var pwd_hash = bcrypt.hashSync(req.body.password, salt);
		
		models.user.update(
		  {
			  username: req.body.new_username,
			  password: pwd_hash,
			  accountStatus: req.body.accountStatus,
			  roleid: req.body.roleid
		  },
		  {
		    where: { username: username }
		  })
		  .then(function (result) { 
			  res.redirect('/profile');
		  })
		  .error(function (e) {
			  console.log(e);
		  });
		
		
		
		// models.user.findOne({
// 		  where: {
// 		    username: username
// 		  }
// 		}).then(function (result) {
// 				// Hash the password with the salt
// 				var pwd_hash = bcrypt.hashSync(req.body.password, salt);
//
// 				models.user.update({
// 					username: req.body.new_username,
// 					password: pwd_hash,
// 					accountStatus: req.body.accountStatus,
// 					roleid: req.body.roleid
// 				}).then(function() {
// 					res.render('profile', { error: ""});
// 			  });
//
//
// 		});



});


module.exports = router;