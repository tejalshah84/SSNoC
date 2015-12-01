var expect = require('expect.js');
var agent = require('superagent');

/*var PORT = process.env.PORT | 8888;
var HOST = 'http://localhost:'+PORT;

// Initiate Server
var debug = require('debug')('Node-API-Testing');
var app = require('../app');

app.set('port', PORT);
app.set('testing', true);

var serverInitialized = function() {
  debug('Express server listening on port ' + PORT);
};

var server = app.listen(app.get('port'), serverInitialized)
.on('error', function(err){
  if(err.code === 'EADDRINUSE'){
    PORT++;
    HOST = 'http://localhost:'+PORT;
    app.set('port', PORT);
    server = app.listen(app.get('port'), serverInitialized)
  }
});*/

var HOST = 'http://localhost:'+8888;
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
	
		
	test('Getting all missing person', function(done){
	    agent.get(HOST+'/missing')
	    .end(function(err, res){
	      expect(err).to.not.be.ok();
	      expect(res).to.have.property('statusCode');
	      expect(res).to.have.property('body');
	      expect(res.statusCode).to.equal(200);
	      expect(res.body).to.be.an('array');
	      done();
	    });
	  });
		
		test('Getting a particular missing person', function(done){
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
						    });				
});
 