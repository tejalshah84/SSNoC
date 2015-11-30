/// Include the node file module
var fs = require('fs');
var models = require('.././models');



exports.uploadImage = function(req, filename, path, callback){
	if (!req.file){
  	console.log("No image uploaded");
		callback();
	}else{
	fs.readFile(req.file.path, function (err, data) {
		if(!filename){
			console.log("There was an error");
		} else {
		  var newPath = path + "/" + filename;
			console.log("path = "+newPath);
		  fs.writeFile(newPath, data, function (err){
		  	console.log("ok!!!");
				callback();
		  });
		}
	});
	}
};


exports.createMissingPerson = function(data, filename, current_user, callback){
	models.missingperson.create({ 
		reporter_userid: current_user.id,
		firstname: data.firstname,
		lastname: data.lastname,
		age: data.age,
		height: data.height,
		weight: data.weight,
		location: data.location,
		lastseen: data.lastseen,
		description: data.description, 
		picture: filename
	}).then(function(person) {		
		console.log("Missing person created!");
		callback(person['dataValues']);
	});
};

exports.foundMissingPerson = function(person_id, data, callback){
	console.log("people# "+person_id);
	
	models.missingperson.update(
			  {
				  missing: 0, 
					location: data.location,
					note: data.note, 
					lastseen: data.lastseen
			  },
			  {
			    where: { id: person_id }
			  })
			  .then(function (person) { 
					console.log("here.......!");
					console.log(person);
				  callback(person);
			  })
			  .error(function (e) {
				  console.log(e);
			  });
};