var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var models = require('.././models');
var measurePerformance = require('.././lib/measurePerformance.js');

///////////////////////////////////////////////////////////////


var current_user = {
	'id': 4,
	'username': 'EileenW'
};

var new_person = { 
	'firstname': 'Dai',
	'lastname': 'How',
	'age': 26,
	'height': 175,
	'weight': 90,
	'location': 'B19, CMU-SV',
	'lastseen': new Date(),
	'description': 'This is a description',
	'missing': 1
};



///////////////////////////////////////////////////////////////


suite('Measure Performance Test', function(){
	
	
	test('1. getRequestNum() returns {"POST": x, "GET": x}', function(done){ 
		var result = measurePerformance.getRequestNum();
		expect(result).to.exist;
		expect(result).to.have.property('GET');
		expect(result).to.have.property('POST');
		done();
	});
	
	test('2. restart returns {"POST": 0, "GET": 0}', function(done){ 
		measurePerformance.restart();
		var result = measurePerformance.getRequestNum();
		expect(result).to.exist;
		expect(result).to.have.property('GET', 0);
		expect(result).to.have.property('POST', 0);
		done();
	});
	
	test('3. inTest() returns true after test starts', function(done){ 
		measurePerformance.startTest();
		var result = measurePerformance.inTest();
		expect(result).to.exist;
		expect(result).to.equal(true);
		done();
	});
	
	test('4. increPost() should increments the number of POST', function(done){ 
		var result1 = measurePerformance.getRequestNum();
		var result2 = measurePerformance.increPost();
		expect(result2).to.exist;
		expect(result1.POST).to.be.above(result2);
		done();
	});
	
	
					
	
});