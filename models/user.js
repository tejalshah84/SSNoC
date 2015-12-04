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
	    unique: true,
			field: 'username'
	  },
	  password: {
	    type: Sequelize.STRING,
	    allowNull: false,
	    defaultValue: null,
			field: 'password'
	  },
	  firstname: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null,
			field: 'firstname'
	  },
	  lastname: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null,
			field: 'lastname'
	  },
	  location: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null,
			field: 'location'
	  },
	  statusid: {
	    type: Sequelize.INTEGER,
			allowNull: true,
			field: 'statusid'
	  },
	  roleid: {
	    type: Sequelize.INTEGER,
	    allowNull: true,
	    defaultValue: null,
			field: 'roleid'
	  },
	  lastlogintime: {
	    type: Sequelize.DATE,
			defaultValue: null,
			field: 'lastlogintime'
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
		  defaultValue: 1,
			field: 'accountStatus'
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

			},
			createUser: function(models, data, next){				
				models.user.create({ 
					username: data.username, 
					password: data.password,
					firstname: "",
					lastname: "",
					statusid: 4,
					roleid: 4,
					lastlogintime: new Date()
				}).then(function(user) {
			    next(user);
			  });
			},
			
			
			//////////////////// adminUpdate for Admin Use Case ////////////////////////
			adminUpdate: function(models, data, next){				
				models.user.update(
				{ 
					username: data.username, 
					password: data.password,
					roleid: data.roleid,
					accountStatus: data.accountStatus
				},
	     		  	{
	     		    	   	where: { username: data.username }
	     		  	})
				.then(function(user) { console.log("mmodel:"+user.accountStatus);
			    next(user);
			  });
			},
			////////////////////////////////////////////
			
			
			//loginTimeUpdate//
			loginTimeUpdate: function(models, data, next){				
				models.user.update(
				{ 
					lastlogintime: new Date()
				},
	     		  	{
	     		    	   	where: { username: data.username }
	     		  	})
				.then(function(user) {
			    next(user);
			  });
			},
			//destroy user record
			destroyUser: function(models, id, next){
				models.user.findOne({ where: { id: id}}).then(function(user){
					return user.destroy();
				}).then(function(e){
					next();
				});

			},
			updateUserStatus: function(models, data, next){		 //udpate user status
			
				models.user.update({statusid: data.statusid}, {where: {id: data.userid}}).then(function(user) {
					next(user);
				});

			},
			searchUsername: function(models, searchText, next){

				models.user.findAll({
			  		attributes: ['id','username', 'firstname', 'lastname', 'statusid', 'roleid', 'location', 'lastlogintime'],
			  		where: {
			   			username: {
			    				$like: '%'+ searchText +'%'
			    		}
			  		},
			   		order:'username ASC'
				}).then(function(users){
					next(users)
				}).catch(function(e){
					next(null)
				})
			},
			searchByStatus: function (models, searchText, next){
				models.user.findAll({
		  			attributes: ['id','username', 'firstname', 'lastname', 'statusid', 'roleid', 'location','lastlogintime'],
				  	where: {
				    	statusid: searchText
				  	}
				}).then(function (users) {
					next(users)
				}).catch(function(e){
					next(null)
				})
			}
		}
	});
	return user;
};