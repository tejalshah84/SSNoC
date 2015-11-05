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
	current_user = user.username; 
	usernames[user.username] = {"status_id":user.statusid, "socket_id":''};
  ++numUsers;
};


exports.addUsersSocketID = function(username, socketid){
	usernames[username]['socket_id'] = socketid;
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
