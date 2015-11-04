console.log("Sequelize...Creating Test Chathistory Instance...");

var Sequelize = require('sequelize');
var sequelize = require('.././sequelize').sequelize;


var chathistory = sequelize.define('chathistory_test', {
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



exports.chathistory = chathistory;

exports.dropdb = function(db, callback){
	db.sync({force: true}).then(function () {
		console.log("Test db has been refreshed...");
		callback();
	});
};





