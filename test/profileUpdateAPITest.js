var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var expect = require('expect.js');






suite('Admin Profile API', function(){
	
	
	test('1. admin active', function(done){
	    request
	    	.get('/admin/active')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					expect(res).to.have.property('statusCode');
					expect(res).to.have.property('body');
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.be.an('object');
					for(var i=0; i<res.body.length; i++){
						expect(res.body[i]).to.have.property('status_id');
					}					
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
					expect(res).to.have.property('statusCode');
					expect(res).to.have.property('body');
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.be.an('object');
					for(var i=0; i<res.body.length; i++){
						expect(res.body[i]).to.have.property('status_id');
					}
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
					expect(res).to.have.property('statusCode');
					expect(res).to.have.property('body');
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('accountStatus', 1);
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
					expect(res).to.have.property('statusCode');
					expect(res).to.have.property('body');
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.property('accountStatus', 0);
					done();
				});
	});
		

			
});