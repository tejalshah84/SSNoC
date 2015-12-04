var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var models = require('.././models');


module.exports = function(io){

  router.get('/', function(req, res) {   
  });



  return router;
};