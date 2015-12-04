var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var models = require('.././models');
var userModel = require('.././models/user.js');

var services = require('../util/missingPeople.js');
var util = require('.././util/util.js');

///////////////////////////////////////////////////////////////

var current_user = {
	//'id': 4,
	'username': 'EileenW',
	'lastlogintime': new Date()
	
};

var new_user = { 
	'username': 'TestingUser1',
	'password': 'password'
};

var createdUser;
var testUser;

///////////////////////////////////////////////////////////////


suite('Join Community Test', function(){
		
	test('1. Create new user and save it into the database', function(done){ 
		models.user.createUser(models, new_user, function(user) {	
			createdUser = user; 
			expect(createdUser);
			expect(createdUser).to.exist;
			expect(createdUser).to.be.an('object');
			expect(createdUser.username).to.be.eql(new_user.username);
			expect(createdUser.password).to.be.eql(new_user.password);
			expect(createdUser.accountStatus).to.be.eql(1); //account is active by default
			done();
	  });
	});
	
	
	test('2. Update user after signing in', function(done){ //Denise
		//test the update function created in User model
		//check against last login time
		models.user.loginTimeUpdate(models, current_user, function(user) {
					testUser = user;
					expect(200);
					expect(testUser.lastlogintime).to.not.equal(current_user.lastlogintime);
					done();
			  });
	});


	suiteTeardown(function (done){
		models.user.destroyUser(models, createdUser.id, function(){
			done();
		});		
	});
});