var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var privateMessage = require('.././models/privatechat.js');

//-------------------------------------------------------------------------------------//

//GET all messages
//router.get('/', function(req, res) {
	//privateMessage.findAll().then(function (msg) {
		//  res.json(msg);
	//});
//});

//GET all private messages for a specific author
router.get('/', function(req, res) {
	privateMessage.findAll({
where: {
chatauthor: {
	$in: [req.query.chatauthor, req.query.chattarget]
},
chattarget:{ 	  
$in: [req.query.chatauthor, req.query.chattarget]}
}
}).then(function (msg) {
	console.log('RoomTest');
	console.log(msg); 
	res.json(msg); 
});
});

//get message
router.get('/:id', function(req, res) {
	privateMessage.findAll({
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


//update message
router.put('/:id', function(req, res) {
res.send('respond with a resource');
});

//delete message
//router.delete('/:id', function(req, res) {
//res.send('respond with a resource');
//});


module.exports = router;
