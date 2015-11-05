var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
var measurePerformance = require('.././lib/measurePerformance.js');
//importing models
var models = require('.././models');

var Message = require('.././models/test_message.js');
var ready = true;
// -------------------------------------------------------------------------------------//

// GET all messages
router.get('/', function(req, res) {
	models.chathistory_test.chathistory.findAll().then(function (msg) {
		  //res.json(msg);
			measurePerformance.increGet(); 
			res.json(msg);
	});
});

//get message
router.get('/:id', function(req, res) {
	models.chathistory_test.chathistory.findAll({
	  where: {
	    id: req.params.id
	  }
	}).then(function (msg) {
		  res.json(msg);
	});
});

//create message
router.post('/', function(req, res) {
	createMsg(req,res);
});

function requestLimit(){
	if (measurePerformance.getRequestNum()["POST"] > 1000){ //Post Request Limit Rule
		console.log("------ num of POST exceed 1000!");
		if(models.chathistory_test.dropdb(models.chathistory_test.chathistory)){
			measurePerformance.getRequestNum()["POST"] = 0;
			console.log("------ Refresh db. Continue to process post");
		}
	}
}
function createMsg(req,res){
	models.chathistory_test.chathistory.create({ 
  	chatauthor: req.body.chatauthor,
		chatmessage: req.body.chatmsg,
    timestamp: req.body.timestamp
	}).then(function(msg) {
		measurePerformance.increPost(); 
		res.json(measurePerformance.getRequestNum());
	});
}





module.exports = router;
