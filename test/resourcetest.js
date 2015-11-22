
var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
//var app = require('../app.js');
var indexRoutes = require('.././controllers/index.js');

var app = express();
var url = 'http://localhost:8888';


suite('Resource Testing', function(){
	
	test('Reserved Route', function(done){
		request(url)
		.get('/resources/reserved')
		.expect('Content-Type', 'application/JSON')
		.end(function(err, res){
		done();
		 });
	});

	test('Inventory Route', function(done){
		request(url)
		.get('/resources/inventory')
		.expect('Content-Type', 'application/JSON')
		.end(function(err, res){
		done();
		 });
	});

	test('CatInventory Route', function(done){
		request(url)
		.get('/resources/catinventory')
		.expect('Content-Type', 'application/JSON')
		.end(function(err, res){
		done();
		 });
	});


	test('CatID Route', function(done){
		request(url)
		.get('/resources/5')
		.expect('Content-Type', 'application/JSON')
		.end(function(err, res){
		done();
		 });
	});

	test('Donation Route', function(done){
		request(url)
		.post('/resources/adddonation')
		.send({
			resourcetype: 1,
			donation: 2
		})
		.expect('Content-Type', 'text/html')
		.end(function(err, res){
		done();
		 });
	});

		
	
});