var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var announcement = sequelize.define('announcement', {
	  id:{
	    type: Sequelize.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	  },
		publisher_userid: {
	    type: Sequelize.INTEGER
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
				announcement.belongsTo(models.user, {foreignKey: 'publisher_userid', targetKey: 'id'});		
			},
			destroyAnnouncement: function(models, id, next){
				models.announcement.findOne({ where: { id: id}}).then(function(result){
					return result.destroy();
				}).then(function(e){
					next();
				});
			},
		}
	});


	
	return announcement;
};