var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var expect = require('expect.js');


suite('Search API', function(){

	//Testing that usernames returned in search result, all match search criteria
	test('1. Search Username', function(done){
	    request
	    	.get('/search')
	    	.query({
				searchCriteria: "Citizen",
				searchText: "Tej",
				pageCount: 0
			})
	    	.end(function (err, res){
	    		if(err){
	    			return done(err);
	    		}
		    	expect('Content-Type','application/json');	
		    	expect(res.body).to.be.an('object');
		    	expect(res.body.offline).to.be.an('object');

		    	for (var key in res.body.offline){
		    		if(res.body.offline.hasOwnProperty(key)){
		    			var val = (key.indexOf("Tej")<0?0:1)
		    			expect(val).to.be(1);
		    		}
		    	}	
				done();
			});
	});

	//Testing that userstatus returned in search results all match search criteria
	test('2. Search UserStatus', function(done){
	    request
	    	.get('/search')
	    	.query({
				searchCriteria: "Citizen Status",
				searchText: 4,
				pageCount: 0
			})
	    	.end(function (err, res){
	    		if(err){
	    			return done(err);
	    		}
		    	expect('Content-Type','application/json');	
		    	expect(res.body).to.be.an('object');
		    	expect(res.body.offline).to.be.an('object');

		    	for (var key in res.body.offline){
		    		if(res.body.offline.hasOwnProperty(key)){
		    			var val = res.body.offline[key].status_id
		    			expect(val).to.be(4);
		    		}
		    	}	
				done();
			});
	});


	//Testing that announcement search results all contain search text
	test('3. Search Announcements', function(done){
	    request
	    	.get('/search')
	    	.query({
				searchCriteria: "Announcements",
				searchText: "yoyoyo",
				pageCount: 0
			})
	    	.end(function (err, res){
	    		if(err){
	    			return done(err);
	    		}
		    	expect('Content-Type','application/json');	
		    	expect(res.body.rows).to.be.an('array');
		    	expect(res.body.rows[0]).to.have.property('content');

		    	for (var i=0; i<res.body.rows.length; i++){
		    		
		    			var val = (res.body.rows[i].content).indexOf("Please");
		    			val = val<0?0:1
		    			expect(val).to.be(1);
		    	}
		    	
				done();
			});
	});		
	
	
	//Testing that public messages search results all contain search text
	test('4. Search Public Messages', function(done){
	    request
	    	.get('/search')
	    	.query({
				searchCriteria: "Public Messages",
				searchText: "Hello",
				pageCount: 0
			})
	    	.end(function (err, res){
	    		if(err){
	    			return done(err);
	    		}
		    	expect('Content-Type','application/json');	
		    	expect(res.body.rows).to.be.an('array');
		    	expect(res.body.rows[0]).to.have.property('chatauthor_id');

		    	if(res.body.rows.length === 0){
		    		expect(res.body.count).to.be(0);
		    	}
		    	else{
		    		for (var i=0; i<res.body.rows.length; i++){

		    			var val = (res.body.rows[i].chatmessage).indexOf("Hello");
		    			val = val<0?0:1
		    			expect(val).to.be(1);
		    		}
		    	}
		    	
				done();
			});
	});



	//Testing that private messages search results all contain search text
	test('5. Search Private Messages', function(done){
	    request
	    	.get('/search')
	    	.query({
				searchCriteria: "Private Messages",
				searchText: "Hello",
				pageCount: 0,
				authorid: 7
			})
	    	.end(function (err, res){
	    		if(err){
	    			return done(err);
	    		}
		    	expect('Content-Type','application/json');	
		    	expect(res.body.rows).to.be.an('array');
		    	expect(res.body.rows[0]).to.have.property('chattarget_id');

		    	if(res.body.rows.length === 0){
		    		expect(res.body.count).to.be(0);
		    	}
		    	else{
		    		for (var i=0; i<res.body.rows.length; i++){
		    			var val = (res.body.rows[i].chatmessage).indexOf("Hello");
		    			val = val<0?0:1
		    			expect(val).to.be(1);
		    		}
		    	}
		    	
				done();
			});
	});


	//Testing that public messages search containing only stop words returns appropriate message
	test('6. Search with stop words', function(done){
	    request
	    	.get('/search')
	    	.query({
				searchCriteria: "Public Messages",
				searchText: "How are",
				pageCount: 0
			})
	    	.end(function (err, res){
	    		if(err){
	    			return done(err);
	    		}
		    	expect('Content-Type','application/json');	
		    	expect(res.body).to.be.an('object');
		    	expect(res.body).to.have.property('error');
				var val = (res.body.error).indexOf("stop");
		    	val = val<0?0:1
		    	expect(val).to.be(1);
		    	
				done();
			});
	});


	//Testing that search page is checking for active session
	test('7. Render Search Page', function(done){
	    request
	    	.get('/searchpage')
	    	.end(function (err, res){
	    		if(err){
	    			return done(err);
	    		}
	    	expect('Content-Type','text/html');	
	    	expect('Location','/signin');
	    	expect(302);	
			done();
		});
	});		
});


