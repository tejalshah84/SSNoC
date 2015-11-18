var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');

// -------------------------------------------------------------------------------------//

// GET all Announces
router.get('/', function(req, res) {
	models.announcement.findAll().then(function (announce) {
		  res.json(announce);
	});
});


router.get('/latest', function(req, res) {
	models.announcement.findAll({
	  order:
		  'id DESC'
	  , 
	  limit:
	  	1
	  
	}).then(function (announce) {
		  res.json(announce);
	});
});

//get Announce
router.get('/:id', function(req, res) {
	models.announcement.findAll({
	  where: {
	    id: req.params.id
	  }
	}).then(function (announce) {
		  res.json(announce);
	});
});

//create Announce
router.post('/', function(req, res) {
	models.announcement.create({ 
		publisher_username: req.session.user.username,
		content: req.data.content
	}).then(function() {
		console.log("Announcement created!");
	});
});


//update Announce
router.put('/:id', function(req, res) {
  res.send('respond with a resource');
});

//delete Announce
router.delete('/:id', function(req, res) {
  res.send('respond with a resource');
});


module.exports = router;
