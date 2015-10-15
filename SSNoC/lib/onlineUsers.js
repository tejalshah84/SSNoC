// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;
var username = '';

exports.getOnlineUsers = function() {
	
	return usernames;
};

exports.addoOnlineUsers = function(username) {
	console.log("User ["+username+"] is now online!!!");
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
