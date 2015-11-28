$(function() {

// Initialize varibles
var connected = false;
var current_user = Number($('#current_user').text());
var current_username = $('#current_username').text();
var current_roleid = Number($('#current_roleid').text());
var target_user;
var socket = io();
var status_arr = {'ok':3, 'help':2, 'emergency': 1, 'no_status': 4};
var status_logo = {3:'glyphicon glyphicon-ok-sign', 2:'glyphicon glyphicon-exclamation-sign', 1:'glyphicon glyphicon-plus-sign', 4: 'glyphicon glyphicon-question-sign'};
var $privMessageslist = $('.privMessageslist');
var $privInputMessage = $('.privInputMessage');
var $privMessages = $('.privMessages');
//Menu configuring access to various features
var menu = {		

	'home': "<li class=\"c-menu__item\">" +
	"<a href=\"/community\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-home\" aria-hidden=\"true\"></span> Home</a></li>",

    'missing': "<li class=\"c-menu__item\">" +
    "<a href=\"/missing/deck\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-question-sign\" aria-hidden=\"true\"></span> Missing People</a></li>",

    'announcement': "<li class=\"c-menu__item\">" +
    "<a data-toggle=\"modal\" data-target=\"#postAnnouncementModal\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-volume-up\" aria-hidden=\"true\"></span> Post Announcement</a></li>",

    'userprofile': "<li class=\"c-menu__item\">" +
    "<a href=\"#\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span> Admin User Profile</a></li>",
        
    'monitorperform': "<li class=\"c-menu__item\">" +
    "<a href=\"/admin\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-equalizer\" aria-hidden=\"true\"></span> Measure Performance</a></li>",
        
    'signout': "<li class=\"c-menu__item\">" +
    "<a href=\"/signout\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-log-out\" aria-hidden=\"true\"></span> Signout</a></li>"
}


$(window).load(function() {
	loadRightBarMenu(current_roleid);
	getUserDirectory();
	
	if ($('#isnewuser').text() == 'true'){
		console.log('in modal if');
		$('#welcomeModal').modal('show');
	}
	if($('#push_notification').length > 0){
		$('#push_notification').fadeIn('slow');
	}
	if($("#public_messages").length > 0){
		getChatHistory();
	}
	if($("#private_messages").length > 0){
		target_user = Number($('#targetUserName').text());
		getPrivChatHistory(target_user);
		scrollListBtm();	
	}
    socket.emit('setUserSocketID', {
        userid: current_user
    });
	retrieveLatestAnnouncement();
});


//---------------------------Socket Connect and Disconnect Events------------------------
	

// Whenever the server emits 'login', log the login message
socket.on('login', function (data) {
   connected = true;
   loadChatHistory(data);
});


// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', function (data) {
   log(data.username + ' joined');
   addParticipantsMessage(data);
});

// Whenever the server emits 'user left', log it in the chat body
socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
});


//---------------------------Public Chat Socket-------------------------------------------

//Emit Public Chat Message
$('#submitMessage').on('click', function(){
	console.log('emitting public chat');
    if($('.inputMessage').val() !== ''){
       	socket.emit('new message', {
          	chatauthor_id: current_user,
         	location: $('#location').text(),
          	status: parseInt($('#status').text(),10),
          	timestamp: new Date(),
          	chatmessage: $('.inputMessage').val()
        });
        $('.inputMessage').val('');
    }
});

   
//Receive Public Chat Message
socket.on('new message', function (data) {
	console.log(data);
   addChatMessage(data);
});


//---------------------------Private Chat Socket-------------------------------------------


//Emit Private Chat Message
$('#privSubmitMessage').on('click', function(){
	var abc = $('.privInputMessage').val();
    if(abc!== ''){

    	var data = {
    		chatauthor_id: current_user,
    		chatauthor: current_username,
          	chattarget_id: target_user,
          	chatmessage: abc,
          	timestamp: new Date()
    	}
    	//Send private message
     	socket.emit('PrivateChatMsg', data);
   		//Setting username for Private Chat  
      	socket.emit('setUsername', {
    	  	chatauthor: current_user,
    	  	chattarget: $('#targetName').text(),
    	});
        $('.privInputMessage').val('');
        addPrivChatMessage(data);
    }
});



