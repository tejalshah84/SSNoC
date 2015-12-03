//var app = require("../app.js").app;
var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var expect = require('expect.js');



///////////////////////////////////////////////////////////////

var announcement = { 
	'id': 1
};
var new_announcement;

var data = {
	publisher_userid: 4,
	content: 'This is a testing post',
  createdAt: new Date()
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
		
			
});
 