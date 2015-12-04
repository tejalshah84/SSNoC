var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var models = require('.././models');
var userModel = require('.././models/user.js');

var services = require('../util/missingPeople.js');
var onlineUsers = require('.././lib/onlineUsers.js');
var util = require('.././util/util.js');

///////////////////////////////////////////////////////////////

var current_user = {
	'id': 4,
	'username': 'EileenW'
};

var new_user = { 
	'username': 'TestingUser1',
	'password': 'password'
};

var user = { 
	'id': 4,
	'username': 'EileenW',
	'statusid': 1,
	'socket_id': 'GTu7_poG76em-H-QAAAA'
};

var createdUser;

///////////////////////////////////////////////////////////////


suite('Join Community Test', function(){
		
	test('1. Create new user and save it into the database', function(done){ 
	//	userModel.create(new_user).then(function(user){
		models.user.createUser(models, new_user, function(user) {	
			createdUser = user; 
			expect(200);
			expect(createdUser.username).to.be.eql(new_user.username);
			done();
	  });
	});
	
	test('2. getOnlineUsers() should return an object', function(done){ //Eileen
		var result = onlineUsers.getOnlineUsers();
		expect(result).to.exist;
		expect(result).to.be.an('object');
		done();
	});
	
	test('2. addoOnlineUsers(user) should return an object that contains one user', function(done){ //Eileen
		onlineUsers.addoOnlineUsers(user);
		var result = onlineUsers.getOnlineUsers();
		expect(result).to.exist;
		expect(result).to.be.an('object');
		expect(result).to.have.property(user.id);
		expect(result[user.id]).to.be.eql({ status_id: user.statusid, socket_id: '' });
		done();
	});
	
	test('3. removeOnlineUsers(user) should return an object that exclude the user', function(done){ //Eileen
		done();
	});
	
	test('3. Divide User function', function(done){ //Eileen
		done();
	});
	
	test('3. Update user after signing in', function(done){ //Denise
		//test the update function created in User model
		//check against last login time
		done();
	});
});

suiteTeardown(function (done){
	models.user.destroyUser(models, createdUser.id, function(){
			done();
	});		
});