//Receive Private Chat Message
socket.on('private chat', function (data) {
   addPrivChatMessage(data);
});

//------------------Change Status Code---------------------------------------------------

//Change Status Socket Emit
$('.status_list').on('click', 'li', function(event) {
	var button = $(event.target);
	var statusid = status_arr[$(this).attr('id')];
	socket.emit('change status', {
		userid: current_user,
		status_id: statusid
	});	
});	


//Receive updated status for current user
socket.on('new status', function (data) {	
    if(data.userid == current_user){
		$('#current_status').removeClass().addClass(status_logo[data.statusid]);    
	}
	$('#'+data.userid+" .statuslogo").empty().append(getUserStatus(data.statusid));	
});

//-------------------Post Announcement Code--------------------------------------------------

//Publish new announcement via socket emit
$('.post_announcement').on('click', function(){
	
    if($('.new_announcement_content').val() !== ''){
      socket.emit('new announcement', {
      	publisher_userid: current_user,
		content: $('.new_announcement_content').val(),
        createdAt: new Date()
      });
	}
    $('.new_announcement_content').val('');
 });


//Receive new announcement from socket
socket.on('new annoucement', function (data) {	
    if($('#postAnnouncementModal').length > 0){
    	$('#postAnnouncementModal').modal('hide');
		$("#top_menu_dropdown").removeClass('in open');
    	$('.latest_announce_content').text(data.content);
		$('.latest_announce_publisher').text("by "+data.publisher_username+" at "+ dateForamt(data.createdAt));
    }
	$('#new_announce_post').empty();
	var post = "<strong>"+data.content+"</strong>"+"   - posted by: "+data.publisher_username+" at "+dateForamt(data.createdAt);
	$('#new_announce_post').append(post);
	$('#announcement').show();
	
}); 


//---------------------User Directory Functions ---------------------------------------------

//Left Side Bar On Click get User Directory
$('.user_directory').on('click', function(){
	getUserDirectory();
});


//Get User Directory Function
function getUserDirectory(){	
 	$.ajax({
 		dataType: "json",
 		url: '/api/users/online',
 		type: 'GET',
 		data: {},
 		success: function(data) {
 			displayUserDirectory(data);
 		},
 		error: function(e) {
 		}
 	});	
}

//Display User Directory Function
function displayUserDirectory(users){		 
	console.log(users.offline);
	$('#online_list').empty();
	$('#offline_list').empty();
	var users_online = users.online;
	$('#current_status').removeClass().addClass(status_logo[users_online[current_username].status_id]);
	delete users_online[current_username];
	$.each(users_online, function(index, element) {
		var statusLogo = getUserStatus(element.status_id); 
	 	var item = "<a id =\""+element.id+"\" href=\"/chat/"+element.id+"\" style=\"color: white;\"><span class=\"statuslogo\">"+statusLogo+"</span>"+index+"</a>";
		 	$('#online_list').append("<li id='targetName' style=\"padding: 5px 0;\">"+item+"</li>");	 		
	});
	$.each(users.offline, function(index, element) {
		var statusLogo = getUserStatus(element.status_id); 
		var item = " <a id =\""+element.id+"\" href=\"/chat/"+element.id+"\" style=\"color: #a7a6a4;\"><span class=\"statuslogo\">"+statusLogo+"</span>"+index+"</a>";
			$('#offline_list').append("<li style=\"padding: 5px 0;\">"+item+"</li>");
	});
}


//-----------------Post Announcement Functions--------------------------------------------------


//Retrieve Lastest Announcement Function
function retrieveLatestAnnouncement(){
  	$.ajax({
  		dataType: "json",
  		url: '/api/messages/announcement/latest',
  		type: 'GET',
  		data: {},
  		success: function(data) {
			 displayLatestAnnouncement(data);
  		},
  		error: function(e) {
  			
  		}
  	});	
}


//Display Lastest Announcement
function displayLatestAnnouncement(data){		
	$('#new_announce_post').empty();
  	var post = "<strong>"+data.content+"</strong>"+"   - posted by: "+data.publisher+" at "+dateForamt(data.createdAt);
  	$('#new_announce_post').append(post);
  	$('#announcement').show();
    if($('#postAnnouncementModal').length > 0){
    	$('.latest_announce_content').text(data.content);
		$('.latest_announce_publisher').text("by "+data.publisher_username+" at "+ dateForamt(data.createdAt));
    }
}


