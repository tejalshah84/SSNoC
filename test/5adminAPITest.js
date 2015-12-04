//var app = require("../app.js").app;
var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var expect = require('expect.js');



///////////////////////////////////////////////////////////////



var data = {
  	chatauthor: 'EileenW',
		chatmsg: 'Testing Message',
    timestamp: new Date()
};

///////////////////////////////////////////////////////////////

	

suite('Admin & Performance API', function(){

	
	test('1. Setup performance measurement', function(done){
	    request
	    	.get('/performance/start_testing')
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					expect('Content-Type', /json/);
					expect(res.body).to.be.an('object');
					expect(res.body.POST).to.exist;
					expect(res.body.POST).to.eql(0);
					expect(res.body.GET).to.exist;
					expect(res.body.GET).to.eql(0);
					done();
				});
	});
			
	test('2. Teardown performance measurement', function(done){
	    request
	    	.get('/performance/end_testing')
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					expect('Content-Type', /json/);
					expect(res.body).to.be.an('object');
					expect(res.body.POST).to.exist;
					expect(res.body.GET).to.exist;
					done();
				});
	});
	
	test('3. Getting all test messages', function(done){
	    request
	    	.get('/test_messages')
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					expect('Content-Type', /json/);
					expect(res).to.have.property('statusCode');
					expect(res.statusCode).to.equal(200);
					expect(res).to.have.property('body');			
					expect(res.body).to.be.an('array');
					for(var i=0; i<res.body.length; i++){
						expect(res.body[i]).to.have.property('id');
						expect(res.body[i]).to.have.property('chatauthor');
						expect(res.body[i]).to.have.property('chatmessage');
					}
					done();
				});
	});

	
	test('4. Create a new test message and insert in into the database', function(done){
	    request
	    	.post('/test_messages')
				.send(data)
				.end(function(err, res){
					should.not.exist(err);
					expect('Content-Type', /json/);
					expect(res).to.have.property('statusCode');
					expect(res.statusCode).to.equal(200);
					expect(res).to.have.property('body');			
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('id');
					expect(res.body).to.have.property('chatauthor', data.chatauthor);
					expect(res.body).to.have.property('chatmessage', data.chatmsg);
					done();
				});
	});
		
			
});
 