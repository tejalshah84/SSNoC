var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var resourcetype = sequelize.define('resourcetype', {
	  id:{
	    type: Sequelize.INTEGER,
	      autoIncrement: true,
	      primaryKey: true,
	      allowNull:false
	  },
	  resource_cat_id:{
	    type: Sequelize.INTEGER,
	      allowNull:false
	  },
	  type_description: {
	    type: Sequelize.STRING,
	    allowNull: false,
	    unique: true
	  },
	  units: {
	    type: Sequelize.STRING,
	    allowNull: false,
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
				resourcetype.belongsTo(models.resourcecategory, {foreignKey: 'resource_cat_id', targetKey: 'id'});
				resourcetype.hasOne(models.inventory, {foreignKey: 'resource_type_id'});
				resourcetype.hasMany(models.resourcerequest, {foreignKey: 'resource_type_id'});
			}
		}
	});
	return resourcetype;
};