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
	current_user = user.id; 
	usernames[user.id] = {"status_id": user.statusid, "socket_id":''};
  ++numUsers;
};


exports.addUsersSocketID = function(userid, socketid){
	usernames[userid]['socket_id'] = socketid;
};


exports.removeOnlineUsers = function(id) {
	if (usernames[id]){
	  delete usernames[id];
	  --numUsers;
	}
};

exports.numOfOnlineUsers = function() {
	return numUsers;
};
