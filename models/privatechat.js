var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var privatechathistory = sequelize.define('privatechathistory', {
	  id:{
	    type: Sequelize.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	  },
	  chatauthor_id: {
	    type: Sequelize.INTEGER,
	    allowNull: true,
	    defaultValue: null
	  },
	  chattarget_id: {
		    type: Sequelize.INTEGER,
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
				privatechathistory.belongsTo(models.user, {as: 'usertarget_id', foreignKey: 'chattarget_id', targetKey: 'id'});
				privatechathistory.belongsTo(models.user, {as: 'userauthor_id', foreignKey: 'chatauthor_id', targetKey: 'id'});
				
			},
			createPrivMessage: function(models, data, next){				
				models.privatechathistory.create({ 
					chatauthor_id: data.chatauthor_id,
			      	chattarget_id: data.chattarget_id,
			      	chatmessage: data.chatmessage, 
			        timestamp: new Date()
				}).then(function(privatechathistory) {
			    next(privatechathistory);
			  });
			}
		}
	});

	
	
	return privatechathistory;
};