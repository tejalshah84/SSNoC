var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var models = require('.././models');
var util = require('.././util/util.js');

var services = require('../models/user.js');


var userModel = require('.././models/user.js');
var server = require("../app.js").server;
var url = 'http://localhost:8888';


///////////////////////////////////////////////////////////////


var userA = { 
	'username': 'abcdefg',
	'roleid': 2,
	'accountStatus':1,
	'password': 'test'
	
};

var userUpdate;

var userB = {
	
	'username': 'abcc',
	'firstname': 'A',
	'lastname': 'B', 
	'status_id': 2, 
	'location': 'sunnyvale',
	'accountStatus': 1,
	'lastlogin': new Date()
};

///////////////////////////////////////////////////////////////


suite('Profile Update Test', function(){
		
	
		test('1. Profile Router Test', function(done){
			request(url)
			.get('/profile')
			.expect('Content-Type', /json/)
			.end(function(err, res){
			done();
			});
			});
			
		
		test('2. Admin Update User Profile', function(done){ 
			
			models.user.adminUpdate(models, userA, function(user) {						
						userUpdate = user;
						expect(200);
						expect(userUpdate.accountStatus==userA.accountStatus);
						done();
				  });
				  });	
		
	
	
	
			
	
});