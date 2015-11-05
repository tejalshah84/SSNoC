console.log("Sequelize...Creating User Instance...");

var Sequelize = require('sequelize');
//var sequelize = require('.././sequelize').sequelize;

module.exports = function(sequelize){
	var user = sequelize.define('user', {
	  id:{
	    type: Sequelize.INTEGER,
	      autoIncrement: true
	  },
	  username: {
	    type: Sequelize.STRING,
	    primaryKey: true,
	    allowNull: false,
	    defaultValue: null,
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
				user.hasMany(models.announcement, {foreignKey: 'publisher_username'});
				user.hasMany(models.chathistory, {foreignKey: 'chatauthor'});
				user.hasMany(models.privatechathistory, {foreignKey: 'chattarget'});
				user.hasMany(models.privatechathistory, {foreignKey: 'chatauthor'});
			}
		}
	});
	return user;
};