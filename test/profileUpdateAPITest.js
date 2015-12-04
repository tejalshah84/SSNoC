var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');





suite('Admin Profile API', function(){
	
	
	test('1. admin active', function(done){
	    request
	    	.get('/admin/active')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('2. admin Inactive', function(done){
	    request
	    	.get('/admin/inactive')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	test('3. Activate an user', function(done){
	    request
	    	.get('/admin/active/1')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
	
	
	test('4. Inactivate an user', function(done){
	    request
	    	.get('/admin/inactive/1')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
		

			
});