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

exports.addoOnlineUsers = function(username) {
	console.log("User ["+username+"] is now online!!!");
	current_user = username; 
	console.log("----- current_user => "+current_user);
  usernames[username] = username;
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
