var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');

//var routes = require('../contollers');
//var models = require('../models');


var services = require('../util/missingPeople.js');



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
	
	
	
	
	
});
