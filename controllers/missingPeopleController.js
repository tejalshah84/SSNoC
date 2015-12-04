'use strict';
/* jshint shadow:true */
/* jshint sub: true */

var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
var services = require('.././util/missingPeople.js');

var multer  = require('multer');
var upload = multer({ dest: './uploads/' });
var fs = require('fs');

//importing models
var models = require('.././models');
var util = require('.././util/util.js');

// -------------------------------------------------------------------------------------//




// GET all messages
router.get('/deck', util.ifSignIn, function(req, res) {
	models.user.findAll().then(function (user) {	
		var users = user;
		models.missingperson.findAll({
			where:{missing: 1},
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
router.get('/new', util.ifSignIn, function(req, res) {
	models.user.findAll().then(function (user) {	
	res.render('newmissing', { 
		user: req.session.user,
		userDirectory : user,
		onlineUsers: onlineUsers.getOnlineUsers()
		});
	});	
});

//get message
router.post('/:id/found', function(req, res) {
	console.log('============');
	console.log(req.body);
	
	services.foundMissingPerson(req.params.id, req.body, function(person){
		console.log(person['dataValues']);
		
		models.user.findById(models, person['dataValues'].reporter_userid, function (result) {
			var data = { "reporter_userid": result.id, "person": person, "founder": req.session.user.username, "founder_id": req.session.user.id};
			res.json(data);
		});
		
		
	});
});



//create new missing people profile
router.post('/', upload.single('file'), function(req, res) {
		var path = __dirname + "/../public/uploads";
		var filename;
		if(!req.file){
			filename = '';
		}else{
			filename = req.file.originalname;
		}
		services.uploadImage(req,filename,path, function() {
			filename = 'Minion.png';
			//var person = services.createMissingPerson(req.body, req.file.originalname, req.session.user,function(person) {
			var person = models.missingperson.createMissingPerson(models, req.body, filename, req.session.user,function(person) {	
	  		console.log('--------------');
				console.log(person['dataValues']);
					res.redirect('/missing/deck');
			});
		});
		
});


router.get('/uploads/:file', function (req, res){
	var file = req.params.file;
	console.log("=== "+file);
	var img = fs.readFileSync(__dirname + "/../public/uploads/" + file);
//	res.writeHead(200, {'Content-Type': 'image/jpg' });
//	res.end(img, 'binary');

});
// ------------------------- API ------------------------------------------------------------//

// GET all missing people
router.get('/', function(req, res) {
	models.missingperson.findAll().then(function (people) {
		  res.json(people);
	});
});

// GET all missing people that are missing
router.get('/missing', function(req, res) {
	models.missingperson.findAll({
		where:{
			missing: 1
		}
	}).then(function (people) {
		  res.json(people);
	});
});
// GET all missing people
router.get('/found', function(req, res) {
	models.missingperson.findAll({
		where:{
			missing: 0
		}
	}).then(function (people) {
		  res.json(people);
	});
});

//get a missig person
router.get('/:id', function(req, res) {
	models.missingperson.findOne({
		where:{
			id: req.params.id
		}
	}).then(function (person) {
		  res.json(person);
	});
});

// ------------------------- API ------------------------------------------------------------//





module.exports = router;
