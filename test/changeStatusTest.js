var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');



suite('User Status', function(){
	
	test('1. Show User Status', function(done){
	    request
	    	.get('/status/status/1')
				.expect('Content-Type', /json/)
				//.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
});