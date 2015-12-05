var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
var models = require('.././models');

var services = require('../util/missingPeople.js');

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

var missing_person;

///////////////////////////////////////////////////////////////


suite('Finding Missing People Test', function(){
	
	
	test('1. Create New Missing Person and insert it to database', function(done){ 
			models.missingperson.createMissingPerson(models, new_person, '', current_user, function(person) {
				missing_person = person; 
				expect(200);
				expect(missing_person.firstname).to.be.eql(new_person.firstname);
				expect(missing_person.lastname).to.be.eql(new_person.lastname);
				expect(missing_person.missing).to.be.eql(1);
				done();
			});
	});
	
	test('2. Found Missing Person and mark the person as found', function(done){
		services.foundMissingPerson(missing_person.id, {}, function(person){
			expect(200);
			expect(missing_person.firstname).to.be.eql(new_person.firstname);
			expect(missing_person.lastname).to.be.eql(new_person.lastname);
			expect(person['dataValues'].missing).to.be.eql(0);
			done();	
		});
	});
	
	suiteTeardown(function (done){
		models.missingperson.destroyMissingPerson(models, missing_person.id, function(){
				done();
		});
	});					
	
});