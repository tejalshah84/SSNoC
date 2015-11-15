var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var search = require('.././controllers/searchController.js');


var app = express();
var url = 'http://localhost:8888';


suite('Private Chat Testing', function(){
	
	setup(funtction(){
		
	});
	teardown(function() {
	    //clean up after tests
	});
	
	
	test('Index Route', function(done){
		request(url)
		.get('/')
		.expect('Content-Type', 'text/html')
		.end(function(err, res){
		done();
		 });
	});
	
	
	
	
	
	
});

