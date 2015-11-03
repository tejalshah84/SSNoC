console.log("Initializing sequelize...");


var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  // SQLite only
  storage: "./db/ssnoc.db"
});

module.exports = sequelize;