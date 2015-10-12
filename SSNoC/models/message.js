console.log("Sequelize...Creating Chathistory Instance...");

var Sequelize = require('sequelize');
var sequelize = require('.././sequelize');

var chathistory = sequelize.define('chathistory', {
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
    type: Sequelize.DATE
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});




module.exports = chathistory;



