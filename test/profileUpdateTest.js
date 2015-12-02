


var express = require('express');
var expect = require('expect.js');
var request = require('supertest');

var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var indexRoutes2 = require('.././controllers/profileController.js');

var models = require('.././models');
var userModel = require('.././models/user.js');

var server = require("../app.js").server;

var util = require('../util/util.js');
var url = 'http://localhost:8888';


///////////////////////////////////////////////////////////////

var current_user = {
	'id': 4,
	'username': 'EileenW'
};

var user = { 
	'username': 'abc',
	'roleid': 2
};


///////////////////////////////////////////////////////////////


suite('Profile Update Test', function(){
		
	//test('1. checkUserAccess', function(done){ 
	//	util.checkUserAccess(user);
	//	expect(2);
	//	done;
	//});
		test('1. ProfileUpdate', function(done){
			request(url)
			.get('/profile')
			.expect('Content-Type', /json/)
			.end(function(err, res){
			done();
			});
			});
			
	/*(test('2. active user', function(done){
			    request
			    	.get('/active')
						.expect('Content-Type', /json/)
						.expect(200) 
						.end(function(err, res){
							should.not.exist(err);
							done();
						});
			});


		test('3. Inactive user', function(done){
			    request
			    	.get('/inactive')
						.expect('Content-Type', /json/)
						.expect(200) 
						.end(function(err, res){
							should.not.exist(err);
							done();
						});
			});*/
		
	
});




/*var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var services = require('../controllers/profileController.js');
var url = 'http://localhost:8888';



suite('Active API', function(){
	
//	suiteTeardown(function (done){
//		server.close(done);
//		return done();
//	});

test('1. ProfileUpdate', function(done){
	request(url)
	.get('/profile')
	.expect('Content-Type', /json/)
	.end(function(err, res){
	done();
	});
	});
	
	
	test('1. Active User', function(done){
	    request
	    	.get('/active')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
			
		
			
});*/

