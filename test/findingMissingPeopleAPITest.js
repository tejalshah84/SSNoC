var app = require("../app.js").app;
var server = require("../app.js").server;
var request = require("supertest").agent(server);

//////////////////////////////////

var person = { 
	'id': 1,
	'firstname': 'Agel',
	'lastname': 'Fu',
	'age': 24,
	'height': 165,
	'weight': 53,
	'location': 'B23, CMU-SV',
	'lastseen': new Date(),
	'description': 'This is a description',
	'missing': 1
};

suite('Missing Person API', function(){
	
	setup(function (done){
	        // Create any objects that we might need
		server.close();
		        done();
	    });
	
	test('Getting all missing person', function(done){
	    request
	    	.get('/missing')
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res){
				//	console.log("*****************");
				//	console.log(JSON.stringify(res));
					done();
				});
	});
			
	/*test('Getting all missing person', function(done){
	    agent.get(HOST+'/missing')
	    
			
	      expect(err).to.not.be.ok();
	      expect(res).to.have.property('statusCode');
	      expect(res).to.have.property('body');
	      expect(res.statusCode).to.equal(200);
	      expect(res.body).to.be.an('array');
	      done();
	    });
	  });
		*/
/*		test('Getting a particular missing person', function(done){
		        agent.get(HOST+'/missing/'+person.id)
		        .end(function(err, res){
		          expect(res.body).to.have.property('firstname');
		          expect(res.body).to.have.property('lastname');
		          expect(res.body).to.have.property('age');
		          expect(res.body.age).to.be.a('number');
		          done();
		        });
		    });
				
				test('Getting missing people', function(done){
				      agent.get(HOST+'/missing/missing')
				      .end(function(err, res){
			          expect(err).to.not.be.ok();
			          expect(res).to.have.property('statusCode');
			          expect(res).to.have.property('body');
			          expect(res.statusCode).to.equal(200);
			          expect(res.body).to.be.an('object');
			          done();
				      });
				    });
	
						test('Getting missing people that are found', function(done){
						      agent.get(HOST+'/missing/found')
						      .end(function(err, res){
					          expect(err).to.not.be.ok();
					          expect(res).to.have.property('statusCode');
					          expect(res).to.have.property('body');
					          expect(res.statusCode).to.equal(200);
					          expect(res.body).to.be.an('object');
					          done();
						      });
						    });		*/		
});
 