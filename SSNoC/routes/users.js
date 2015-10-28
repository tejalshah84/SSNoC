var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var User = require('.././models/user.js');
var onlineUsers = require('.././lib/onlineUsers.js');

// -------------------------------------------------------------------------------------//


/*========================================  TO BE REVIEWED ========================================*/
// GET all users 
router.get('/', function(req, res) {
	User.findAll().then(function (user) {
		  res.json(user);
	});
});

// GET all online
router.get('/online', function(req, res) {
	User.findAll().then(function (users) {
		var list = divideUsers(users);
		res.json(list);
	});
});

//return the user hash: online and offline
function divideUsers(users){
	var users_list = {};
	users_list['online'] = onlineUsers.getOnlineUsers();	
		var user_off = {};		
		users.forEach(function(user){
			if (user.username in users_list['online']) {
				users_list['online'][user.username]['status_id'] = user.statusid;
			}else{
				user_off[user.username] = user.statusid;
			}
		users_list['offline'] = user_off;
	});
	return users_list;
}


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

/*========================================  TO BE REVIEWED ========================================*/


module.exports = router;
