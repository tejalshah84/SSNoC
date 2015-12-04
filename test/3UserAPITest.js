var app = require("../app.js").app;
var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var expect = require('expect.js');



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
					expect(res).to.have.property('statusCode');
					expect(res).to.have.property('body');
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.be.an('array');
					for(var i=0; i<res.body.length; i++){
						expect(res.body[i]).to.have.property('id');
						expect(res.body[i]).to.have.property('username');
					}
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
					expect(res).to.have.property('statusCode');
					expect(res).to.have.property('body');
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('id', 1);
					expect(res.body).to.have.property('username');
					done();
				});
	});
			
});
 