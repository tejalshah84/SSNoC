var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

//connect sqlite3
var sqlite3 = require("sqlite3").verbose();
//create sqlite database, which is test.db
var db = new sqlite3.Database(file);

db.serialize(function() {
  //db.run, if table user is not exist，then create user database
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
});

db.close();