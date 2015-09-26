var fs = require("fs");
var file = "test.db";
var exists = fs.existsSync(file);

//connect sqlite3
var sqlite3 = require("sqlite3").verbose();
//create sqlite database, which is test.db
var db = new sqlite3.Database(file);

db.serialize(function() {
  //db.run, if table user is not exist，then create users database
  db.run("CREATE TABLE IF NOT EXISTS  Users (thing TEXT)");
  var stmt = db.prepare("INSERT INTO Users VALUES (?)");
  
  //add 10 random data
  for (var i = 0; i<10; i++) {
    stmt.run("staff_number" + i);
  }

  stmt.finalize();

  db.each("SELECT rowid AS id, thing FROM Users", function(err, row) {
    //log all data
    console.log(row.id + ": " + row.thing);
  });
});

db.close();