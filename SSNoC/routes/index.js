var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signin', { title: 'Express' });
});
router.get('/signup', function(req, res, next) {
	  res.render('signup', { title: 'Express' });
	});
router.get('/signin', function(req, res, next) {
	  res.render('signin', { title: 'Express' });
	});

module.exports = router;
