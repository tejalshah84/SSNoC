
var request = {"POST": 0, "GET": 0};
var inTest = false;

exports.getRequestNum = function() {	
	return request;
};

exports.increPost = function() {
	return request["POST"]++;
};

exports.increGet = function() {
	return request["GET"]++;
};

exports.restart = function() {
	request = {"POST": 0, "GET": 0};
};

exports.inTest = function(){
	return inTest;
};

exports.startTest = function(){
	inTest = true;
};

exports.endTest = function(){
	inTest = false;
};
