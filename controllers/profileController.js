'use strict';
/* jshint shadow:true */
/* jshint sub: true */
var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
//var measurePerformance = require('.././lib/measurePerformance.js');
//model
var bcrypt = require('bcryptjs');// Load the bcrypt module
var salt = bcrypt.genSaltSync(10);// Generate a salt
var models = require('.././models');
var util = require('.././util/util.js');


// -------------------------------------------------------------------------------------//

router.get('/', function(req, res) {
	if (req.session && req.session.user) { 
		models.user.findAll().then(function (user) {
			if(util.checkUserAccess(req) == 2){
		  	res.render('profile', { 
					user: req.session.user,
					userDirectory : user,
					onlineUsers: onlineUsers.getOnlineUsers()
					});
				}
			else res.redirect('/community');
				});
	}else {
    res.redirect('/signin');
  }
});

//
var isAdmin = function (req, res, next) {	
	if (util.checkUserAccess(req) == 2) { 
		next();
	}else{
		res.redirect('/community');
	}  
};


router.get('/profile', isAdmin, function(req, res, next) {
	
	res.render('profile', { error: ""});
});




router.post('/update', function(req, res, next){
		var username = req.body.username;
		var pwd_hash = bcrypt.hashSync(req.body.password, salt);
		
		
		models.user.adminUpdate(models, {"username": username, "password": pwd_hash, "roleid":req.body.roleid, "accountStatus":req.body.accountStatus}, function(user) {
					res.redirect('/profile');
			  });
});


module.exports = router;

