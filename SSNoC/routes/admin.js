var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
var measurePerformance = require('.././lib/measurePerformance.js');
//model
var User = require('.././models/user.js');
var TestMessage = require('.././models/test_message.js');
// -------------------------------------------------------------------------------------//



router.get('/', function(req, res) {
	if (req.session && req.session.user) { 
		User.findAll().then(function (user) {
		  	res.render('minitor', { 
					user: req.session.user,
					userDirectory : user,
					onlineUsers: onlineUsers.getOnlineUsers()
					});
				});
	}else {
    res.redirect('/signin');
  }
});

router.get('/start_testing', function(req, res) {
		console.log("start test...");
		measurePerformance.restart();
		measurePerformance.startTest();
		TestMessage.dropdb(TestMessage.chathistory, function(){
			res.sendStatus(200);
		});
});

router.get('/end_testing', function(req, res) {
	console.log("*** ending test...");	
	measurePerformance.endTest();
	TestMessage.dropdb(TestMessage.chathistory, function(){
		console.log(measurePerformance.getRequestNum());
		res.json(measurePerformance.getRequestNum());
	});		
});




module.exports = router;
