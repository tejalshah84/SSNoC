var express = require('express');
var router = express.Router();

var db = require('.././testdb');

// Load the bcrypt module
var bcrypt = require('bcryptjs');

// Generate a salt
var salt = bcrypt.genSaltSync(10);

var badUsername = ["admin", "root"];

var userList = [{username: "TejalShah84", firstname: "Tejal", lastname: "Shah", online: true, status: 1, role: 1, lastLoginTime: new Date().toLocaleString()},
                {username: "Eileen", firstname: "Eileen", lastname: "Eileen", online: false, status: 1, role: 1, lastLoginTime: new Date().toLocaleString()},
                {username: "Denise", firstname: "Denise", lastname: "Denise", online: true, status: 2, role: 2, lastLoginTime: new Date().toLocaleString()},
                {username: "Amrata", firstname: "Amrata", lastname: "Amrata", online: false, status: 3, role: 3, lastLoginTime: new Date().toLocaleString()}];

/* show signin page*/
router.get('/', function(req, res) {
	  
	  console.log("Handling signin entering...");
	  res.render('signin', {  });
});


router.get('/signin', function(req, res, next) {
	res.render('signin', { error: ""});
});
/* handle signin request*/
router.post('/', function(req, res){
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
					res.redirect('/community');
				});
			}

			else{

				console.log("Password not correct...Redirected to signin");
				res.redirect('/signin');

			}
			

		
		}
});
});

router.get('/signup', function(req, res, next) {
	res.render('signup', { error: ""});
});

//handle user signup request
router.post('/signup', function(req, res){
	console.log("Handling signup...");
	console.log("Username: "+req.body.username);
	
	var username = req.body.username;
	//check validity of the user name
	//var usernameRegex = /^[a-zA-Z0-9]+$/; //the input firstname should only contains characters A-Z, a-z, and -
																				//the input login name should only contains alphanumeric characters
	var validUsername = username.match(usernameRegex);
	if(validUsername == null || badUsername.indexOf(username) >= 0){
		console.log("--- Invalid username");
		res.render('signup',{error: "Username not valid!"});				
	}else{
		console.log("--- valid username");
		db.get("SELECT * FROM user WHERE username = $username", {$username: username},function(err, result) {
			if(result){
				console.log("--- Existing username");
				res.render('signup',{error: "Username already exists!"});				
			}else{
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
					res.redirect('/community');
				});
			}
			
		});
	
}
  
});

router.get('/community', function(req, res) {
	if (req.session && req.session.user) { 
		db.all("SELECT * FROM user", function(err, rows) {
			var users = rows;
			console.log("Getting all users...");
			console.log(rows);
		 		// render the welcome page
		  	res.render('community', { 
					user: req.session.user, 
					//users : users
					userDirectory: userList
				});
		});
	}else {
    res.redirect('/signin');
  }
});


module.exports = router;
