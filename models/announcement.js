var Sequelize = require('sequelize');

module.exports = function(sequelize){
	var announcement = sequelize.define('announcement', {
	  id:{
	    type: Sequelize.INTEGER,
	      primaryKey: true,
	      autoIncrement: true
	  },
		publisher_userid: {
	    type: Sequelize.INTEGER
	  },
	  content: {
	    type: Sequelize.TEXT,
	    allowNull: true,
	    defaultValue: null
	  },
	  createdAt: {
	    type: Sequelize.DATE
	  },
	  updatedAt: {
	    type: Sequelize.DATE
	  }
	}, {
	  freezeTableName: true, // Model tableName will be the same as the model name
		classMethods:{
			associate: function(models){
				announcement.belongsTo(models.user, {foreignKey: 'publisher_userid', targetKey: 'id'});		
			},
			createAnnouncement: function(models, data, next){
				models.user.findById(models, data.publisher_userid, function(user){
					models.announcement.create({ 
						publisher_userid: user.id,
						content: data.content,
						createdAt: data.createdAt
					}).then(function(announcement) {
						next(announcement);
					});
				});	
			},
			destroyAnnouncement: function(models, id, next){
				models.announcement.findOne({ where: { id: id}}).then(function(result){
					return result.destroy();
				}).then(function(e){
					next();
				});
			},
/*			createAnnouncement: function(models, publishcontent, publishid, next){

				models.announcement.create({
					publisher_userid: publishid,
					content: publishcontent
				}).then(function(announcement){
					next(announcement);
				}).then(function(e){
					next();
				});
			},*/
			searchAnnouncements: function(models, searchtxt, pageCount, next){
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
					next(announcements);
				}).catch(function(e){
					next(null);
				});
			}
		}
	});


	
	return announcement;
};