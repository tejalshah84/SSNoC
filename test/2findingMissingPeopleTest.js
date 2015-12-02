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
	
	
	test('Create New Missing Person', function(done){ 
			models.missingperson.createMissingPerson(models, new_person, '', current_user, function(person) {
				missing_person = person; 
				expect(200);
				expect(missing_person.firstname).to.be.eql(new_person.firstname);
				done();
			});
	});
	
	test('Found Missing Person', function(done){
		services.foundMissingPerson(missing_person.id, {}, function(person){
			expect(200);
			expect(person['dataValues'].missing).to.be.eql(0);
			done();	
		});
	});
	
});