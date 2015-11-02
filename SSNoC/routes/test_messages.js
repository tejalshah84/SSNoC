var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
var measurePerformance = require('.././lib/measurePerformance.js');
//importing models
var Message = require('.././models/test_message.js');

// -------------------------------------------------------------------------------------//

// GET all messages
router.get('/', function(req, res) {
	Message.chathistory.findAll().then(function (msg) {
		  res.json(msg);
	});
});

//get message
router.get('/:id', function(req, res) {
	Message.chathistory.findAll({
	  where: {
	    id: req.params.id
	  }
	}).then(function (msg) {
		  res.json(msg);
	});
});

//create message
router.post('/', function(req, res) {
	if (measurePerformance.getRequestNum()["POST"] < 1000){ //Post Request Limit Rule
		Message.dropdb(Message.chathistory);
	}
	Message.chathistory.create({ 
  	chatauthor: req.body.chatauthor,
		chatmessage: req.body.chatmsg,
    timestamp: req.body.timestamp
	}).then(function(msg) {
		measurePerformance.increPost(); 
		res.json(measurePerformance.getRequestNum());
	});
});






module.exports = router;
