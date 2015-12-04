var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
var measurePerformance = require('.././lib/measurePerformance.js');
//importing models
var models = require('.././models');

var Message = require('.././models/test_message.js');
var ready = true;
// -------------------------------------------------------------------------------------//



var requestLimit = function (req, res, next){
	if (measurePerformance.getRequestNum()["POST"] > 1000){ //Post Request Limit Rule
		console.log("------ num of POST exceed 1000!");
		models.chathistory_test.chathistory.destroy({
			truncate: true
		}).then(function() {
			measurePerformance.getRequestNum()["POST"]=0;
				next();
		});	
	}else{
		next();
	}
}


// GET all test messages
router.get('/', function(req, res) {
	models.chathistory_test.chathistory.findAll().then(function (msg) {
		  //res.json(msg);
			measurePerformance.increGet(); 
			res.type('json').status(200).send(msg);
	});
});



//create test message
router.post('/', requestLimit, function(req, res) {
	createMsg(req.body,res);
});





function createMsg(data,res){
	models.chathistory_test.chathistory.create({ 
  	chatauthor: data.chatauthor,
		chatmessage: data.chatmsg,
    timestamp: data.timestamp
	}).then(function(msg) {
		measurePerformance.increPost(); 
//		res.json(measurePerformance.getRequestNum());
		res.type('json').status(200).send(msg);
	});
}





module.exports = router;
