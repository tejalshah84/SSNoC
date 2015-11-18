var express = require('express');
var router = express.Router();

var db = require('.././testdb'); //database
//model
var badUsername = require('.././lib/reservedNames.js');
var onlineUsers = require('.././lib/onlineUsers.js');

var bcrypt = require('bcryptjs');// Load the bcrypt module
var salt = bcrypt.genSaltSync(10);// Generate a salt


var models = require('.././models');


// -------------------------------------------------------------------------------------//


var ifSignIn = function (req, res, next) {
	if (req.session && req.session.user) { 
		console.log('~~~~~~~~~~~~~~~ Session exist!!!');
		next();
	}else{
		res.redirect('/signin');
	}  
}

/* show signin page*/
router.get('/', function(req, res) {
	res.render('signin', { error: ""});
});

router.get('/signin', function(req, res, next) {
	res.render('signin', { error: ""});
});

router.get('/signout', ifSignIn, function(req, res){ 
		onlineUsers.removeOnlineUsers(req.session.user.id);
		req.session.destroy();
		res.redirect('/signin');
});

/* handle signin request*/
router.post('/', function(req, res){
	var username = req.body.username;
	
	models.user.findOne({
		  where: {
		    username: username
			}
	}).then(function (result) {
		if(!result){
			// If the username isn't in the DB, reset the session and redirect the user to signup an account
			res.render('signin',{error: "Username not found!"});
		}else{  // If the user is in the DB, retrieve password and compare it	
			var pwd_hash = result.password;
			var comparison = bcrypt.compareSync(req.body.password, pwd_hash);
			if(comparison){ //If pwd is correct, update new login time to DB and enter the welcome page	
				var date = new Date();//Get user login time
				//var logintime = date.toLocaleTimeString();
				result.update({
				  lastlogintime: date
				}).then(function() {
					req.session.user = result;
					req.session.isNewUser = false;
					goOnline(result);
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
		res.render('signup',{error: "Username not valid!"});				
	}else{
		models.user.findOne({
		  where: {
		    username: username
		  }
		}).then(function (result) {
			if(result){
				res.render('signup',{error: "Username already exists!"});				
			}else{
				// Hash the password with the salt
				var pwd_hash = bcrypt.hashSync(req.body.password, salt);
			  var date = new Date();
			//  var logintime = date.toLocaleTimeString();
	
				req.session.username = username;
				models.user.create({ 
					username: username, 
					password: pwd_hash,
					firstname: "",
					lastname: "",
					statusid: 3,
					roleid: 3,
					lastlogintime: date
				}).then(function() {
			    models.user
			      .findOne({where: {username: username}})
			      .then(function (user) {
							req.session.user = user;
							req.session.isNewUser = true;
							goOnline(user);
							res.redirect('/community');
			      });
			  });
			}
			
		});
	
}
  
});

router.get('/community', ifSignIn, function(req, res) {
	
		models.user.findAll().then(function (user) {	
			var users = user;
			models.chathistory.findAll().then(function (msg) {	
        var chathistory = msg;
				
				// render the welcome page
			  	res.render('community', { 
						user: req.session.user,
						isNewUser: req.session.isNewUser,
						chatHistory: chathistory, 
						userDirectory : users,
						onlineUsers: onlineUsers.getOnlineUsers()
						});
			});
		});
		
	
});
//req.params.id

router.get('/chat/:id', ifSignIn, function(req, res) {	
		if(req.params.id == req.session.user.id){
			res.redirect('/community');
		}
		models.user.findAll().then(function (user) {	
			var users = user;	
		models.privatechathistory.findAll({
		where: {
		chatauthor_id: {
			$in: [req.session.user.id, req.params.id]
		},
		chattarget_id:{ 	  
			$in: [req.session.user.id, req.params.id]}
		}
	}).then(function (msg) {
  	res.render('chat', { 
			user: req.session.user,
			userDirectory : users,
			chatHistory: msg,
			targetName: req.params.id
			}); 
		});
		});
});

router.get('/searchpage', ifSignIn, function(req, res) {
	res.render('searchpage',{
		user: req.session.user
	  });	
});

router.get('/resourcepage', ifSignIn, function(req, res) {

	res.render('resourcepage',{
		user: req.session.user
	  });	
});

router.get('/resourcedonation', ifSignIn, function(req, res) {
		res.render('resourcedonation',{
		user: req.session.user
	  	});	
});

router.get('/myrequestpage', ifSignIn, function(req, res){
	
	res.render('myrequestpage',{
		user: req.session.user,
	  });

});

router.get('/addrequest', ifSignIn, function(req, res){
	
	res.render('requestresource',{
		user: req.session.user,
		error: ""
	  });

});

router.get('/requestapproval', ifSignIn, function(req, res){
	
	res.render('requestapproval',{
		user: req.session.user
	  });

});


function goOnline(user){
	onlineUsers.addoOnlineUsers(user);
}




module.exports = router;
