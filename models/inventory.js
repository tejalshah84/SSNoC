var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var inventory = sequelize.define('inventory', {
	  resource_type_id:{
	    type: Sequelize.INTEGER,
	      primaryKey: true,
	      allowNull:false
	  },
	  quantity_inventory: {
	    type: Sequelize.INTEGER,
	    allowNull: false,
	    defaultValue: 0
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
				inventory.belongsTo(models.resourcetype, {foreignKey: 'resource_type_id', targetKey: 'id'});
			},
			getCategoryInventory: function(models, next){
				models.resourcecategory.findAll({
					attributes: ['id', 'cat_description'],
					include: [{model: models.resourcetype, attributes: ['id','type_description','units'],
							 include: [{model: models.inventory, required: false, attributes: ['quantity_inventory']}]
					}],
					order: 'resourcecategory.id ASC'
				}).then(function (inventory) {
		  			next(inventory);
				}).catch(function (err){
					console.log(err)
					next();
				})
			},
			getTypeInventory: function(models, next){
				models.resourcetype.findAll({
					attributes: ['id'],
					include: [{model: models.inventory, required: false, attributes: ['quantity_inventory']}],
					order: 'resourcetype.id ASC'
				}).then(function (inventory) {
		  			next(inventory);
				}).catch(function (err){
					console.log(err)
					next();
				})

			},
			addDonation: function(models, type, donate, next){
				var nextpage = false;

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
							nextpage = true;
							next(nextpage);
						})
					}
					else{
						var available = result.quantity_inventory + donate;
						result.update({
							quantity_inventory: available
						}).then(function(){
							nextpage = true;
							next(nextpage);
						})
					}
				}).catch(function(err){
					console.log(err);
						next(nextpage);
				})
			}
		}

	});
	return inventory;
};