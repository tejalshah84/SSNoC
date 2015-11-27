var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');

// -------------------------------------------------------------------------------------//

// GET all messages
router.get('/', function(req, res) {
	models.chathistory.findAll().then(function (msg) {
		  res.json(msg);
	});
});

//get message
router.get('/:id', function(req, res) {
	models.chathistory.findAll({
	  where: {
	    id: req.params.id
	  }
	}).then(function (msg) {
		  res.json(msg);
	});
});

//create message
router.post('/', function(req, res) {
	models.chathistory.create({ 
		chatauthor_id: req.session.user.id,
		chatmessage: req.data.content,
		timestamp:CURRENT_TIMESTAMP
	}).then(function() {
		console.log("Announcement created!");
	});
});







module.exports = router;
