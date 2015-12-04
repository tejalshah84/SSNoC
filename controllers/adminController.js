var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
var measurePerformance = require('.././lib/measurePerformance.js');
//model
var models = require('.././models');
var util = require('.././util/util.js');


// -------------------------------------------------------------------------------------//



router.get('/', function(req, res) {
	if (req.session && req.session.user) { 
		models.user.findAll().then(function (user) {
		  	res.render('monitor', { 
					user: req.session.user,
					userDirectory : user,
					onlineUsers: onlineUsers.getOnlineUsers()
					});
				});
	}else {
    res.redirect('/signin');
  }
});



// GET all active users 
router.get('/active', function(req, res) {
	models.user.findAll().then(function (users) {
		//console.log("@@@@@@@@@@@@@@@@@@@@@@"+users);
		var list = util.divideActiveUsers(users);
		res.json(list);
	});
});

// GET all inactive users
router.get('/inactive', function(req, res) {
	models.user.findAll().then(function (users) {
		var list = util.divideInActiveUsers(users);
		res.json(list);
	});
});


// Activate a user
router.get('/active/:user', function(req, res) {
	
	
	if(isInteger(req.params.user)){
		
			models.user.findById(models, req.params.user, function(user){
				models.user.adminUpdate(models, {"username": user.username, "password": user.password, "roleid":user.roleid, "accountStatus":1}, function(user) {
					
					models.user.findById(models, req.params.user, function(user){
			 	 		res.type('json').status(200).send(user);
					});
					  });
			});
		}else{		
			
				models.user.findByUsername(models, req.params.user, function(user){
					models.user.adminUpdate(models, {"username": user.username, "password": user.password, "roleid":user.roleid, "accountStatus":1}, function(user) {
						
						models.user.findByUsername(models, req.params.user, function(user){
				 	 		res.type('json').status(200).send(user);
						});
						
						  });
				});
		}
	
	
});

// Deactivate a user
router.get('/inactive/:user', function(req, res) {
	
	
	if(isInteger(req.params.user)){
		
			models.user.findById(models, req.params.user, function(user){
				models.user.adminUpdate(models, {"username": user.username, "password": user.password, "roleid":user.roleid, "accountStatus":0}, function(user) {
					models.user.findById(models, req.params.user, function(user){
			 	 		res.type('json').status(200).send(user);
					});
					  });
			});
		}else{		
			
				models.user.findByUsername(models, req.params.user, function(user){
					models.user.adminUpdate(models, {"username": user.username, "password": user.password, "roleid":user.roleid, "accountStatus":0}, function(user) {
						models.user.findByUsername(models, req.params.user, function(user){
				 	 		res.type('json').status(200).send(user);
						});
						  });
				});
		}
	
	
});



function isInteger(x) {
	return x % 1 === 0;
}

router.get('/start_testing', function(req, res) {
		console.log("start test...");
		measurePerformance.restart();
		measurePerformance.startTest();
//		models.chathistory_test.dropdb(models.chathistory_test.chathistory, function(){
			res.sendStatus(200);
//		});
});

router.get('/end_testing', function(req, res) {
	console.log("*** ending test...");	
	measurePerformance.endTest();
	models.chathistory_test.dropdb(models.chathistory_test.chathistory, function(){
		console.log(measurePerformance.getRequestNum());
		res.json(measurePerformance.getRequestNum());
	});		
});




module.exports = router;


















