var express = require('express');
var router = express.Router();
var onlineUsers = require('.././lib/onlineUsers.js');
var services = require('.././util/missingPeople.js');

var multer  = require('multer');
var upload = multer({ dest: './uploads/' });
var fs = require('fs');

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
router.get('/deck', ifSignIn, function(req, res) {
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
router.post('/:id/found', function(req, res) {
	console.log('============');
	console.log(req.body);
	
	services.foundMissingPerson(req.params.id, req.body, function(person){
		console.log(person);
		models.user.findOne({
			  where: {
			    id: person
				}
		}).then(function (result) {
			var data = {"id": result.id, "reporter_userid": result.username, "person": person, "founder": req.session.user.username};
			res.json(data);
		});
		
		
	});
});



//create new missing people profile
router.post('/', upload.single('file'), function(req, res) {
	console.log(req);
		var path = __dirname + "/../public/uploads";
		if(!req.file){
			console.log("????");
			var filename = null;
		}else{
			var filename = req.file.originalname;
		}
		
		services.uploadImage(req,filename,path, function() {
			var person = services.createMissingPerson(req.body, filename, req.session.user,function(person) {
	  		console.log('--------------');
				console.log(person);
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

// GET all messages
router.get('/', function(req, res) {
	models.missingperson.findAll().then(function (people) {
		  res.json(people);
	});
});

// GET all missing people
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

// ------------------------- API ------------------------------------------------------------//





module.exports = router;
