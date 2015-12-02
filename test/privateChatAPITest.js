//var app = require("../app.js").app;
var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var models = require('.././models');

///////////////////////////////////////////////////////////////
var current_user = {
		'id': 2,
		'username': 'AmrataK'
	};

var target_user = { 
		'id': 4,
		'username': 'EileenW'
	};

var new_privmsg = { 
		'chatauthor_id': 2,
		'chattarget_id':4,
		'chatmessage': 'For Mocha',
	};

var createdPrivMsg;


///////////////////////////////////////////////////////////////

	
suite('Private Chat API Test Suite', function(){
	
//	suiteTeardown(function (done){
//		server.close(done);
//		return done();
//	});
	
	test('1.Getting private chats for individual', function(done){
		request
		.get('/api/messages/privatechat/'+current_user.username)
		.expect('Content-Type', /json/)
		.expect(200) 
		.end(function(err, res){
			should.not.exist(err);
			done();
		});
	  });		
	
		
	test('2. Getting private chats between two people on id basis', function(done){
	    request
	    	.get('/api/messages/privatechat/'+current_user.id+'/'+target_user.id)
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('3. Getting private chats between two people on name basis', function(done){
	    request
	    	.get('/api/messages/privatechat/'+current_user.username+'/'+target_user.username)
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('4. Getting all private chats', function(done){
	    request
	    	.get('/api/messages/privateMessages')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});

	
	test('5. Getting private chats on ID basis', function(done){
	    request
	    	.get('/api/messages/privateMessage/'+[0-9])
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
			
});
 