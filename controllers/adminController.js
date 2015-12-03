var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
var measurePerformance = require('.././lib/measurePerformance.js');
//model
var models = require('.././models');
var util = require('.././util/util.js');


// -------------------------------------------------------------------------------------//







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






module.exports = router;
