console.log("Sequelize...Creating User Instance...");

var Sequelize = require('sequelize');
var sequelize = require('.././sequelize').sequelize;

var user = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: null
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
  freezeTableName: true // Model tableName will be the same as the model name
});




module.exports = user;



