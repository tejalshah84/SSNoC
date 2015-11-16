var fs = require("fs");
var file = "./db/ssnoc.db";
var exists = fs.existsSync(file);

//connect sqlite3
var sqlite3 = require("sqlite3").verbose();
//create sqlite database, which is test.db
var db = new sqlite3.Database(file);

var bcrypt = require('bcryptjs');

// Generate a salt
var salt = bcrypt.genSaltSync(10);





db.serialize(function() {
  //db.run, if table user is not exist，then create user database
  console.log("Initialize database...");
	//User
	db.run("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT,password TEXT,firstname TEXT,lastname TEXT, online BOOLEAN, location TEXT, statusid INT, roleid INT,lastlogintime DATETIME, createAt DATETIME,updateAt DATETIME)");

  db.run("CREATE Table if NOT EXISTS chathistory (chatid INTEGER PRIMARY KEY AUTOINCREMENT, chatauthor TEXT, chatmessage BLOB, timestamp DATETIME)", function (err){

          if(err!==null){
              console.log("Error occured while creating chat_history table");
          }
          else{
              console.log("chat_history table initialized");
          }
      });

db.run("CREATE Table if NOT EXISTS resourcecategory (id INTEGER PRIMARY KEY AUTOINCREMENT, cat_description TEXT UNIQUE, createdAt DATETIME, updatedAt DATETIME)", function (err){

          if(err!==null){
              console.log("Error occured while creating resource category table");
          }
          else{
              console.log("resourcecategory table initialized");
          }
      });

/*stmt = db.prepare("INSERT INTO resourcecategory (cat_description, createdAt, updatedAt) VALUES (?,?,?)");
  
  stmt.run("Medical Supplies", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run("Food Supplies", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run("Other Supplies", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.finalize();*/

db.run("CREATE Table if NOT EXISTS resourcetype (id INTEGER PRIMARY KEY AUTOINCREMENT, resource_cat_id INTEGER, type_description TEXT UNIQUE, units TEXT, createdAt DATETIME, updatedAt DATETIME)", function (err){

          if(err!==null){
              console.log("Error occured while creating resource type table");
          }
          else{
              console.log("resourcetype table initialized");
          }
      });

/*stmt = db.prepare("INSERT INTO resourcetype (resource_cat_id, type_description, units, createdAt, updatedAt) VALUES (?,?,?,?,?)");

  stmt.run(1, "Paracetamol", "Blister", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run(1, "Band-aids", "Box", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run(1, "Anti-biotics", "Blister", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run(1, "Cough-syrup", "Bottle", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run(2, "Bread", "Loaf", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run(2, "Baked Beans", "Can", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run(2, "Water", "Crate", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run(3, "Blankets", "Sheet", new Date().toLocaleString(), new Date().toLocaleString());
  stmt.finalize();*/

db.run("CREATE Table if NOT EXISTS inventory (resource_type_id INTEGER PRIMARY KEY NOT NULL, quantity_inventory INTEGER, createdAt DATETIME, updatedAt DATETIME)", function (err){

          if(err!==null){
              console.log("Error occured while creating inventory table");
          }
          else{
              console.log("inventory table initialized");
          }
      });

/*stmt = db.prepare("INSERT INTO inventory (resource_type_id, quantity_inventory, createdAt, updatedAt) VALUES (?,?,?,?)");

  stmt.run(1, 2, new Date().toLocaleString(), new Date().toLocaleString());
  stmt.run(2, 2, new Date().toLocaleString(), new Date().toLocaleString());
  stmt.finalize(); */


db.run("CREATE Table if NOT EXISTS resourcerequest (id INTEGER PRIMARY KEY AUTOINCREMENT, resource_type_id INTEGER NOT NULL, quantity_requested INTEGER, requested_by_id INTEGER, requested_date DATETIME, pickedup_ind VARCHAR(1), pickedup_from_id INTEGER, pickedup_date DATETIME, createdAt DATETIME, updatedAt DATETIME)", function (err){

          if(err!==null){
              console.log("Error occured while creating resourcerequest table");
          }
          else{
              console.log("resourcerequest table initialized");
          }
      });

/*stmt = db.prepare("INSERT INTO resourcerequest (resource_type_id, quantity_requested, pickedup_ind) VALUES (?,?,?)");

  stmt.run(2, 1, "N");
  stmt.run(2, 1, "N");
  stmt.finalize();*/

 /* var stmt = db.prepare("INSERT INTO user (username,password,firstname,lastname,online,status,role,lastLoginTime) VALUES (?,?,?,?,?,?,?,?)");
  
	
	stmt.run("TejalShah84", bcrypt.hashSync("123", salt), "Tejal", "Shah", true, 1, 1, new Date().toLocaleString());
	stmt.run("EileenWei01", bcrypt.hashSync("123", salt),"Eileen", "Wei", false, 2, 2, new Date().toLocaleString());
	stmt.run("DeniseT2015", bcrypt.hashSync("123", salt), "Denise", "Teng", true, 3, 3, new Date().toLocaleString());
	stmt.run("Amrata", bcrypt.hashSync("123", salt), "Amrata", "Amrata", false, 1, 1, new Date().toLocaleString());
	stmt.finalize();
*/
	
/* //add 10 random data
  for (var i = 0; i<2; i++) {

      stmt.run("testname", "testpw", "testFname", "testLname", i, i, logintime);

  }*/

  

 /* db.each("SELECT username, password, firstname, lastname, online, location, statusid, roleid, lastlogintime FROM user", function(err, row) {
    //log all data
    console.log("User id :" + row.status);
  });*/
	
	//Status
 /* db.run("CREATE TABLE IF NOT EXISTS status (title TEXT,description TEXT)");
  stmt = db.prepare("INSERT INTO status (title, description) VALUES (?,?)");
  
  //add 3 random data
  stmt.run("Danger", "Dangerous");
	stmt.run("Medium", "Medium");
	stmt.run("Safe", "Safe");
  stmt.finalize();*/

 /* db.each("SELECT * FROM status", function(err, row) {
    //log all data
    console.log("Status :" + row.title);
  });*/
	
	//Role
 /*  db.run("CREATE TABLE IF NOT EXISTS role (title TEXT,description TEXT)");
//  stmt = db.prepare("INSERT INTO role (title, description) VALUES (?,?)");
  
 //add 3 random data
  stmt.run("Admin", "This is admin");
	stmt.run("Coordinator", "Coordinator");
	stmt.run("User", "Regular user");
  stmt.finalize();*/

 /* db.each("SELECT * FROM role", function(err, row) {
    //log all data
    console.log("Role :" + row.title);
  });*/
});



//db.close();
module.exports = db;