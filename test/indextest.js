var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var search = require('.././controllers/searchController.js');


var app = express();
var url = 'http://localhost:8888';
console.log("start testing!");


suite('Index Route Testing', function(){
	test('Index Route', function(done){
		request(url)
		.get('/')
		.expect('Content-Type', 'text/html')
		.end(function(err, res){
		done();
		 });
	});
	
	
	
	test('Search testing', function(done){
		/*search test = new search();
		expect(test.fetchSearchResults()).to.be.ok();
		done();*/
		request(url)
		.get('/')
		.expect('Content-Type', 'text/html')
		.end(function(err, res){
		done();
		 });
	});
	
	
	
});
