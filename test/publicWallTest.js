var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var models = require('.././models');
///////////////////////////////////////////////////////////////

var current_user = {
	'id': 2,
	'username': 'AmrataK'
};

var createdPubMsg;

///////////////////////////////////////////////////////////////


suite('Public Chat Functionality Test', function(){
		
	test('1. Create new public wall msg into database', function(done){ 
		done();
	  });
	
	
	test('2. Delete public wall msg from database', function(done){ //Amrata
		done();
	});
	
});