//-----------Public Chat Functions-------------------------------------------------------------

//Get Public Chat History from DB
function getChatHistory(){
	$.ajax({
		dataType: "json",
		url: '/messages',
		type: 'GET',
		data: {},
		success: function(data) {
 			loadChatHistory(data);
		},
		error: function(e) {
 		}
 	});	
}

//Load Public Chat History on Page
function loadChatHistory(data){
	data.forEach(function(msg){
		var chatContent = "<blockquote><p><span class=\"chat_author\">"+msg.user.username+": </span>"+	
							msg.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(msg.timestamp)+"</small></span></p></blockquote>";
		var item = "<li class=\"messages_item\">"+chatContent+"</li>";
		console.log(item);
		$('#messages').append(item);			
	});
	scrollListBtm();		
}

//Adds the individual public chat message to the public wall
function addChatMessage (data) {
	var chatContent = "<blockquote><p><span class=\"chat_author\">"+data.chatauthor+": </span>"+	
					data.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(data.timestamp)+"</small></span></p></blockquote>";					
	var item = "<li class=\"messages_item\">"+chatContent+"</li>";
	$('#messages').append(item);
	scrollListBtm();				 
}


//-----------Private Chat Functions-------------------------------------------------------------


//Get Private Chat History from DB
function getPrivChatHistory(element){
	$.ajax({
		dataType: "json",
		url: '/privatechats',
		type: 'GET',
		data: {
			chatauthor:current_user,
			chattarget: element
		},
		success: function(data) {
			loadPrivChatHistory(data);
		},
		error: function(e) {
		}
 	});	
}


//Load Public Chat History on Page
function loadPrivChatHistory(data){
	data.forEach(function(msg){
		var chatContent = "<blockquote><p><span class=\"chat_author\">"+msg.userauthor_id.username+": </span>"+	
						msg.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(msg.timestamp)+"</small></span></p></blockquote>";
		var item = "<li id=\"priv_messages_item\">"+chatContent+"</li>";
		$('#privMsgList').append(item);
	});
	scrollListBtm();		
}

//Adds the individual private chat message to the private chat window and updates badge number
function addPrivChatMessage (data) {
		   
	var chatContent = "<blockquote><p><span class=\"chat_author\">"+data.chatauthor+": </span>"+	
						data.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(data.timestamp)+"</small></span></p></blockquote>";					
	var item = "<li class=\"priv_messages_item\">"+chatContent+"</li>";
	$('#privMsgList').append(item);
	scrollListBtm();	
	
	//updating user directory with msg badge numbers
	var $badge = $("#"+data.chatauthor+" .badge");
	if($("#"+data.chatauthor+" .badge").length > 0){
		$("#"+data.chatauthor+" .badge").text(incrementNumMsg($("#"+data.chatauthor+" .badge")));
	}
	else{
		var msgNotification = "<span class=\"badge\">"+1+"</span>";
		$("#"+data.chatauthor).append(msgNotification);			
	}		
}

//Update Private Chat Badge Number in User Directory
function incrementNumMsg(badge){
	return parseInt(badge.text())+1;	
}

//-----------Common Functions-------------------------------------------------------------


//Format Date Function
function dateForamt(date){
	var d = new Date(date);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = d.getDate() + " " + month[d.getMonth()] + ", " +  d.getFullYear();
    var time = d.toLocaleTimeString().toLowerCase();
    return (date + " at " + time); 
}


//Scroll Chat Window to Bottom
function scrollListBtm(){
	if($("#public_messages #messages li").length > 0){
		var last_li = $("#messages")[0].scrollHeight;			
		$("#public_messages").animate({
		    scrollTop: last_li
		}, 1000);
	}
	if($("#private_messages #privMsgList li").length > 0){
		//var last_pri_li = $("#privMsgList li:last-child").offset().top; 
		var last_pri_li = $("#privMsgList")[0].scrollHeight;	
		$("#private_messages").animate({
		    scrollTop: last_pri_li
		}, 1000);
	}
}
   
		
// Prevents input from having injected markup
function cleanInput (input) {
    return $('<div/>').text(input).text();
}

