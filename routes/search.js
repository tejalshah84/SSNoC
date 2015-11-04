var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models
var Message = require('.././models/message.js');
var privateMessage = require('.././models/privatechat.js');
var Announce = require('.././models/announcement.js');
var User = require('.././models/user.js');
var util = require('.././util/util.js');



router.get('/', function(req, res) {

	var searchCriteria = req.query.searchCriteria;
	var searchText = req.query.searchText;
	var pageCount = req.query.pageCount;

	if(searchCriteria === "Citizen"){

		User.findAll({
		  attributes: ['username', 'firstname', 'lastname', 'statusid', 'roleid', 'location', 'lastlogintime'],
		  where: {
		    username: {
		    	$like: '%'+ searchText +'%'
		    }
		   },
		   order:'username ASC'
		  
			}).then(function (users) {

			  var result = util.divideUsers(users);
			  res.json(result);
		});
	}
	else if(searchCriteria === "Citizen Status"){

		User.findAll({
		  attributes: ['username', 'firstname', 'lastname', 'statusid', 'roleid', 'location','lastlogintime'],
		  where: {
		    statusid: searchText
		  }
		  }).then(function (users) {
		  	  var result = util.divideUsers(users);
			  res.json(result);
		});

	}
	else {

		var err = util.checkSearchWords(searchText);

		if (err){

			var searchtxt = util.convertText(err);
			console.log(searchtxt);

			if(searchCriteria === "Announcements"){

				Announce.findAndCountAll({
				  attributes: ['id','publisher_username', 'content', 'createdAt'],
				  where: {
				    content: {
				    	$like: searchtxt
				    }
				  },
				  include: [{model: User, attributes: ['location','statusid']}],
				  order:'announcement.createdAt DESC',
				  offset: pageCount,
				  limit: 10
				  }).then(function (announcements) {
					  res.json(announcements);
				});
			}
			else if (searchCriteria === "Public Messages"){

				Message.findAndCountAll({
				  attributes: ['id','chatauthor', 'chatmessage', 'timestamp', 'createdAt'],
				  where: {
				    chatmessage: {
				    	$like: searchtxt
				    }
				  },
				  include: [{model: User, attributes: ['location','statusid']}],
				  order:'timestamp DESC',
				  offset: pageCount,
				  limit: 10
				  }).then(function (messages) {
					  res.json(messages);
				});
			}
			else if (searchCriteria === "Private Messages"){
				
				var currUser = req.session.user.username;

				privateMessage.findAndCountAll({
				  attributes: ['id','chatauthor', 'chattarget','chatmessage', 'timestamp', 'createdAt'],
				  where: {
				    chatmessage: {
				    	$like: searchtxt
				    },
				    $or: [{chatauthor: currUser}, 
				    	{chattarget: currUser}]
				  },
				  include: [{model: User, as: 'usertarget', attributes: ['location', 'statusid']},
				 		   {model: User, as: 'userauthor', attributes: ['location', 'statusid']}],
				  order:'timestamp DESC',
				  offset: pageCount,
				  limit: 10
				}).then(function (privmessages) {
				  res.json(privmessages);
				});
			}
		}
		else {
				res.json({error: "Incorrect Search Text"})
		}

	}

});



module.exports = router;