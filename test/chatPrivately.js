var express = require('express');
var expect = require('expect.js');
var request = require('supertest');
var should = require('should');

var routes = require('.././contollers');
var models = require('.././models');

var util = require('.././util/util.js');
var onlineUsers = require('.././lib/onlineUsers.js');

var app = express();
var url = 'http://localhost:8888';

var chat1 = { 
	chatauthor: "",
	chattarget: "",
	chatmessage: "", 
	timestamp: new Date()
};

suite('PrivateChatModel', function(){
	test('add', function(done){
			models.privatechathistory.add(chat1, function(err){
				assert.isUndefined(err);
				done();
			});
	});
	
});