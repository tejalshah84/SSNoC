var onlineUsers = require('.././lib/onlineUsers.js');
var checkwords = require('.././lib/reservedNames.js');


exports.checkSearchWords = function(text){

	var mytext = text;
	var str = Array();
	var check = mytext.trim().split(/\s+/);
	var len = check.length;
	var exist, i;
	var err = false;

	for(i=0; i<len; i++){
		 exist = false;
		 console.log(check[i]);
		   
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



 exports.divideUsers = function(users){
	var users_list = {};
	    users_list.online={};
	    users_list.offline={};
	var user_on = onlineUsers.getOnlineUsers();	

		users.forEach(function(user){
			if (user.username in user_on) {
				users_list['online'][user.username] = {'status_id': user.statusid};
			}else{
				users_list['offline'][user.username]= {'status_id': user.statusid};
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
			keys.push(key);
		}
	}

	keys.sort(insensitive);
	len = keys.length;

	for (i=0; i<len; i++){
		list[keys[i]] = userlist[keys[i]];
	}

	return list;

};


function insensitive(k1, k2) {
  var k1lower = k1.toLowerCase();
  var k2lower = k2.toLowerCase();
  return k1lower > k2lower? 1 : (k1lower < k2lower? -1 : 0);
}


//return the user hash: online and offline
/*function divideUsers(users){
	var users_list = {};
	users_list['online'] = onlineUsers.getOnlineUsers();	
		var user_off = {};	

		users.forEach(function(user){
			if (user.username in users_list['online']) {
				users_list['online'][user.username]['status_id'] = user.statusid;
			}else{
				user_off[user.username] = user.statusid;
			}	
			
		});

		users_list['offline'] = user_off;
		console.log("+++++++++++", users_list);
	return users_list;
}*/

