var Sequelize = require('sequelize');


module.exports = function(sequelize){
	var roomchathistory = sequelize.define('roomchathistory', {
	  id:{
	    type: Sequelize.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	  },
	  chatauthor_id: {
	    type: Sequelize.INTEGER,
	  },
	  chatmessage: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
 	  roomname:{
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
				roomchathistory.belongsTo(models.user, {foreignKey: 'chatauthor_id', targetKey: 'id'});
			}
		}
	});

	

	return roomchathistory;
};