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
				resourcerequest.belongsTo(models.user, {foreignKey: 'requested_by_id', targetKey: 'id'});
				resourcerequest.belongsTo(models.user, {foreignKey: 'requested_by_id', targetKey: 'id'});
			}
		},
		instanceMethods: {
    		getReservedNumbers: function () {
        		return resourcerequest.findAll({
            		where: {
                		pickedup_ind: 'N'
          		 	 },
           			attributes: [[sequelize.fn('SUM', sequelize.col('quantity_requested')), 'reserved'], 'resource_type_id'],
            		group: ['resource_type_id']
       			});
   			 }
		}

	});
	return resourcerequest;
};