var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var privatechathistory = sequelize.define('privatechathistory', {
	  id:{
	    type: Sequelize.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	  },
	  chatauthor: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
	  chattarget: {
		    type: Sequelize.TEXT,
		    allowNull: true,
		    defaultValue: null
		  },
	  chatmessage: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
 
	  timestamp: {
	    type: Sequelize.DATE,
	    allowNull: true,
	    defaultValue: null
	  },
	  createdAt: {
	    type: Sequelize.DATE,
	    allowNull: true,
	    defaultValue: null
	  },
	  updatedAt: {
	    type: Sequelize.DATE,
	    allowNull: true,
	    defaultValue: null
	  }
	}, {
	  freezeTableName: true, // Model tableName will be the same as the model name
		classMethods:{
			associate: function(models){
				privatechathistory.belongsTo(models.user, {as: 'usertarget', foreignKey: 'chattarget', targetKey: 'username'});
				privatechathistory.belongsTo(models.user, {as: 'userauthor', foreignKey: 'chatauthor', targetKey: 'username'});
				
			}
		}
	});

	
	
	return privatechathistory;
};