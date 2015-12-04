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
			searchPrivateMessages: function(models, searchtxt, pageCount, currUser, next){

				models.privatechathistory.findAndCountAll({
				  attributes: ['id','chatauthor_id', 'chattarget_id','chatmessage', 'timestamp', 'createdAt'],
				  where: {
				    chatmessage: {
				    	$like: searchtxt
				    },
				    $or: [{chatauthor_id: currUser}, 
				    	{chattarget_id: currUser}]
				  },
				  include: [{model: models.user, as: 'usertarget_id', attributes: ['username','location', 'statusid']},
				 		   {model: models.user, as: 'userauthor_id', attributes: ['username','location', 'statusid']}],
				  order:'timestamp DESC',
				  offset: pageCount,
				  limit: 10
				}).then(function (privmessages) {
				   next(privmessages);
				}).catch(function(e){
					next(null)
				});
			}
		}
	});

	
	
	return privatechathistory;
};