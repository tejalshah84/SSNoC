var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
var measurePerformance = require('.././lib/measurePerformance.js');
//model
var models = require('.././models');
var util = require('.././util/util.js');


// -------------------------------------------------------------------------------------//



router.get('/',util.ifSignIn, util.isMinitor, function(req, res) {
		models.user.all().then(function (user) {
		  	res.render('monitor', { 
					user: req.session.user,
					userDirectory : user,
					onlineUsers: onlineUsers.getOnlineUsers()
					});
				});
});


router.get('/start_testing', function(req, res) {
		measurePerformance.restart();
		measurePerformance.startTest();
//		models.chathistory_test.dropdb(models.chathistory_test.chathistory, function(){
			res.type('json').status(200).send(measurePerformance.getRequestNum());
//		});
});

router.get('/end_testing', function(req, res) {
	measurePerformance.endTest();
	models.chathistory_test.dropdb(models.chathistory_test.chathistory, function(){
		res.type('json').status(200).send(measurePerformance.getRequestNum());
	});		
});




module.exports = router;
