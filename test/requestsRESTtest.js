var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var appstart = require('../app.js');
var indexRoutes = require('.././controllers/index.js');

//var app = express();
var url = 'http://localhost:8888';


suite('Requests REST Testing', function(){
	
	test('My Requests List', function(done){
		request(url)
		.get('/requests/myrequests/5')
		.end(function (err, res){
			expect(err).to.not.be.ok();
			expect('Content-Type','application/JSON');
			expect(res.body).to.be.an('array');

			for (var i=0; i<res.body.length; i++){
				expect(res.body[i].requested_by_id).to.be(5);
			}

			done();
		})
	});


	test('Pending Requests', function(done){
		request(url)
		.get('/requests/pendingrequests')
		.end(function (err, res){
			expect(err).to.not.be.ok();
			expect('Content-Type','application/JSON');
			expect(res.body).to.be.an('array');

			for (var i=0; i<res.body.length; i++){
				expect(res.body[i].pickedup_ind).to.be('N');
			}
			done();
		})
	});

	
		
	
});