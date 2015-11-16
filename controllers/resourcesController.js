var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');


var ifSignIn = function (req, res, next) {
	if (req.session && req.session.user) { 
		console.log('~~~~~~~~~~~~~~~ Session exist!!!');
		next();
	}else{
		res.redirect('/signin');
	}  
}


router.get('/', function(req, res) {
	models.resourcecategory.findAll({
		attributes: ['id', 'cat_description'],
		include: [{model: models.resourcetype, attributes: ['id','type_description','units']}],
		order: 'resourcecategory.id ASC'
	}).then(function (resources) {
		  res.json(resources);
	});
});

router.get('/resourcepage', ifSignIn, function(req, res) {

	res.render('resourcepage',{
		user: req.session.user
	  });	
});

router.get('/resourcedonation', ifSignIn, function(req, res) {
	console.log('@@@@@@@@@@ResourceDonation');
		res.render('resourcedonation',{
		user: req.session.user
	  	});	
});

router.get('/categories', function(req, res) {
	models.resourcecategory.findAll({
		attributes: ['id', 'cat_description'],
		order: 'resourcecategory.id ASC'
	}).then(function (resources) {
		  res.json(resources);
	});
});


router.get('/catinventory', function(req, res) {
	console.log('router catinventory enter');
	models.resourcecategory.findAll({
		attributes: ['id', 'cat_description'],
		include: [{model: models.resourcetype, attributes: ['id','type_description','units'],
				 include: [{model: models.inventory, required: false, attributes: ['quantity_inventory']}]
		}],
		order: 'resourcecategory.id ASC'
	}).then(function (resources) {
		  res.json(resources);
	});
});

router.get('/inventory', function(req, res) {
	models.resourcetype.findAll({
			attributes: ['id'],
			include: [{model: models.inventory, required: false, attributes: ['quantity_inventory']}],
			order: 'resourcetype.id ASC'
	}).then(function (resources) {
		  res.json(resources);
	});
});


router.get('/reserved', function(req, res) {
	console.log('router reserved enter');
	models.resourcetype.findAll({
		attributes: ['id', [models.sequelize.fn('SUM', models.sequelize.col('quantity_requested')), 'quantity_reserved']],
		include: [{model: models.resourcerequest, required: false, attributes: [], where: {pickedup_ind: "N"}}],
		group: ['resourcetype.id'],
		order: 'resourcetype.id ASC'
	}).then(function (resources) {
		  res.json(resources);
	});
});


router.post('/adddonation', function(req,res){
	var type = Number(req.body.resourcetype);
	console.log(type);
	var donate = Number(req.body.donation);

	models.inventory.findOne({
		  where: {
		    resource_type_id: type
			}
	}).then(function (result) {
		if (!result){
			models.inventory.create({
				resource_type_id: type,
				quantity_inventory: donate
			}).then(function(){
				res.render('resourcepage',{
					user: req.session.user
	  			});	
			})
		}
		else{
			var available = result.quantity_inventory + donate;
			result.update({
				quantity_inventory: available
			}).then(function(){
				res.render('resourcepage',{
					user: req.session.user
	  			});	
			})
		}
	})

});


router.get('/allrequests', function(req, res) {
	models.resourcerequest.findAll({
		where: {
			pickedup_ind: 'N'
		},
		order: 'requested_date DESC'
	}).then(function (requests) {
		  res.json(requests);
	});
});


router.get('/myrequests/:id', function(req, res) {
	models.resourcerequest.findAll({
		where: {
			requested_by_id: req.params.id
		},
		order: 'requested_date DESC'
	}).then(function (requests) {
		  res.json(requests);
	});
});


router.get('/:id', function(req, res) {
	models.resourcetype.findAll({
		attributes: ['id', 'type_description','units'],
		  where: {
		    resource_cat_id: req.params.id
		   },
		   order:'type_description ASC'
	}).then(function (resources) {
		  res.json(resources);
	});
});



module.exports = router;
