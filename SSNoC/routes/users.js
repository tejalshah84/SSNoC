var express = require('express');
var router = express.Router();

//importing models
var sequelize = require('.././sequelize');
var User = require('.././models/user.js');

/* GET users listing. */
router.get('/', function(req, res) {
	User.findAll().then(function (user) {
		  res.json(user);
	});
});

//get user
router.get('/:id', function(req, res) {
	User.findAll({
	  where: {
	    id: req.params.id
	  }
	}).then(function (user) {
		  res.json(user);
	});
});

//create user
router.post('/', function(req, res) {
  res.send('respond with a resource');
});


//update user
router.put('/:id', function(req, res) {
  res.send('respond with a resource');
});

//delete user
router.delete('/:id', function(req, res) {
  res.send('respond with a resource');
});


module.exports = router;
