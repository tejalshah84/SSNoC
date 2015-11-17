var express = require('express');
var router = express.Router();

var badUsername = require('.././lib/reservedNames.js');
var onlineUsers = require('.././lib/onlineUsers.js');

//model
var models = require('.././models');


// -------------------------------------------------------------------------------------//


module.exports = function(app){

	
	var adminController = require('./adminController');
	var announcementsController = require('./announcementsController');
	var joinCommunityController = require('./joinCommunityController');
	var messagesController = require('./messagesController');
	var privatechatsController = require('./privatechatsController');
	var searchController = require('./searchController');
	var test_messagesController = require('./test_messagesController');
	var usersController = require('./usersController');
	var groupchatController = require('./groupchatController');
	
	
 // var registeredDevicesController = require('./registeredDevicesController')(app.io);

  router.use('/', joinCommunityController);
  router.use('/admin', adminController);
  router.use('/announcements', announcementsController);
  router.use('/messages', messagesController);
  router.use('/privatechats', privatechatsController);
	router.use('/search', searchController);
	router.use('/test_messages', test_messagesController);	
	router.use('/users', usersController);
	router.use('/groupchat', groupchatController);
	
	
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