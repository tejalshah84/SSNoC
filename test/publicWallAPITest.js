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
			should.not.exist(err);
			done();
		});
	  });		
	
		
	test('2. Getting public messages posted on wall by ID', function(done){
	    request
	    	.get('/api/messages/wall/'+[0-9])
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	/*
	test('3. Getting public messages posted by User', function(done){
	    request
	    	.get('/api/messages/wall/'+current_user.username+'/'+target_user.username)
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	
	
	test('4. Create private chat message into the database', function(done){ 
		//	userModel.create(new_user).then(function(user){
		models.privatechathistory.create(models, new_privmsg, function(privatechathistory) {	
				createdPrivMsg = privatechathistory; 
				expect(200);
				expect(createdPrivMsg.chatmessage).to.be.eql(new_privmsg.chatmessage);
				done();
		  });
		});
*/
			
});
 