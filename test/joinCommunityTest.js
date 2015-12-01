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
	'id': 4,
	'username': 'EileenW'
};

var new_user = { 
	'username': 'TestingUser1',
	'password': 'password'
};

var createdUser;

///////////////////////////////////////////////////////////////
/**/


suite('Join Community Test', function(){
	
	
	
	test('1. Create new user and save it into the datavase', function(done){ 
	//	userModel.create(new_user).then(function(user){
		models.user.createUser(models, new_user, function(user) {	
			createdUser = user; 
			expect(200);
			expect(createdUser.username).to.be.eql(new_user.username);
			done();
	  });
	});
	
	teardown(function (done){
		models.user.destroyUser(models, createdUser.id, function(){
				done();
		});		
	});
	
	
});