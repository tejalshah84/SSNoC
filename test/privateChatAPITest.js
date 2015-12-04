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
	
	test('1.Getting private chats sent by individual', function(done){
		request
		.get('/api/messages/privatechat/'+current_user.username)
		.expect('Content-Type', /json/)
		.expect(200) 
		.end(function(err, res){
			expect(res.body).to.be.an('array');
			should.not.exist(err);
			done();
		});
	  });		
	
	test('1A.Getting private chats sent by individual', function(done){
		request
		.get('/api/messages/privatechat/AmrataK')
		.expect('Content-Type', /json/)
		.expect(200) 
		.end(function(err, res){
			expect(res.body).to.be.an('array');
			for(var i=0; i<10; i++){
			expect(res.body[i].chatauthor_id).to.be(2);
			expect(res.body[i].userauthor_id.username).to.be('AmrataK');
			}
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
	
	
	test('2A. Getting private chats between two people on ID basis', function(done){
	    request
	    	.get('/api/messages/privatechat/2/4')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					expect(res.body).to.be.an('array');
					for(var i=0; i<10; i++){
					expect(res.body[i].chatauthor_id).to.be(2);
					expect(res.body[i].chattarget_id).to.be(4);
					}
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
	
	test('3A. Getting private chats between two people on Name basis', function(done){
	    request
	    	.get('/api/messages/privatechat/AmrataK/EileenW')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					expect(res.body).to.be.an('array');
					for(var i=0; i<res.body.length; i++){
					expect(res.body[i].chatauthor_id).to.be(2);
					expect(res.body[i].chattarget_id).to.be(4);
					expect(res.body[i].userauthor_id.username).to.be('AmrataK');
					expect(res.body[i].usertarget_id.username).to.be('EileenW');
					}
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
					expect(res.body).to.be.an('array');
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
					expect(res.body).to.be.an('array');
					should.not.exist(err);
					done();
				});
	});
			
	test('5A. Getting private chats on ID basis', function(done){
	    request
	    	.get('/api/messages/privateMessage/7')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					expect(res.body).to.be.an('array');
					for(var i=0; i<res.body.length; i++){
						expect(res.body[i].id).to.be(7);
						expect(res.body[i].chatauthor_id).to.be(2);
						expect(res.body[i].chattarget_id).to.be(4);
//						expect(res.body[i].chatmessage).to.be('MOCHA-TEST');
						}
						
					should.not.exist(err);
					done();
				});
	});

});
 