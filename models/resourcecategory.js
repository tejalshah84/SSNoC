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
			},
			listAll: function(models, next){
				models.resourcecategory.findAll({
					attributes: ['id', 'cat_description'],
					include: [{model: models.resourcetype, attributes: ['id','type_description','units']}],
					order: 'resourcecategory.id ASC'
				}).then(function(resources){
					next(resources);
				}).catch(function (err){
					console.log(err)
					next();
				})
			},
			getCategories: function(models, next){
				models.resourcecategory.findAll({
				attributes: ['id', 'cat_description'],
				order: 'resourcecategory.id ASC'
				}).then(function (resources) {
					next(resources);
				}).catch(function (err){
					console.log(err)
					next();
				})
			},
			getByCategoryID: function(models, id, next){

				models.resourcetype.findAll({
					attributes: ['id', 'type_description','units'],
					 where: {
					    resource_cat_id: id
					},
					order:'type_description ASC'
				}).then(function (resources) {
					next(resources);
				}).catch(function (err){
					console.log(err)
					next();
				})
			}
		}

	});
	return resourcecategory;
};