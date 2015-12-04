var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models

var util = require('.././util/util.js');
var models = require('.././models');



router.get('/', function(req, res) {

	var searchCriteria = req.query.searchCriteria;
	var searchText = req.query.searchText;
	var pageCount = req.query.pageCount;

	if(searchCriteria === "Citizen"){

		models.user.findAll({
		  attributes: ['id','username', 'firstname', 'lastname', 'statusid', 'roleid', 'location', 'lastlogintime'],
		  where: {
		    username: {
		    	$like: '%'+ searchText +'%'
		    }
		   },
		   order:'username ASC'
		  
			}).then(function (users) {

			if(users.length ===0){

				res.json({error: "No results matching the search criteria"})
			}
			else{	

			  var result = util.divideUsers(users);
			  res.json(result);
			}
		});
	}
	else if(searchCriteria === "Citizen Status"){

		models.user.findAll({
		  attributes: ['id','username', 'firstname', 'lastname', 'statusid', 'roleid', 'location','lastlogintime'],
		  where: {
		    statusid: searchText
		  }
		  }).then(function (users) {

		  	if(users.length ===0){

				res.json({error: "No results matching the search criteria"})
			}
			else{	

		  	  var result = util.divideUsers(users);
			  res.json(result);
			}
		});

	}
	else {

		var err = util.checkSearchWords(searchText);

		if (err){

			var searchtxt = util.convertText(err);
			//console.log(searchtxt);

			if(searchCriteria === "Announcements"){

				models.announcement.findAndCountAll({
				  attributes: ['id','publisher_userid', 'content', 'createdAt'],
				  where: {
				    content: {
				    	$like: searchtxt
				    }
				  },
				  include: [{model: models.user, attributes: ['username','location','statusid']}],
				  order:'announcement.createdAt DESC',
				  offset: pageCount,
				  limit: 10
				  }).then(function (announcements) {
					  res.json(announcements);
				});
			}
			else if (searchCriteria === "Public Messages"){

				models.chathistory.findAndCountAll({
				  attributes: ['id','chatauthor_id', 'chatmessage', 'timestamp', 'createdAt'],
				  where: {
				    chatmessage: {
				    	$like: searchtxt
				    }
				  },
				  include: [{model: models.user, attributes: ['username','location','statusid']}],
				  order:'timestamp DESC',
				  offset: pageCount,
				  limit: 10
				  }).then(function (messages) {
					  res.json(messages);
				});
			}
			else if (searchCriteria === "Private Messages"){
				
				var currUser = req.session.user.id;

				models.privatechathistory.findAndCountAll({
				  attributes: ['id','chatauthor_id', 'chattarget_id','chatmessage', 'timestamp', 'createdAt'],
				  where: {
				    chatmessage: {
				    	$like: searchtxt
				    },
				    $or: [{chatauthor_id: currUser}, 
				    	{chattarget_id: currUser}]
				  },
				  include: [{model: models.user, as: 'usertarget_id', attributes: ['username','location', 'statusid']},
				 		   {model: models.user, as: 'userauthor_id', attributes: ['username','location', 'statusid']}],
				  order:'timestamp DESC',
				  offset: pageCount,
				  limit: 10
				}).then(function (privmessages) {
				  res.json(privmessages);
				});
			}
		}
		else {
				res.json({error: "Search text contains stop words"})
		}

	}

});




module.exports = router;