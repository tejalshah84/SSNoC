console.log("Sequelize...Creating Announcement Instance...");

var Sequelize = require('sequelize');
var sequelize = require('.././sequelize');

var announce = sequelize.define('announcement', {
  publisher_username: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: null
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
  freezeTableName: true // Model tableName will be the same as the model name
});




module.exports = announce;



