var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');

var util = require('.././util/util.js');
var onlineUsers = require('.././lib/onlineUsers.js');

// -------------------------------------------------------------------------------------//



//Render User Profile Page
router.get('/:id', function(req, res) {
	
});



module.exports = router;