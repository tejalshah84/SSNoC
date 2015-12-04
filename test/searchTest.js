var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var expect = require('expect.js');
var models = require('.././models');
var util = require('.././util/util.js');


suite('Search Functions', function(){
	
	
	test('1. Search by Username DB Test', function(done){ 
			models.user.searchUsername(models, "Tej", function(users) {
				
		    	expect('Content-Type','application/json');	
		    	expect(users).to.be.an('array');

		    	for (var i; i<users.length; i++){
		    			var val = ((users[i].username).indexOf("Tej")<0?0:1)
		    			expect(val).to.be(1);
		    	}
			});
			done();
	});
	
	test('2. Search by UserStatus DB Test', function(done){ 
			models.user.searchByStatus(models, 4, function(users) {
				
		    	expect('Content-Type','application/json');	
		    	expect(users).to.be.an('array');

		    	for (var i; i<users.length; i++){
		    			var val = (users[i].statusid)
		    			expect(val).to.be(4);
		    	}	
			});
			done();
	});
	
	test('3. Search for Announcements DB Test', function(done){ 
			models.announcement.searchAnnouncements(models, "Please", 0, function(announcements) {
				
		    	expect('Content-Type','application/json');	
		    	expect(announcements).to.be.an('object');

		    	for (var i; i<announcements.length; i++){
		    			var val = ((announcements[i].content).indexOf("Please")<0?0:1)
		    			expect(val).to.be(1);
		    	}	
			});
			done();
	});	

	test('4. Search for Public Messages DB Test', function(done){ 
			models.chathistory.searchMessages(models, "Hello", 0, function(messages) {
				
		    	expect('Content-Type','application/json');	
		    	expect(messages).to.be.an('object');

		    	for (var i; i<messages.length; i++){
		    			var val = ((messages[i].chatmessage).indexOf("Hello")<0?0:1)
		    			expect(val).to.be(1);
		    	}
	
				
			});
			done();
	});	


	test('5. Search for Private Messages DB Test', function(done){ 
			models.privatechathistory.searchPrivateMessages(models, "Hello", 0, 7, function(messages) {
				
		    	expect('Content-Type','application/json');	
		    	expect(messages).to.be.an('object');

		    	for (var i; i<messages.length; i++){
		    			var val = ((messages[i].chatmessage).indexOf("Hello")<0?0:1)
		    			expect(val).to.be(1);
		    	}	
			});

			done();
	});		


	test('6. Check Only Stop Words', function(done){ 
				
				var str = util.checkSearchWords("How are you"); 
				expect(str).to.be(false);
		    		
				done();
		
	});	


	test('7. Check for Mixed Stop Words Combination', function(done){ 
				
				var str = util.checkSearchWords("How are Tejal"); 
				expect(str.length).to.be(1);
		    		
				done();
		
	});	

	test('8. Check Convert Array to Text Function', function(done){ 
				
				var str = util.convertText(["Tejal","Are","You","There"]); 
				var val = (str.indexOf("%")<0?0:1)
		    	expect(val).to.be(1);
		    	
				done();
		
	});		
});
