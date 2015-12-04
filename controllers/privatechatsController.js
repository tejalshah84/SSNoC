var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');

//-------------------------------------------------------------------------------------//

//GET all messages
//router.get('/', function(req, res) {
	//privateMessage.findAll().then(function (msg) {
		//  res.json(msg);
	//});
//});

//GET all private messages for a specific author
router.get('/', function(req, res) {
	models.privatechathistory.findAll({
	where: {
		chatauthor_id: {
			$in: [req.query.chatauthor, req.query.chattarget]
		},
		chattarget_id:{ 	  
			$in: [req.query.chatauthor, req.query.chattarget]}
		},
	include: [{model: models.user, as: 'usertarget_id', attributes: ['username']},
				{model: models.user, as: 'userauthor_id', attributes: ['username']}],
	order:'timestamp ASC',
	}).then(function (msg) {
		console.log('RoomTest');
		console.log(msg); 
		res.json(msg); 
	});
});

//get message
router.get('/:id', function(req, res) {
	models.privatechathistory.findAll({
	  where: {
	    id: req.params.id
	  }
	}).then(function (msg) {
		  res.json(msg);
	});
});

//create message
router.post('/', function(req, res) {
	res.send('respond with a resource');
});



module.exports = router;
