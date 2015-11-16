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
			}
		}
	});
	return inventory;
};