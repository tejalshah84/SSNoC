
var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var appstart = require('../app.js');
var indexRoutes = require('.././controllers/index.js');

//var app = express();
var url = 'http://localhost:8888';



suite('Resource REST Testing', function(){
	
	test('Reserved Resources List', function(done){
		request(url)
		.get('/resources/reserved')
		.end(function (err, res){
			expect(err).to.not.be.ok();
			expect('Content-Type','application/JSON');
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.be(7);
			expect(res.body[0]).to.have.property('quantity_reserved');
			done();
		})
	});

	test('Inventory List', function(done){
		request(url)
		.get('/resources/inventory')
		.end(function(err, res){
			expect('Content-Type', 'application/JSON')
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.be(7);
			expect(res.body[0]).to.have.property('inventory');
			done();
		 });
	});

	test('CatInventory List', function(done){
		request(url)
		.get('/resources/catinventory')
		.end(function(err, res){
			expect('Content-Type', 'application/JSON')
			expect(res.body).to.be.an('array');
			expect(res.body[0]).to.have.property('resourcetypes');
			expect(res.body[0].resourcetypes).to.be.an('array');
			done();
		});
	});


	test('Invalid Category ID Test', function(done){
		request(url)
		.get('/resources/5')
		.end(function(err, res){
			expect('Content-Type', 'application/JSON');
			expect(res.body).to.be.an('array');
			expect(res.body.length).to.be(0);
			done();
		 });
	});

	
	test('Resource List By Category ID', function(done){
		request(url)
		.get('/resources/2')
		.end(function(err, res){
			expect('Content-Type', 'application/JSON');
			expect(res.body).to.be.an('array');

			for (var i=0; i<res.body.length; i++){
				expect([6,5,7]).to.contain(res.body[i].id);
			}

			done();
		 });
	});

		
	
});