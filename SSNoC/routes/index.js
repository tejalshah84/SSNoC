var express = require('express');
var router = express.Router();


var db = require('.././testdb'); //database
//model
var sequelize = require('.././sequelize');
var user = require('.././models/user.js');
var badUsername = require('.././lib/reservedNames.js');

var bcrypt = require('bcryptjs');// Load the bcrypt module
var salt = bcrypt.genSaltSync(10);// Generate a salt

var User = require('.././models/user.js');
var Message = require('.././models/message.js');


// -------------------------------------------------------------------------------------//


/* show signin page*/
router.get('/', function(req, res) {
	res.render('signin', { error: ""});
});

router.get('/signin', function(req, res, next) {
	res.render('signin', { error: ""});
});

/* handle signin request*/
router.post('/', function(req, res){
	console.log("Handling signin...");
	console.log("Username: "+req.body.username);
	var username = req.body.username;
	//Retrieve Hash pwd from DB
	
	User.findOne({
		  where: {
		    username: username
	}
	}).then(function (result) {
		if(!result){
			// If the username isn't in the DB, reset the session and redirect the user to signup an account
			console.log("Redirected to signin-1");
			res.render('signin',{error: "Username not found!"});
		}
		else{  // If the user is in the DB, retrieve password and compare it
			
			var pwd_hash = result.password;
			var comparison = bcrypt.compareSync(req.body.password, pwd_hash);
			console.log("Comparing password...");
			if(comparison){ //If pwd is correct, update new login time to DB and enter the welcome page
			
				var date = new Date();//Get user login time
				//var logintime = date.toLocaleTimeString();
				result.update({
				  lastlogintime: date
				}).then(function() {
					req.session.user = result;
					req.session.isNewUser = false;
					console.log("Succefully signin!");
					res.redirect('/community');
				});
			}else{
				console.log("Password not correct...Redirected to signin");
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
	console.log("Handling signup...");
	console.log("Username: "+req.body.username);
	
	var username = req.body.username;

	if(badUsername.contains(username)){
		console.log("--- Invalid username");
		res.render('signup',{error: "Username not valid!"});				
	}else{
		console.log("--- valid username");
		User.findOne({
		  where: {
		    username: username
		  }
		}).then(function (result) {
			if(result){
				console.log("--- Existing username");
				res.render('signup',{error: "Username already exists!"});				
			}else{
				// Hash the password with the salt
				var pwd_hash = bcrypt.hashSync(req.body.password, salt);
			  var date = new Date();
			//  var logintime = date.toLocaleTimeString();
	
				req.session.username = username;
				User.create({ 
					username: username, 
					password: pwd_hash,
					firstname: "",
					lastname: "",
					statusid: 3,
					roleid: 3,
					lastlogintime: date
				}).then(function() {
			    User
			      .findOne({where: {username: username}})
			      .then(function (user) {
							req.session.user = user;
							req.session.isNewUser = true;
							res.redirect('/community');
			      });
			  });
			}
			
		});
	
}
  
});

router.get('/community', function(req, res) {
	if (req.session && req.session.user) { 
		User.findAll().then(function (user) {	
			var users = user;
			console.log("Getting all users...");
			Message.findAll().then(function (msg) {	
        var chathistory = msg;
				
				// render the welcome page
			  	res.render('community', { 
						user: req.session.user,
						isNewUser: req.session.isNewUser,
						chatHistory: chathistory, 
						userDirectory : users,
						});
			});
		});
	}else {
    res.redirect('/signin');
  }
});


module.exports = router;