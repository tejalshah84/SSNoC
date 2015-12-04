var express = require('express');
var router = express.Router();

var db = require('.././testdb'); //database
//model
var badUsername = require('.././lib/reservedNames.js');
var onlineUsers = require('.././lib/onlineUsers.js');

var bcrypt = require('bcryptjs');// Load the bcrypt module
var salt = bcrypt.genSaltSync(10);// Generate a salt
var util = require('.././util/util.js');

var models = require('.././models');


// -------------------------------------------------------------------------------------//

/* show signin page*/
router.get('/', function(req, res) {
	res.render('signin', { error: ""});
});

router.get('/signin', function(req, res, next) {
	res.render('signin', { error: ""});
});

router.get('/signout', util.ifSignIn, function(req, res){ 
		onlineUsers.removeOnlineUsers(req.session.user.id);
		req.session.destroy();
		res.redirect('/signin');
});

/* handle signin request*/
router.post('/', function(req, res){
	var username = req.body.username;
	
	models.user.findByUsername(models, username, function (result) {
		if(!result){
			// If the username isn't in the DB, reset the session and redirect the user to signup an account
			res.render('signin',{error: "Username not found!"});
		}else{  // If the user is in the DB, retrieve password and compare it	
			
			if(result.accountStatus==0)//If accountStatus is InActive, user could not signin
				{
					res.render('signin',{error: "Account is InActive!"});
				}
			
			var pwd_hash = result.password;
			var comparison = bcrypt.compareSync(req.body.password, pwd_hash);
			if(comparison){ //If pwd is correct, update new login time to DB and enter the welcome page	
				var date = new Date();//Get user login time
				//var logintime = date.toLocaleTimeString();
				
				
				models.user.loginTimeUpdate(models, {"username": result.username}, function(user) {
					req.session.user = result;
					req.session.isNewUser = false;
					req.session.newUserCount = 1;
					util.goOnline(result);
					res.redirect('/community');
			  });
				
				
			}else{
				res.render('signin',{error: "Password is incorrect!"});
			}		
		}
});
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { error: ""});
});

//handle user signup request
router.post('/signup', function(req, res){
	var username = req.body.username;
	if(badUsername.contains(username)){
		res.render('signup', {error: "Username not valid!"});				
	}else{
		models.user.findByUsername(models, username, function (result) {
			if(result){
				res.render('signup', {error: "Username already exists!"});				
			}else{
				var pwd_hash = bcrypt.hashSync(req.body.password, salt);	// Hash the password with the salt
				req.session.username = username;
				models.user.createUser(models, {"username": username, "password": pwd_hash}, function(user) {
					req.session.user = user;
					req.session.isNewUser = true;
					req.session.newUserCount = 0;
					util.goOnline(user);
					res.redirect('/community');
			  });
			}
		});
	}  
});

router.get('/community', util.ifSignIn, function(req, res) {
		++req.session.newUserCount;
		if (req.session.newUserCount > 1 ){
			req.session.isNewUser = false;
		}
		console.log(req.session.isNewUser);
		res.render('community', { // render the welcome page
			user: req.session.user,
			isNewUser: req.session.isNewUser,
			newUserCount: req.session.newUserCount,				
		});
});


router.get('/chat/:id', util.ifSignIn, function(req, res) {	
	req.params.id = Number(req.params.id);	
	if(req.params.id == req.session.user.id){
		res.redirect('/community');
	}	
  res.render('privatechat', { 
		user: req.session.user,
		targetName: req.params.id
	}); 
});


router.get('/searchpage', util.ifSignIn, function(req, res) {
	res.render('searchpage',{
		user: req.session.user
	  });	
});




module.exports = router;
