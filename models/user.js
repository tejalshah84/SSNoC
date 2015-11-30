var Sequelize = require('sequelize');

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
	  },
	  
	  accountStatus: {
	    type: Sequelize.INTEGER,
		  	defaultValue: 1
	  }
	  
	}, {
	  freezeTableName: true, // Model tableName will be the same as the model name
		classMethods:{
			associate: function(models){
				user.hasMany(models.announcement, {foreignKey: 'publisher_userid'});
				user.hasMany(models.chathistory, {foreignKey: 'chatauthor_id'});
				user.hasMany(models.privatechathistory, {foreignKey: 'chattarget_id'});
				user.hasMany(models.missingperson, {foreignKey: 'reporter_userid'});
				user.hasMany(models.missingperson, {foreignKey: 'missing_userid'});
			},
			all: function(models, next){
				models.user.findAll().then(function (users) {
					next(users);
				});
			},
			findById: function(models, id, next){
				models.user.findOne({ where: { id: id}}).then(function(user){
					next(user);
				}).catch(function(e){
					console.log(e);
					next(null);
				});
			},
			findByUsername: function(models, username, next){
				models.user.findOne({ where: { username: username}}).then(function(user){
					next(user);
				}).catch(function(e){
					console.log(e);
					next(null);
				});

			}
		}
	});
	return user;
};