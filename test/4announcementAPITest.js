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

	

suite('Announcement API', function(){
	
	
	test('1. Getting all announcement', function(done){
	    request
	    	.get('/api/messages/announcement')
				.end(function(err, res){
					should.not.exist(err);
					expect(res).to.have.property('statusCode');
					expect(res.statusCode).to.equal(200);
					expect('Content-Type', /json/)
					expect(res).to.have.property('body');			
					expect(res.body).to.be.an('array');
					expect(res.body.length).to.be.above(5);
					for(var i=0; i<res.body.length; i++){
						expect(res.body[i]).to.have.property('id');
						expect(res.body[i]).to.have.property('publisher_userid');
						expect(res.body[i]).to.have.property('content');
					}
					done();
				});
	});
			
	test('2. Getting a particular announcement', function(done){
	    request
	    	.get('/api/messages/announcement/'+announcement.id)
				.end(function(err, res){
					should.not.exist(err);
					expect(res).to.have.property('statusCode');
					expect(res.statusCode).to.equal(200);
					expect('Content-Type', /json/)
					expect(res).to.have.property('body');			
					expect(res.body).to.be.an('object');
					expect(res.body.length).to.equal(1);
					done();
				});
	});
	
	test('3. Getting the latest announcement', function(done){
  	request
  		.get('/api/messages/announcement/latest')
			.expect('Content-Type', /json/)
			.expect(200) 
			.end(function(err, res){
				should.not.exist(err);
				expect(res).to.have.property('statusCode');
				expect(res.statusCode).to.equal(200);
				expect(res).to.have.property('body');			
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('id');
				expect(res.body).to.have.property('publisher_userid');
				expect(res.body).to.have.property('content');			
				done();
			});

	});
	
	test('4. Posting a new annoucnement and insert it into database', function(done){
		request
			.post('/api/messages/announcement')
			.send(data)
			.end(function(err, res){
				should.not.exist(err);
				expect(res).to.have.property('statusCode');
				expect(res.statusCode).to.equal(200);
				expect(res).to.have.property('body');			
				expect(res.body).to.be.an('object');
				expect(res.body).to.have.property('id');
				expect(res.body).to.have.property('publisher_userid', data.publisher_userid );
				expect(res.body).to.have.property('content', data.content);			
				done();
			});
	});		
	
			
});
 