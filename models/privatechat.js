console.log("Sequelize...Creating PrivateChathistory Instance...");

var Sequelize = require('sequelize');
var sequelize = require('.././sequelize').sequelize;
var user = require('.././models/user.js');


var privatechathistory = sequelize.define('privatechathistory', {
  id:{
    type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  chatauthor: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: null
  },
  chattarget: {
	    type: Sequelize.TEXT,
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
  freezeTableName: true // Model tableName will be the same as the model name
});

user.hasMany(privatechathistory, {foreignKey: 'chattarget'});
user.hasMany(privatechathistory, {foreignKey: 'chatauthor'});
privatechathistory.belongsTo(user, {as: 'usertarget', foreignKey: 'chattarget', targetKey: 'username'});
privatechathistory.belongsTo(user, {as: 'userauthor', foreignKey: 'chatauthor', targetKey: 'username'});

module.exports = privatechathistory;