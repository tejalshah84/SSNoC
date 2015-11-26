var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');


//List all resource categories
router.get('/categories', function(req, res) {
	models.resourcecategory.getCategories(models, function(resources) {
		  res.type('json').status(200).send(resources);
	});
});

//List all categories and types of resources
router.get('/', function(req, res) {
	models.resourcecategory.listAll(models, function(resources){
		res.type('json').status(200).send(resources);
	});
});

//List inventory at resource category and type level
router.get('/catinventory', function(req, res) {
	models.inventory.getCategoryInventory(models, function(inventory) {
		  res.type('json').status(200).send(inventory);
	});
});

//List all inventory at resource type level
router.get('/inventory', function(req, res) {
	models.inventory.getTypeInventory(models, function(inventory) {
		  res.type('json').status(200).send(inventory);
	});
});

//Total requests pending pickup at resource type level
router.get('/reserved', function(req, res) {
	
	models.resourcerequest.getReserved(models, function(resources){
		res.type('json').status(200).send(resources);
	})
});


//Find all resource types for a particular category id
router.get('/:id', function(req, res) {
	models.resourcecategory.getByCategoryID(models, req.params.id, function(resources){
		  res.type('json').status(200).send(resources);
	});
});


//Update Inventory with Donation Amount
router.post('/adddonation', function(req,res){
	var type = Number(req.body.resourcetype);
	var donate = Number(req.body.donation);

	models.inventory.addDonation(models, type, donate, function(nextpage){
		if(nextpage){
			res.render('resourcepage',{
					user: req.session.user
			});	
		}
		else {
			console.log('error updating inventory')
		}
	})

});


module.exports = router;
