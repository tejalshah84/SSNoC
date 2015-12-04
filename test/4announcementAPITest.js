//var app = require("../app.js").app;
var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');


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
	
//	suiteTeardown(function (done){
//		server.close(done);
//		return done();
//	});
	
	
	test('1. Getting all announcement', function(done){
	    request
	    	.get('/api/messages/announcement')
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
					done();
				});
	});
			
	test('2. Getting a particular announcement', function(done){
	    request
	    	.get('/api/messages/announcement/'+announcement.id)
				.expect('Content-Type', /json/)
				.expect(200) 
				.end(function(err, res){
					should.not.exist(err);
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
				done();
			});

	});
	
	test('4. Post a new annoucnement', function(done){
		request
			.post('/api/messages/announcement')
			.send(data)
			.expect(200) 
			.end(function(err, res){
				should.not.exist(err);
				done();
			});
	});		
	
//	suiteTeardown(function (done){
//		models.announcement.destroyAnnouncement(models, new_announcement.id, function(){
//				done();
//		});
//	});		
			
});
 