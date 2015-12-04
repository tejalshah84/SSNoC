console.log("Initializing sequelize...");

var db = {};
var Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
	logging: false,
  // SQLite only
  storage: "./db/ssnoc.db"
});



db.Sequelize = Sequelize;
db.sequelize = sequelize;


module.exports = db;