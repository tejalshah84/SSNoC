var server = require("../app.js").server;
var request = require("supertest").agent(server);
var should = require('should');
var expect = require('expect.js');
var models = require('.././models');


suite('Resource Functions', function(){
	
	
	test('1. Get Reserved', function(done){ 
			models.resourcerequest.getReserved(models, function(list){
		    	expect('Content-Type','application/json');	
		    	expect(list).to.be.an('array');

		    	for (var i; i<list.length; i++){
		    		expect(list[i]).to.have.property('id');
		    		expect(list[i]).to.have.property('quantity_reserved');
		    	}
			});
			done();
	});
	
	test('2. Get My Requests', function(done){ 
			models.resourcerequest.getMyRequests(models, 4, function(requests) {
		    	expect('Content-Type','application/json');	
		    	expect(requests).to.be.an('array');

		    	for (var i; i<requests.length; i++){
		    		expect(requests[i]).to.have.property('requested_by_id');
		    		expect(requests[i].requested_by_id).to.be(4);
		    	}	
			});
			done();
	});
	
	test('3. Get Pending requests', function(done){ 
			models.resourcerequest.getPendingRequests(models, function (requests){
		    	expect('Content-Type','application/json');	
		    	expect(requests).to.be.an('array');

		    	for (var i; i<requests.length; i++){
		    		expect(requests[i]).to.have.property('pickedup_ind');
		    		expect(requests[i].pickedup_ind).to.be('N');
		    		expect(requests[i]).to.have.property('resourcetype');
		    	}	
			});
			done();
	});	

	test('4. Add Resource Donation', function(done){ 
		models.inventory.addDonation(models, 2, 1, function(nextpage){ 
				expect(nextpage).to.be(true);	
		});
				done();
	});

	test('5. List all resources types and categories', function(done){ 
			models.resourcecategory.listAll(models, function(resourcelist){
		    	expect('Content-Type','application/json');	
		    	expect(resourcelist).to.be.an('array');
		    	
		    	for(var key in resourcelist.dataValues){
		    		expect(key).to.have.property('cat_description');
		    		expect(key.resourcetypes).to.be.an('array');
		    		expect(key.resourcetypes[0]).to.have.property('type_description');
		    	}
			});

			done();
	});		


	test('6. Get Inventory Amount for each Resource', function(done){ 
			models.inventory.getCategoryInventory(models, function(inventory){
				expect('Content-Type','application/json');	
		    	expect(inventory).to.be.an('array');

		    	for (var i; i<inventory.length; i++){
		    		expect(inventory[0].resourcetypes).to.be.an('array');
		    		expect(inventory[0].resourcetypes[0]).to.have.property('inventory');
		    		expect(inventory[0].resourcetypes[0].inventory).to.have.property('quantity_inventory');
		    	}	
		    		
				done();
			});
		
	});	


	//This page renders a page so cannot test any return value
	test('7. Add Resource Request', function(done){ 
			models.resourcerequest.addRequest(models, 2, 1, 4, function(msg){
		    	expect('Content-Type','text/html');	
		    	expect(304)
			});
			done();
	});	
	
});
