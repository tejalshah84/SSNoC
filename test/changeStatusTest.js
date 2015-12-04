var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var expect = require('expect.js');
var models = require('.././models');


var data = {
	userid: 4,
	statusid: 1
};

suite('Change user status', function(){
	
	test('1. Change User Status', function(done){
		models.user.updateUserStatus(models, data, function(user){
			models.user.findById(models, data.userid, function(result){
				expect(result['dataValues'].id).to.be.eql(data.userid);
				expect(result['dataValues'].statusid).to.be.eql(data.statusid);
				done();
			});
		});
	});
	
});