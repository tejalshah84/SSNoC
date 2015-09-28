var fs = require("fs");
var file = "./db/ssnoc.db";
var exists = fs.existsSync(file);

//connect sqlite3
var sqlite3 = require("sqlite3").verbose();
//create sqlite database, which is test.db
var db = new sqlite3.Database(file);


db.serialize(function() {
  //db.run, if table user is not exist，then create user database
  console.log("Initialize database...");
	//User
	db.run("CREATE TABLE IF NOT EXISTS user (username TEXT,password TEXT,firstname TEXT,lastname TEXT,status INT,role INT,lastLoginTime TEXT)");


  var stmt = db.prepare("INSERT INTO user (username,password,firstname,lastname,status,role,lastLoginTime) VALUES (?,?,?,?,?,?,?)");
  
  //add 10 random data
  
  var date = new Date();
  var logintime = date.toLocaleTimeString();

  for (var i = 0; i<10; i++) {

      stmt.run("testname", "testpw", "testFname", "testLname", i, i, logintime);

  }

  stmt.finalize();

  db.each("SELECT username, password,firstname,lastname,status,role,lastLoginTime FROM user", function(err, row) {
    //log all data
    console.log("User id :" + row.status);
  });
	
	//Status
  db.run("CREATE TABLE IF NOT EXISTS status (title TEXT,description TEXT)");
  stmt = db.prepare("INSERT INTO status (title, description) VALUES (?,?)");
  
  //add 3 random data
  stmt.run("Danger", "Dangerous");
	stmt.run("Medium", "Medium");
	stmt.run("Safe", "Safe");
  stmt.finalize();

  db.each("SELECT * FROM status", function(err, row) {
    //log all data
    console.log("Status :" + row.title);
  });
	
	//Role
  db.run("CREATE TABLE IF NOT EXISTS role (title TEXT,description TEXT)");
  stmt = db.prepare("INSERT INTO role (title, description) VALUES (?,?)");
  
  //add 3 random data
  stmt.run("Admin", "This is admin");
	stmt.run("Coordinator", "Coordinator");
	stmt.run("User", "Regular user");
  stmt.finalize();

  db.each("SELECT * FROM role", function(err, row) {
    //log all data
    console.log("Role :" + row.title);
  });
});



//db.close();
module.exports = db;