//var app = require("../app.js").app;
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

	suiteSetup(function (done){
		server.close(done);
	});

suite('Missing Person API', function(){
	
//	suiteTeardown(function (done){
//		server.close(done);
//		return done();
//	});
	
	
	test('1. Getting all missing person', function(done){
	    request
	    	.get('/missing')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
			
	test('2. Getting a particular missing person', function(done){
	    request
	    	.get('/missing/'+person.id)
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('3. Getting missing people', function(done){
  	request
  		.get('/missing/missing')
			.expect('Content-Type', /json/)
			.expect(200) 
			.end(function(err, res){
				should.not.exist(err);
				done();
			});

	});
	
	test('4. Getting missing people that are found', function(done){
		request
			.get('/missing/found')
			.expect('Content-Type', /json/)
			.expect(200) 
			.end(function(err, res){
				should.not.exist(err);
				done();
			});
	});		
			
});
 