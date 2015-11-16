var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
//importing models
var models = require('.././models');

// -------------------------------------------------------------------------------------//


var ifSignIn = function (req, res, next) {
	if (req.session && req.session.user) { 
		console.log('~~~~~~~~~~~~~~~ Session exist!!!');
		next();
	}else{
		res.redirect('/');
	}  
}
// GET all messages
router.get('/', function(req, res) {
	models.missingperson.findAll().then(function (people) {
		  res.json(people);
	});
});
// GET all messages
router.get('/deck', ifSignIn, function(req, res) {
	models.user.findAll().then(function (user) {	
		var users = user;
		models.missingperson.findAll({
		  order:
			  'id DESC'
		}).then(function (people) {	
		  	res.render('missing', { 
					user: req.session.user,
					userDirectory : users,
					onlineUsers: onlineUsers.getOnlineUsers(),
					missingPeople: people
					});
		});			
	});
	
});

// new missing people
router.get('/new',ifSignIn, function(req, res) {
	models.user.findAll().then(function (user) {	
	res.render('missing/new', { 
		user: req.session.user,
		userDirectory : user,
		onlineUsers: onlineUsers.getOnlineUsers()
		});
	});	
});

//get message
router.get('/:id/found', function(req, res) {
	models.missingperson.findOne({
		where:{
			id: req.params.id
		}
	}).then(function (person) {
		person.update({
		  missing: 0
		}).then(function() {
			res.redirect('/missing/deck');
		});
	});
});

//get message
router.get('/:id', function(req, res) {
	models.missingperson.findOne({
		where:{
			id: req.params.id
		}
	}).then(function (person) {
		  res.json(person);
	});
});

//create new missing people profile
router.post('/', function(req, res) {
	models.user.findOne({
	  where: {
	    username: req.session.user.username
	  }
	}).then(function (user) {	
	
	models.missingperson.create({ 
		reporter_userid: user.id,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		age: req.body.age,
		height: req.body.height,
		weight: req.body.weight,
		location: req.body.location,
		lastseen: new Date(),
		description: req.body.description		
	}).then(function() {
		console.log("Missing person created!");
		res.redirect('/missing/deck');
	});
	});
});







module.exports = router;
