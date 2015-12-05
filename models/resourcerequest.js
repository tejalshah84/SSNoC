var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var resourcerequest = sequelize.define('resourcerequest', {
	  id:{
	    type: Sequelize.INTEGER,
	      primaryKey: true,
	       autoIncrement: true,
	      allowNull:false
	  },
	  resource_type_id:{
	    type: Sequelize.INTEGER,
	      allowNull:false
	  },
	  quantity_requested: {
	    type: Sequelize.INTEGER,
	    allowNull: false,
	    defaultValue: 0
	  },
	  requested_by_id: {
	    type: Sequelize.INTEGER,
	    defaultValue: null
	  },
	  requested_date: {
	    type: Sequelize.DATE,
	    defaultValue: null
	  },
	  pickedup_ind: {
	    type: Sequelize.CHAR(1),
	    defaultValue: 'N'
	  },
	  pickedup_from_id: {
	    type: Sequelize.INTEGER,
	    defaultValue: null
	  },
	  pickedup_date: {
	    type: Sequelize.DATE,
	    defaultValue: null
	  },
	  createdAt:{
	  	type: Sequelize.DATE,
			defaultValue: null
	  },
	  updatedAt:{
	  	type: Sequelize.DATE,
			defaultValue: null
	  }
	}, {
	  freezeTableName: true, // Model tableName will be the same as the model name
		classMethods:{
			associate: function(models){
				resourcerequest.belongsTo(models.resourcetype, {foreignKey: 'resource_type_id', targetKey: 'id'});
				resourcerequest.belongsTo(models.user, {as: 'requestby', foreignKey: 'requested_by_id', targetKey: 'id'});
				resourcerequest.belongsTo(models.user, {as: 'pickupfrom', foreignKey: 'pickedup_from_id', targetKey: 'id'});
			},
			getReserved: function(models, next) {
        		models.resourcetype.findAll({
					attributes: ['id', [models.sequelize.fn('SUM', models.sequelize.col('quantity_requested')), 'quantity_reserved']],
					include: [{model: models.resourcerequest, required: false, attributes: [], where: {pickedup_ind: "N"}}],
					group: ['resourcetype.id'],
					order: 'resourcetype.id ASC'
				}).then(function (resources) {
					  next(resources);
				}).catch(function (err){
					console.log(err)
					next();
				})
   			},
   			getMyRequests: function(models, id, next){

		   		models.resourcerequest.findAll({
					attributes: ['id','quantity_requested','requested_by_id','pickedup_ind','requested_date','pickedup_date'],
					where: {
						requested_by_id: id
					},
					include: [{model: models.resourcetype, attributes: ['id','type_description','units'],
							 include: [{model: models.resourcecategory, required: false, attributes: ['id','cat_description']}]
					}],
					order: [['pickedup_ind','ASC'],['requested_date','DESC']]
				}).then(function (requests) {
					next(requests)
				}).catch(function (err){
					console.log(err)
					next();
				})
   			},
   			getPendingRequests: function(models, next){

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
				  next(requests)
				}).catch(function (err){
					console.log(err)
					next(err);
				})
		   	},
		   	addRequest: function (models, id, requested, requser, next){

		   		var nextpage;

		   		models.inventory.findOne({
		  			where: {
		   				 resource_type_id: id
					}
				}).then(function (result) {
			
					if (!result){
			
						nextpage =  "Resource is not available anymore";
						next(nextpage);
					}
					else{

						if (requested > result.quantity_inventory){
				
							nextpage =  "Insufficient Resource Quantity";
							next(nextpage);
						}
						else {
							var available = (result.quantity_inventory - requested);
				
							result.update({
								quantity_inventory: available
							}).then(function(){
								models.resourcerequest.create({ 
									resource_type_id: id, 
									quantity_requested: requested,
									requested_by_id: requser,
									requested_date: new Date().toLocaleString(),
									pickedup_ind: 'N'
								}).then(function() {
									next()
								}).catch(function (err){
									next(err);
								})
							}).catch(function (err){
								next(err);
							})
						}
					}
						
				}).catch(function (err){
					next(err);
				})
			},
			updateAllRequests: function(models, req, next){

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
							next();
						})
					}).catch(function(err){
						console.log('error occured while updating picked in');
						next(err);
					})

				}
			}
		   	
		}

	});
	return resourcerequest;
};