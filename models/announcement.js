console.log("Sequelize...Creating Announcement Instance...");

var Sequelize = require('sequelize');
var sequelize = require('.././sequelize').sequelize;
var user = require('.././models/user.js');

var announce = sequelize.define('announcement', {
  id:{
    type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
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


user.hasMany(announce, {foreignKey: 'publisher_username'});
announce.belongsTo(user, {foreignKey: 'publisher_username', targetKey: 'username'});


module.exports = announce;