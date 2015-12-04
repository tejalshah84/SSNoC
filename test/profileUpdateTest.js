var express = require('express');
var expect = require('expect.js');
var request = require('supertest');

var should = require('should');
var indexRoutes = require('.././controllers/index.js');

var models = require('.././models');
var userModel = require('.././models/user.js');

var server = require("../app.js").server;

var util = require('../util/util.js');
var url = 'http://localhost:8888';


///////////////////////////////////////////////////////////////

/*

var current_user = {
	'id': 4,
	'username': 'EileenW'
};

var user = { 
	'username': 'abc',
	'roleid': 2
};

*/


///////////////////////////////////////////////////////////////


suite('Profile Update Test', function(){
	
		test('1. ProfileUpdate', function(done){
			request(url)
			.get('/profile')
			.expect('Content-Type', /json/)
			.end(function(err, res){
			done();
			});
			});
			
	
		
	
});




