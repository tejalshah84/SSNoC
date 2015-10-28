var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var Message = require('.././models/message.js');

// -------------------------------------------------------------------------------------//

/*========================================  TO BE REVIEWED ========================================*/
// GET all messages
router.get('/', function(req, res) {
	Message.findAll().then(function (msg) {
		  res.json(msg);
	});
});

//get message
router.get('/:id', function(req, res) {
	Message.findAll({
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
router.delete('/:id', function(req, res) {
  res.send('respond with a resource');
});

/*========================================  TO BE REVIEWED ========================================*/

module.exports = router;
