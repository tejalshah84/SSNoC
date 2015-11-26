var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');



//Get all resource requests submitted by a paritcular user
router.get('/myrequests/:id', function(req, res){
	
	models.resourcerequest.getMyRequests(models, req.params.id, function(requests){
		  res.type('json').status(200).send(requests);
	});

});

//Get all requests that have not been picked up yet
router.get('/pendingrequests', function(req, res){
	models.resourcerequest.getPendingRequests(models, function (requests) {
		  res.type('json').status(200).send(requests);
	});

});


//Add New Request and Update Inventory
router.post('/addrequest', function(req,res){
	var type = Number(req.body.resourcetype);
	var requested = Number(req.body.requested);
	var requser = Number(req.body.requser);

	models.resourcerequest.addRequest(models, type, requested, requser, function(msg){
		if (msg){
			res.render('requestresource',{
					error: msg,
					user: req.session.user
	  		});
		}
		else{
			res.render('myrequestpage',{
						user: req.session.user
			});
		}

	})
});


//Update Pickedup indicator in requests table and update inventory as appropriate
router.post('/updatepicked', function(req, res){

	models.resourcerequest.updateAllRequests(models, req, function(){
		res.type('json').status(200).send({});
	})

});



module.exports = router;