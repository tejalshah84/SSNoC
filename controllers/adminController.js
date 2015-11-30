var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
var measurePerformance = require('.././lib/measurePerformance.js');
//model
var models = require('.././models');


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
