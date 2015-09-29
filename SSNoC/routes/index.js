var express = require('express');
var router = express.Router();
var db = require('.././testdb');

// Load the bcrypt module
var bcrypt = require('bcrypt');

// Generate a salt
var salt = bcrypt.genSaltSync(10);


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('signup', { title: 'Express' });
});


//handle user signup request
router.post('/', function(req, res){
	console.log("Handling signup...");
	console.log("Username: "+req.body.username);
	
	var username = req.body.username;
	
	// Hash the password with the salt
	var pwd_hash = bcrypt.hashSync(req.body.password, salt);
  var date = new Date();
  var logintime = date.toLocaleTimeString();
	
	req.session.username = username;
	// store the hash in  DB
  var stmt = db.prepare("INSERT INTO user (username,password,firstname,lastname,status,role,lastLoginTime) VALUES (?,?,?,?,?,?,?)");
  stmt.run(username, pwd_hash, "", "", 3, 3, logintime);
	
	db.get("SELECT * FROM user WHERE username = $username", {$username: username},function(err, result) {
		req.session.user = result;
		res.redirect('/welcome');
	});
	
  
});

router.get('/welcome', function(req, res) {
	if (req.session && req.session.user) { 
		db.get("SELECT * FROM user WHERE username = $username", {$username: req.session.user.username},function(err, result) {
			if (!result) {
				// if the user isn't found in the DB, reset the session info and redirect the user to the signin page
		   	req.session.reset();
		   	res.redirect('/signin');
			} else {
		  	res.locals.user = result;
		 		// render the welcome page
		  	res.render('welcome', { 
					user: res.locals.user
				});
			}	
		});
	}else {
    res.redirect('/signin');
  }
});

router.get('/signin', function(req, res, next) {
	  res.render('signin', { title: 'Express' });
});

module.exports = router;
