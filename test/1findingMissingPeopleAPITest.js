//var app = require("../app.js").app;
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

	suiteSetup(function (done){
		server.close(done);
	});

suite('Missing Person API', function(){
	

	
	test('1. Getting all missing person', function(done){
	    request
	    	.get('/missing')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					expect(res).to.have.property('statusCode');
					expect(res).to.have.property('body');
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.be.an('array');
					for(var i=0; i<res.body.length; i++){
						expect(res.body[i]).to.have.property('firstname');
						expect(res.body[i]).to.have.property('lastname');
					} 
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
					expect(res).to.have.property('statusCode');
					expect(res).to.have.property('body');
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('firstname');
					expect(res.body).to.have.property('lastname');
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
				expect(res).to.have.property('statusCode');
				expect(res).to.have.property('body');
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.be.an('array');
				for(var i=0; i<res.body.length; i++){
					expect(res.body[i]).to.have.property('firstname');
					expect(res.body[i]).to.have.property('lastname');
					expect(res.body[i].missing).to.eql(1);
				} 
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
				expect(res).to.have.property('statusCode');
				expect(res).to.have.property('body');
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.be.an('array');
				for(var i=0; i<res.body.length; i++){
					expect(res.body[i]).to.have.property('firstname');
					expect(res.body[i]).to.have.property('lastname');
					expect(res.body[i].missing).to.eql(0);
				} 
				done();
			});
	});		
	
	
			
});
 