var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var person = sequelize.define('missingperson', {
	  id:{
	    type: Sequelize.INTEGER,
	      autoIncrement: true
	  },
	  reporter_userid:{
	    type: Sequelize.INTEGER,
	    allowNull: false 
	  },
	  missing_userid:{
	    type: Sequelize.INTEGER,
	    allowNull: true,
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
	  age: {
	    type: Sequelize.INTEGER,
			allowNull: true
	  },
	  height: {
	    type: Sequelize.INTEGER,
			allowNull: true
	  },
	  weight: {
	    type: Sequelize.INTEGER,
			allowNull: true
	  },
	  location: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
	  lastseen: {
	    type: Sequelize.DATE,
			defaultValue: null
	  },
	  description: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
	  note: {
	    type: Sequelize.TEXT,
	    primaryKey: true,
	    allowNull: true,
	    defaultValue: null,
	    unique: true
	  },
	  missing: {
	    type: Sequelize.INTEGER,
	    allowNull: false,
	    defaultValue: 1
	  }, 
	  picture: {
	    type: Sequelize.BLOB,
			allowNull: true
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
				person.belongsTo(models.user, {foreignKey: 'reporter_userid', targetKey: 'id'});
				person.belongsTo(models.user, {foreignKey: 'missing_userid', targetKey: 'id'});
			}
		}
	});
	return person;
};