var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');
var indexRoutes = require('.././controllers/index.js');
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


suite('Private Chat Functionality Test', function(){
		
	test('1. Create private chat message into the database', function(done){ 
		 models.privatechathistory.createPrivMessage(models, new_privmsg, function(privMsg) {	
					createdPrivMsg = privMsg; 
					expect(200);
					expect(createdPrivMsg.chatmessage).to.be.eql(new_privmsg.chatmessage);
					done();
			  });
			});

	
	test('2. Delete private chat message from Database', function(done){ //Amrata
		done();
	});
});

//suiteTeardown(function (done){
	//models.user.destroyPrivMsg(models, createdPrivMsg.id, function(){
		//	done();
//	});		
//});


