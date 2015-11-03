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

				Announce.findAll({
				  attributes: ['id','publisher_username', 'createdAt', 'updatedAt', 'content'],
				  where: {
				    content: {
				    	$like: searchtxt
				    }
				  },
				  order:'createdAt DESC',
				  offset: pageCount,
				  limit: 10
				  }).then(function (announcements) {
					  res.json(announcements);
				});
			}
			else if (searchCriteria === "Public Messages"){

				Message.findAll({
				  attributes: ['id','chatauthor', 'chatmessage', 'timestamp', 'createdAt'],
				  where: {
				    chatmessage: {
				    	$like: searchtxt
				    }
				  },
				  order:'timestamp DESC',
				  offset: pageCount,
				  limit: 10
				  }).then(function (messages) {
					  res.json(messages);
				});
			}
			else if (searchCriteria === "Private Messages"){
				
				var currUser = req.session.user.username;

				privateMessage.findAll({
				  attributes: ['id','chatauthor', 'chattarget','chatmessage', 'timestamp', 'createdAt'],
				  where: {
				    chatmessage: {
				    	$like: searchtxt
				    },
				    $or: [{chatauthor: currUser}, 
				    	{chattarget: currUser}]
				  },
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