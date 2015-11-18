var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var announce = sequelize.define('announcement', {
	  id:{
	    type: Sequelize.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	  },
	  publisher_userid: {
	    type: Sequelize.INTEGER,
	    allowNull: true,
	    defaultValue: null
	  },
	  content: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
	  createdAt: {
	    type: Sequelize.DATE
	  },
	  updatedAt: {
	    type: Sequelize.DATE
	  }
	}, {
	  freezeTableName: true, // Model tableName will be the same as the model name
		classMethods:{
			associate: function(models){
				announce.belongsTo(models.user, {foreignKey: 'publisher_userid', targetKey: 'id'});
			}
		}
	});


	
	return announce;
};