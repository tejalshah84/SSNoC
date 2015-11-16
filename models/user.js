var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var user = sequelize.define('user', {
	  id:{
	    type: Sequelize.INTEGER,
	      autoIncrement: true,
	      primaryKey: true
	  },
	  username: {
	    type: Sequelize.STRING,
	    allowNull: false,
	    unique: true
	  },
	  password: {
	    type: Sequelize.STRING,
	    allowNull: false,
	    defaultValue: null
	  },
	  firstname: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
	  lastname: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
	  location: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
	  statusid: {
	    type: Sequelize.INTEGER,
			allowNull: true
	  },
	  roleid: {
	    type: Sequelize.INTEGER,
	    allowNull: true,
	    defaultValue: null
	  },
	  lastlogintime: {
	    type: Sequelize.DATE,
			defaultValue: null
	  },
	  createdAt: {
	    type: Sequelize.DATE,
			defaultValue: null
	  },
	  updatedAt: {
	    type: Sequelize.DATE,
			defaultValue: null
	  }
	}, {
	  freezeTableName: true, // Model tableName will be the same as the model name
		classMethods:{
			associate: function(models){
				user.hasMany(models.announcement, {foreignKey: 'publisher_userid'});
				user.hasMany(models.chathistory, {foreignKey: 'chatauthor_id'});
				user.hasMany(models.privatechathistory, {foreignKey: 'chattarget_id'});
				user.hasMany(models.privatechathistory, {foreignKey: 'chatauthor_id'});
				user.hasMany(models.resourcerequest, {foreignKey: 'requested_by_id'});
				user.hasMany(models.resourcerequest, {foreignKey: 'pickedup_from_id'});
			}
		}
	});
	return user;
};