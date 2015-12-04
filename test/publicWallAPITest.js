//var app = require("../app.js").app;
var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var models = require('.././models');
var expect = require('expect.js');
///////////////////////////////////////////////////////////////
var current_user = {
		'id': 2,
		'username': 'AmrataK'
	};


var new_pubmsg = { 
		'chatauthor_id': 2,
		'chatmessage': 'For Mocha on Public wall',
	};

var createdPubMsg;


///////////////////////////////////////////////////////////////

	
suite('Public Chat API Test Suite', function(){
	
//	suiteTeardown(function (done){
//		server.close(done);
//		return done();
//	});
	
	test('1.Getting all public msgs posted on wall', function(done){
		request
		.get('/api/messages/wall')
		.expect('Content-Type', /json/)
		.expect(200) 
		.end(function(err, res){
			expect(res.body).to.be.an('array');
			should.not.exist(err);
			done();
		});
	  });		
	
		
	test('2. Getting public messages posted on wall by ID', function(done){
	    request
	    	.get('/api/messages/wall/10')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					expect(res.body).to.be.an('array');
					for(var i=0; i<res.body.length; i++){
					expect(res.body[i].id).to.be(10);
					}
					should.not.exist(err);
					done();
				});
	});
	
	
	test('3. Getting public messages posted by User by id', function(done){
	    request
	    	.get('/api/messages/wall/userMsgs/'+current_user.id)
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					expect(res.body).to.be.an('array');
					should.not.exist(err);
					done();
				});
	});
	
	test('3A. Getting public messages posted by User by id', function(done){
	    request
	    	.get('/api/messages/wall/userMsgs/2')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					expect(res.body).to.be.an('array');
					for(var i=0; i<res.body.length; i++){
					expect(res.body[i].chatauthor_id).to.be(2);
					}
					should.not.exist(err);
					done();
				});
	});
	
	
	test('4. Getting public messages posted by User by UserName', function(done){
	    request
	    	.get('/api/messages/wall/userMsgs/'+current_user.username)
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					expect(res.body).to.be.an('array');
					should.not.exist(err);
					done();
				});
	});

	test('4A. Getting public messages posted by User by UserName', function(done){
	    request
	    	.get('/api/messages/wall/userMsgs/AmrataK')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					expect(res.body).to.be.an('array');
					for(var i=0; i<res.body.length; i++){
						expect(res.body[i].chatauthor_id).to.be(2);
						expect(res.body[i].user.username).to.be('AmrataK');
						}
						should.not.exist(err);
					done();
				});
	});

});
 