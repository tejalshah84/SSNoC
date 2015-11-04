var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././routes/index.js');

var app = express();
var url = 'http://localhost:8888';
console.log("start testing!");

//suite('Route Testing', function(){
describe('Index Route Testing', function(){
	it('Index Route', function(done){
		request(url)
  	.get('/')
  	.expect('Content-Type', 'text/html')
		.end(function(err, res){
			done();
		 });
	});
});
//});









