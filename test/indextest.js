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



suite('Route Test', function(){
	
//	suiteTeardown(function (done){
//		server.close(done);
//		return done();
//	});
	
	
	test('1. Request to / is made and answered', function(done){
	    request
	    	.get('/')
				.expect(200) 
				//.expect('Content-Type', 'text/html')
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('2. Request to /community is made before signin and is redirected', function(done){
	    request
	    	.get('/community')
				.expect(302) 
        .expect('Location', '/signin')
				//.expect('Content-Type', 'text/plain')
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('3. Request to /admin is made before signin and is redirected', function(done){
	    request
	    	.get('/admin')
				.expect(302) 
        .expect('Location', '/signin')
				//.expect('Content-Type', 'text/plain')
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('4. Request to /profile is made before signin and is redirected', function(done){
	    request
	    	.get('/profile')
				.expect(302) 
        .expect('Location', '/signin')
				//.expect('Content-Type', 'text/plain')
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('5. Request to /missing/deck is made before signin and is redirected', function(done){
	    request
	    	.get('/missing/deck')
				.expect(302) 
        .expect('Location', '/')
				//.expect('Content-Type', 'text/plain')
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
			
	
			
});
 