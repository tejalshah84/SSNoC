'use strict';
/* jshint shadow:true */
/* jshint sub: true */
var express = require('express');
var router = express.Router();

var badUsername = require('.././lib/reservedNames.js');
var onlineUsers = require('.././lib/onlineUsers.js');

//model
var models = require('.././models');


// -------------------------------------------------------------------------------------//


module.exports = function(app){

	
	var adminController = require('./adminController');
	var joinCommunityController = require('./joinCommunityController');
	var messagesController = require('./messagesController');
	var privatechatsController = require('./privatechatsController');
	var searchController = require('./searchController');
	var test_messagesController = require('./test_messagesController');
	var missingPeopleController = require('./missingPeopleController');
	var apiController = require('./apiController');
	var profileController = require('./profileController');
	var performanceController = require('./performanceController');
	var statusController = require('./statusController');
	
	

  
	router.use('/', joinCommunityController);
  router.use('/api', apiController);
	router.use('/admin', adminController);
  router.use('/messages', messagesController);
 	router.use('/privatechats', privatechatsController);
	router.use('/search', searchController);
	router.use('/test_messages', test_messagesController);	
	router.use('/missing', missingPeopleController);
	router.use('/profile', profileController);
	router.use('/performance', performanceController);
	router.use('/status', statusController);
	
	
	
	// ROUTING
 	app.use(router);

  	router.get('/', function(req, res) {
    	res.status(200).send('Hello, this is SSNoC API!');
  	});

  	router.get('*', function(req, res) {
    	res.status(404).end();
  	});

  return router;
};