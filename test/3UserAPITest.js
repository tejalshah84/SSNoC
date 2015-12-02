var app = require("../app.js").app;
var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');


///////////////////////////////////////////////////////////////

var person = { 
	'id': 1,
	'firstname': 'Agel',
	'lastname': 'Fu',
	'age': 24,
	'height': 165,
	'weight': 53,
	'location': 'B23, CMU-SV',
	'lastseen': new Date(),
	'description': 'This is a description',
	'missing': 1
};

///////////////////////////////////////////////////////////////


suite('User API', function(){
	
	test('1. Getting all users', function(done){
	    request
	    	.get('/api/users')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('2. Getting a particular users', function(done){
	    request
	    	.get('/api/users/1')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('3. Create a user', function(done){
	  done();
	});
	
	test('4. Update a user', function(done){ //Denise
	  done();
	});
	
	
			
});
 