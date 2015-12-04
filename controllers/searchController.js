var express = require('express');
var router = express.Router();
var sequelize = require('.././sequelize');
//importing models

var util = require('.././util/util.js');
var models = require('.././models');


//Function that take search criteria and search text and fetches matching results from the appropriate
router.get('/', function(req, res) {

	var searchCriteria = req.query.searchCriteria;
	var searchText = req.query.searchText;
	var pageCount = req.query.pageCount;

	if(searchCriteria === "Citizen"){

		models.user.searchUsername(models, searchText, function(users){
			if(users === null){
				res.status(500).send("Internal Error occured while fetching data");
			}
			else if(users.length ===0){
				res.type('json').status(200).send({error: "No results matching the search criteria"})
			}
			else{
			  var result = util.divideUsers(users);
			  res.type('json').status(200).send(result);
			}
		})
	}
	else if(searchCriteria === "Citizen Status"){

		models.user.searchByStatus(models, searchText, function(users){

		  	if(users === null){
				res.status(500).send("Internal Error occured while fetching data");
			}
			else if(users.length ===0){
				res.type('json').status(200).send({error: "No results matching the search criteria"})
			}
			else{	
		  	  var result = util.divideUsers(users);
			  res.type('json').status(200).send(result);
			}
		});

	}
	else {

		var existsTxt = util.checkSearchWords(searchText);

		if (existsTxt){

			var searchtxt = util.convertText(existsTxt);

			if(searchCriteria === "Announcements"){
				models.announcement.searchAnnouncements(models, searchtxt, pageCount, function(announcements){
					res.type('json').status(200).send(announcements);
				})
			}
			else if (searchCriteria === "Public Messages"){
				models.chathistory.searchMessages(models, searchtxt, pageCount, function(messages){
					res.type('json').status(200).send(messages);
				})
			}
			else if (searchCriteria === "Private Messages"){

				var curr_user = req.query.authorid;

				models.privatechathistory.searchPrivateMessages(models, searchtxt, pageCount, curr_user, function(messages){
					res.type('json').status(200).send(messages);
				})	
			}
		}
		else {
				res.json({error: "Search text contains only stop words"})
		}

	}

});




module.exports = router;