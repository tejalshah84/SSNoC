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




/* show signin page*/
router.get('/signin', function(req, res) {
	  
	  console.log("Handling signin entering...");
	  res.render('signin', { title: 'Express' });
});


/* handle signin request*/
router.post('/signin', function(req, res){
	console.log("Handling signin...");
	console.log("Username: "+req.body.username);
	//Retrieve Hash pwd from DB
	db.get("SELECT * FROM user WHERE username = $username", {$username: req.body.username}, function(err, result) {

		if(!result){
			// If the username isn't in the DB, reset the session and redirect the user to signup an account
			console.log("Redirected to signin-1");
			res.redirect('/signin');// Question - or redirect to signin again? which one is more reasonable?
		}
		else{  // If the user is in the DB, retrieve password and compare it
			
			var pwd_hash = result.password;
			//Compare pwd
			var comparison = bcrypt.compareSync(req.body.password, pwd_hash);
			console.log("Comparing password...");
			if(comparison){ //If pwd is correct, update new login time to DB and enter the welcome page

			
				var date = new Date();//Get user login time
				var logintime = date.toLocaleTimeString();
				db.run("UPDATE user SET lastLoginTime WHERE username = $username", {$username: result.username}, function(err, row){ 

					req.session.user = result;
					console.log("Succefully signin!");
					res.redirect('/welcome');
				});
			}

			else{

				console.log("Password not correct...Redirected to signin");
				res.redirect('/signin');

			}
			

		
		}
});
});



module.exports = router;
