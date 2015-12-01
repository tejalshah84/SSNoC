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


suite('Missing Person API', function(){
	
	setup(function (done){
		server.close();
		return done();
	});
	
	
	test('Getting all missing person', function(done){
	    request
	    	.get('/missing')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					return done();
				});
	});
			
	test('Getting a particular missing person', function(done){
	    request
	    	.get('/missing/'+person.id)
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					return done();
				});
	});
	
	test('Getting missing people', function(done){
  	request
  		.get('/missing/missing')
			.expect('Content-Type', /json/)
			.expect(200) 
			.end(function(err, res){
				return done();
			});

	});
	
	test('Getting missing people that are found', function(done){
		request
			.get('/missing/found')
			.expect('Content-Type', /json/)
			.expect(200) 
			.end(function(err, res){
				return done();
			});
	});		
			
});
 