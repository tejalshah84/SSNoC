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
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
	models.user.findAll().then(function (users) {
		var list = util.divideActiveUsers(users);
		res.json(list);
	});
});


router.get('/inactive', function(req, res) {
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
	models.user.findAll().then(function (users) {
		var list = util.divideInActiveUsers(users);
		res.json(list);
	});
});


router.get('/active/:user', function(req, res) {
	if(isInteger(req.params.user)){
		console.log('first if');
		
		models.user.findById(models, req.params.user, function(user){
 	 		res.type('json').status(200).send(user);
		});
	}else{
		console.log('first else');
		
		if(util.checkAccountStatus(req) == 1){
			console.log('second if'+util.checkAccountStatus(req));
			
			models.user.findByUsername(models, req.params.user, function(user){
			res.type('json').status(200).send(user);
			});
	}
		else res.json("Not Active User");
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
