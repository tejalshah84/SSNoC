// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;
var current_user = '';

exports.getOnlineUsers = function() {
	
	return usernames;
};

exports.currentUser = function() {
	
	return current_user;
};

exports.addoOnlineUsers = function(user) {
	console.log("User ["+user.username+"] is now online!!!");
	current_user = user.username; 
	console.log("----- current_user => "+current_user);
  usernames[user.username] = user.statusid;
  ++numUsers;
	console.log("Number of users now: "+numUsers);
};

exports.removeOnlineUsers = function(username) {
	if (usernames[username]){
	  delete usernames[username];
	  --numUsers;
	}
};

exports.numOfOnlineUsers = function() {
	return numUsers;
};
