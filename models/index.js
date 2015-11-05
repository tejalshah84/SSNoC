var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  sequelize = require('.././sequelize').sequelize,
  db = {};

//var config =  require('../db/config')(process.env.NODE_ENV);

// CONNECT TO THE DATABASE
/*sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  // SQLite only
  storage: ".././db/ssnoc.db"
});*/


// IMPORT MODELS
fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
		console.log("file: "+file);
    var model = sequelize.import(path.join(__dirname, file));
		if(file == 'test_message.js'){
			db[model.chathistory.name] = model;
		}else{
			db[model.name] = model;
		}
    
  });
	console.log(db);
	console.log("*****************");
	

	// RUN MODEL ASSOCIATIONS (hasMany, belongsTo, etc.)
	Object.keys(db).forEach(function(modelName) {
	  if ("associate" in db[modelName]) {
	    db[modelName].associate(db);
	  }
	});
	
	db.sequelize = sequelize;
	db.Sequelize = Sequelize;


module.exports = db;