//Retrieve Status Logo given status id
function getUserStatus(num){ 
	if(num===3){
	    statusLogo = "<span class=\"" + status_logo[3]+ "\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";
	}
	else if (num===2){
	     statusLogo = "<span class=\"" + status_logo[2]+ "\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";
	}
	else if (num===1){
	    statusLogo = "<span class=\"" + status_logo[1]+ "\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";			 
	}
	else{
	    statusLogo = "<span class=\"" + status_logo[4]+ "\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";
	}
	return statusLogo;
}
		 
// Focus input when clicking on the message input's border
$('.inputMessage').click(function () {
    $('.inputMessage').focus();
});


function loadRightBarMenu(roleid){

	var menulist = " ";

	if (roleid ===1){
		menulist = menu['home'] + menu['missing'] +  menu['monitorperform'] + menu['signout'];
		$('.c-menu__items').append(menulist);
	}
	else if (roleid ===2){
		menulist = menu['home'] + menu['missing'] +  menu['userprofile'] + menu['signout'];
		$('.c-menu__items').append(menulist);
	}
	else if (roleid ===3){
		menulist = menu['home'] + menu['missing'] +  menu['announcement'] + menu['signout'];
		$('.c-menu__items').append(menulist);
	}
	else if (roleid ===4){
		menulist = menu['home'] + menu['missing'] + menu['signout'];
		$('.c-menu__items').append(menulist);
	}
}



//-----------Measure Performance (I3)-------------------------------------------------------------


var $test_duration = $('#test_duration');	
var timeFunc = '';
var startTime;
var numPOST_s = 0;
var numGET_s = 0;
var numOfReqest = {"GET": 0, "POST": 0 };
var responseGETTimeC,responsePOSTTimeC, responseGETTimeS, responsePOSTTimeS;
var terminate = false;


$('#start_testing_get').on('click', function(){	 
	restart();
	setTimeout(startUseCase_GET, 1);
});
 
$('#start_testing_post').on('click', function(){	 
	restart();
	setTimeout(startUseCase_POST, 1);
});
 
$('#stop_testing').on('click', function(){
	terminate = true;	 
	endUseCase();	 
});

$('#end_testing').on('click', function(){
	terminate = true;	 
	endUseCase();	 
});

function isTimeUp(duration){
	return ((new Date()-startTime) > duration);
}
 
function startUseCase_GET(){
	if(terminate){		 
		return;
	}
	sendGETReq();	
	responseGETTimeC = new Date();
	responseTimeC = new Date();
	var d1 = {
		"POST": 0, 
		"GET": (numOfReqest.GET/((responseGETTimeC-startTime)/1000))
	};		
	$('#get_req_num_c').text(numOfReqest.GET);
	$('#get_req_time_c').text(d1.GET);
	if(!isTimeUp($test_duration.val()*1000)){
		setTimeout(startUseCase_GET, 1);
	}
}
 
function startUseCase_POST(){
	if(terminate){		 
		return;
	}
	sendPOSTReq();	
	responsePOSTTimeC = new Date();
	responseTimeC = new Date();
	var d1 = {
		"POST": (numOfReqest.POST/((responsePOSTTimeC-startTime)/1000)), 
		"GET": 0
	};
	$('#post_req_num_c').text(numOfReqest.POST);
	$('#post_req_time_c').text(d1.POST);
	if(!isTimeUp($test_duration.val()*1000)){
		setTimeout(startUseCase_POST, 1);
	}
}
	

function endUseCase(){
	$.ajax({
		url: '/admin/end_testing',
		type: 'GET',
		success: function(data) {
			console.log("Test db has been dropped! Use Case Ends.");	
		},
		error: function(e) {
		}
	});	
	 		 
}

function sendGETReq(){
	numOfReqest.GET++;
	$.ajax({
		dataType: "json",
		url: '/test_messages',
		type: 'GET',
		success: function(data) {
			responseGETTimeS = new Date();
			$('#get_req_num_s').text(++numGET_s);
			$('#get_req_time_s').text((numGET_s/((responseGETTimeS-startTime)/1000)));
			if(numGET_s == numOfReqest.GET){
			}
		},
		error: function(e) {
		}
	});	
}

