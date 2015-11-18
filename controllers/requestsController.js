var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');




router.get('/myrequests/:id', function(req, res){
	models.resourcerequest.findAll({
		attributes: ['id','quantity_requested','requested_by_id','pickedup_ind','requested_date','pickedup_date'],
		where: {
			requested_by_id: req.params.id
		},
		include: [{model: models.resourcetype, attributes: ['id','type_description','units'],
				 include: [{model: models.resourcecategory, required: false, attributes: ['id','cat_description']}]
		}],
		order: [['pickedup_ind','ASC'],['requested_date','DESC']]
	}).then(function (requests) {
		  res.json(requests);
	});

});

router.get('/pendingrequests', function(req, res){
	models.resourcerequest.findAll({
		attributes: ['id','quantity_requested','pickedup_ind','requested_date', 'requested_by_id'],
		where: {
			pickedup_ind: 'N'
		},
		include: [{model: models.user, as: 'requestby', attributes: ['id','username']},
				  {model: models.resourcetype, attributes: ['id','type_description','units'],
				    include: [{model: models.resourcecategory, required: false, attributes: ['id','cat_description']}]
		}],
		order: [['requested_date','DESC'], ['requested_by_id','ASC']]
	}).then(function (requests) {
		  res.json(requests);
	});

});


router.post('/addrequest', function(req,res){
	var type = Number(req.body.resourcetype);
	var requested = Number(req.body.requested);
	var requser = Number(req.body.requser);

	console.log(type);
	console.log(requested);
	console.log(requser);


	models.inventory.findOne({
		  where: {
		    resource_type_id: type
			}
	}).then(function (result) {
		if (!result){
			
			res.render('requestresource',{
					error: "Resource is not available anymore",
					user: req.session.user
	  		});	

		}
		else{

			if (requested > result.quantity_inventory){
				
				res.render('requestresource',{
					error: "Insufficient Resource Quantity",
					user: req.session.user
	  			});	
			}
			else {
			var available = (result.quantity_inventory - requested);
				
				result.update({
					quantity_inventory: available
				}).then(function(){
				models.resourcerequest.create({ 
					resource_type_id: type, 
					quantity_requested: requested,
					requested_by_id: requser,
					requested_date: new Date().toLocaleString(),
					pickedup_ind: 'N'
				}).then(function() {
					res.render('myrequestpage',{
						user: req.session.user
					});	
				});
				})
			}
						
		}
	})
});


router.post('/updatepicked', function(req, res){

	var list = req.body.list;

	for(var i=0; i<list.length; i++){

		models.resourcerequest.findOne({
			where:{
				id: Number(list[i])
			}
		}).then(function(request){
			request.update({
				pickedup_ind: req.body.pickind,
				pickedup_date: req.body.pickdate,
				pickedup_from_id: req.body.pickfrom
			}).then(function(){

				var restype = request.resource_type_id;

				if(req.body.pickind==="X"){

					models.inventory.findOne({
						where:{
							resource_type_id: restype
						}
					}).then(function(resource){

						var available = resource.quantity_inventory + request.quantity_requested;

						resource.update({
							quantity_inventory: available
						})

					})
				}
			}).then(function(){
				res.json({});
			})
		}).catch(function(){
			console.log('error occured while updating picked in');
		})

	}
	
});



router.get('/requestpickup', function(req, res){
	models.resourcerequest.findAll({
		where: {
			pickedup_ind: 'N'
		},
		order: 'requested_date DESC'
	}).then(function (requests) {
		  res.json(requests);
	});

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


router.get('/:id', function(req, res) {
	models.resourcerequest.findAll({
		where: {
			requested_by_id: req.params.id
		},
		order: 'requested_date DESC'
	}).then(function (requests) {
		  res.json(requests);
	});
});




module.exports = router;