var Sequelize = require('sequelize');


module.exports = function(sequelize){
	var chathistory = sequelize.define('chathistory', {
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
				chathistory.belongsTo(models.user, {as: 'chatauthor', foreignKey: 'chatauthor_id', targetKey: 'id'});
			},
			searchMessages: function(models, searchtxt, pageCount, next){
				
				chathistory.findAndCountAll({
				  attributes: ['id','chatauthor_id', 'chatmessage', 'timestamp', 'createdAt'],
				  where: {
				    chatmessage: {
				    	$like: searchtxt
				    }
				  },
				  include: [{model: models.user, attributes: ['username','location','statusid']}],
				  order:'timestamp DESC',
				  offset: pageCount,
				  limit: 10
				}).then(function (messages) {
					  next(messages);
				}).catch(function(e){
					next(null)
				});
			}
		}
	});

	

	return chathistory;
};