function sendPOSTReq(){
	numOfReqest.POST++;
	$.ajax({
		dataType: "json",
		url: '/test_messages',
		type: 'POST',
		data: {
			chatauthor: "EileenW",
			chatmsg: makeRandomMessage(20),
			timestamp: new Date()
		},
		success: function(data) {	 
			responsePOSTTimeS = new Date();
			$('#post_req_num_s').text(++numPOST_s);
			$('#post_req_time_s').text((numPOST_s/((responsePOSTTimeS-startTime)/1000)));
		},
		error: function(e) {
		}
	});	
}

function updateRequestNumber(type, data){
	$('#get_req_num_'+type).text(data.GET);
	$('#post_req_num_'+type).text(data.POST);
}

function updateRequestTime(type, data){
	$('#get_req_time_'+type).text(data.GET);
	$('#post_req_time_'+type).text(data.POST);
}

function makeRandomMessage(numOfChar){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < numOfChar; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
 
function restart(){
	startTime = new Date();
 	numOfReqest = {"GET": 0, "POST": 0 };
	numPOST_s = 0;
	numGET_s = 0;
	responseGETTimeC = 0;
	responsePOSTTimeC = 0;
	responseGETTimeS = 0; 
	responsePOSTTimeS = 0;
	terminate = false;
	updateRequestNumber('c',numOfReqest);
	updateRequestNumber('s',numOfReqest);
	updateRequestTime('c',numOfReqest);
	updateRequestTime('s',numOfReqest);
	console.log("restart...");
}


//-----------Missing People (I4)-------------------------------------------------------------


// This is the id of the form
$('.find_person').on('click', function() {
	$.ajax({
		url: '/missing/'+currentPersonCard+'/found',
		type: 'POST',
		data: {
			note: 'xxx',
			lastseen: $('#found_report_lastseen').val(),
			location: $('#found_report_location').val()
		},
		success: function(data) {
			var chatmsg = "Hey, I found "+data.person.firstname+" around "+$('#found_report_lastseen').val()+" at "+$('#found_report_location').val();
			var data = {"id": data.id, "reporter_userid": data.reporter_userid, "founder": data.founder, "chatmessage": chatmsg};
				emitPushNotification(data);
			var re = new RegExp(/^.*\//);
			var redirect = re.exec(window.location.href);
			window.location.replace(redirect+"deck");
		},
		error: function(e) {
		
		}
	});	
});
	

$('.file_found_report').on('click', function(){
  	$.ajax({
  		url: '/missing/'+currentPersonCard,
  		type: 'GET',
  		success: function(data){	
			displayPersonReport(data);
  		},
  		error: function(e) {
  		}
  	});	
});
	

function displayPersonReport(person){
	$('.report_pname').text(person.firstname+" "+person.lastname);
	$('.report_page').text(person.age);
	$('.report_plocation').text(person.location);
	$('.report_plastseen').text(person.lastseen);
	$('.report_pimage').attr("src", "/uploads/"+person.picture);
}
	
function emitPushNotification(data){
	socket.emit('push notification', data);	
}
	

$('.btn-emit-push-notification').on('click', function(){
	var data = {"id": 2, "reporter_userid": 'EileenW' };
	emitPushNotification(data);
});
	

socket.on('new notification', function (data) {
	var re = new RegExp(/^.*\//);
	var redirect = re.exec(window.location.href);
	var content = data.chatauthor+" has found the person that you're looking for! "+'<a href=\'/chat/'+data.chatauthor+'\'> See more! </a>';
	var view = "<div class=\"alert alert-warning alert-dismissible\" role=\"alert\" style=\"top:0; position:absolute;z-index:1000000;\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button><strong class=\"notification_content\">"+content+"</strong></div>";
	$('#push_notification').append(view);
});
	
	
$('.modal').on('shown.bs.modal', function() {
	//Make sure the modal and backdrop are siblings (changes the DOM)
	$(this).before($('.modal-backdrop'));
	//Make sure the z-index is higher than the backdrop
	$(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
});


});