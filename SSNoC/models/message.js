console.log("Sequelize...Creating Chathistory Instance...");

var Sequelize = require('sequelize');
var sequelize = require('.././sequelize');

var chathistory = sequelize.define('chathistory', {
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




module.exports = chathistory;



