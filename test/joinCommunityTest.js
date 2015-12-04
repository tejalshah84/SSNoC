/*var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var models = require('.././models');
var userModel = require('.././models/user.js');

var services = require('../util/missingPeople.js');

///////////////////////////////////////////////////////////////

var current_user = {
	'id': 4,
	'username': 'EileenW'
};

var new_user = { 
	'username': 'TestingUser1',
	'password': 'password'
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
	
	test('2. Go Online function', function(done){ //Eileen
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
});*/

var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var models = require('.././models');
var userModel = require('.././models/user.js');

var services = require('../util/missingPeople.js');

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
			expect(200);
			expect(createdUser.username).to.be.eql(new_user.username);
			done();
	  });
	});
	
	test('2. Go Online function', function(done){ //Eileen
		done();
	});
	
	test('3. Divide User function', function(done){ //Eileen
		done();
	});
	
	test('4. Update user after signing in', function(done){ //Denise
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