var onlineUsers = require('.././lib/onlineUsers.js');
var checkwords = require('.././lib/reservedNames.js');

exports.checkUserAccess = function(req){

	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~checkUserAccess");
	
	if(req.session.user.roleid == 1) return 1;
	else if(req.session.user.roleid == 2) return 2;
	else if(req.session.user.roleid == 3) return 3;
	
};


exports.ifSignIn = function (req, res, next) {
	if (req.session && req.session.user) { 
		console.log('~~~~~~~~~~~~~~~ Session exist!!!');
		next();
	}else{
		res.redirect('/signin');
	}  
};

exports.goOnline = function (user) {
	onlineUsers.addoOnlineUsers(user);
};

exports.checkAccountStatus = function(req){
	
	
	if(req.session.user.accountStatus != 0) {console.log("checkAccountStatus1"+req.session.user.accountStatus);return 1;}
	else if(req.session.user.accountStatus == 0) 
		{console.log("checkAccountStatus0"+req.session.user.accountStatus);return 0;}
	
};



exports.checkSearchWords = function(text){

	var mytext = text;
	var str = Array();
	var check = mytext.trim().split(/\s+/);
	var len = check.length;
	var exist, i;
	var err = false;

	for(i=0; i<len; i++){
		 exist = false;
		 //console.log(check[i]);
		   
		 exist = checkwords.stopWords(check[i].toLowerCase().trim());
           
         if(!exist){
         	str.push(check[i]);
         }
	}

	if (str.length === 0){
		
		return false;
	}
	else {
		
	    return str;
	}

};

exports.convertText = function (arr){

	var i, len = arr.length; 
	var text = '%' + arr[0];

    if (len>1){
		
		for(i=1; i<len; i++){
			text = text + '%'+ arr[i];
		}

		text = text + '%'
		return text.trim();
	}
	else{
		return text +'%';
	}
};


//---------devide InActive/ Active Users-----------


 exports.divideActiveUsers = function(users){
	 var users_listA = {'active':{}};
	   
		users.forEach(function(user){
			if (user.accountStatus != 0) {
				users_listA['active'][user.id] = {
					'username': user.username,
					'firstname': user.firstname,
					'lastname': user.lastname, 
				       'status_id': user.statusid, 
				       'location': user.location,
					'accountStatus': user.accountStatus,
				       'lastlogin': user.lastlogintime};
			}
		});

   users_listA.active = sortUsers(users_listA.active);
  // users_listA.inactive = sortUsers(users_listA.inactive);

   
	return users_listA;
};


 exports.divideInActiveUsers = function(users){
	 var users_listB = {'inactive': {}};
	   
		users.forEach(function(user){
			if (user.accountStatus == 0) {
				users_listB['inactive'][user.id] = {
					'username': user.username,
					'firstname': user.firstname,
					'lastname': user.lastname, 
				       'status_id': user.statusid, 
				       'location': user.location,
					'accountStatus': user.accountStatus,
				       'lastlogin': user.lastlogintime};
			}
		});

   users_listB.inactive = sortUsers(users_listB.inactive);

   
	return users_listB;
};
//---------devide InActive/ Active Users-----------






 exports.divideUsers = function(users){
	 var users_list = {'online':{}, 'offline': {}};
	   
	var user_on = onlineUsers.getOnlineUsers();	
		users.forEach(function(user){
			if (user.id in user_on) {
				users_list['online'][user.id] = {
														'username': user.username,
														'firstname': user.firstname,
													   'lastname': user.lastname, 
													   'status_id': user.statusid, 
													   'location': user.location,
													   'lastlogin': user.lastlogintime};
			}else{
				users_list['offline'][user.id]= {
														'username': user.username,
														'firstname': user.firstname,
													   'lastname': user.lastname,
				                   					   'status_id': user.statusid, 
													   'location': user.location,
													   'lastlogin': user.lastlogintime};
			}
		});

   users_list.online = sortUsers(users_list.online);
   users_list.offline = sortUsers(users_list.offline);

   
	return users_list;
};


function sortUsers(userlist){
	var list = {},
		keys=[],
		i, len;

	for (var key in userlist){
		if (userlist.hasOwnProperty(key)){
			var value = userlist[key].username;
			keys.push(value);
		}
	}

	keys.sort(insensitive);
	len = keys.length;

	for (i=0; i<len; i++){
		for(var item in userlist){
			if (userlist.hasOwnProperty(item) && userlist[item].username === keys[i]){
				userlist[item].id = item;
				delete userlist[item].username;
				list[keys[i]] = userlist[item];
			}
		}
		
	}
	return list;

};


function insensitive(k1, k2) {
  var k1lower = k1.toLowerCase();
  var k2lower = k2.toLowerCase();
  return k1lower > k2lower? 1 : (k1lower < k2lower? -1 : 0);
}


