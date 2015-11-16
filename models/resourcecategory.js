var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var resourcecategory = sequelize.define('resourcecategory', {
	  id:{
	    type: Sequelize.INTEGER,
	      autoIncrement: true,
	      primaryKey: true,
	      allowNull:false
	  },
	  cat_description: {
	    type: Sequelize.STRING,
	    allowNull: false,
	    unique: true
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
				resourcecategory.hasMany(models.resourcetype, {foreignKey: 'resource_cat_id'});
			}
		},
		instanceMethods: {
    		
		}
	});
	return resourcecategory;
};