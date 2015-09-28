var express = require('express');
var router = express.Router();
var db = require('.././testdb');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("here......");
  db.each("SELECT * FROM role", function(err, row) {
    //log all data
    console.log("Role :" + row.title);
  });
	res.render('signup', { title: 'Express' });
	
});

router.get('/signin', function(req, res, next) {
	  res.render('signin', { title: 'Express' });
});

module.exports = router;
