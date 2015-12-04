var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
//model
var models = require('.././models');
var util = require('.././util/util.js');

//Get user status
router.get('/status/:user', function(req, res) {
	
	
	if(isInteger(req.params.user)){
		
			models.user.findById(models, req.params.user, function(user){
					
					models.user.findById(models, req.params.user, function(user){
			 	 		res.type('json').status(200).send(user.statusid);
					});
					
			});
		}else{		
			
				models.user.findByUsername(models, req.params.user, function(user){
						
						models.user.findByUsername(models, req.params.user, function(user){
				 	 		res.type('json').status(200).send("User Status: " + user.statusid);
						});
						
				});
		}
	
	
});

function isInteger(x) {
	return x % 1 === 0;
}

module.exports = router;
