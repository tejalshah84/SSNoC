$(function() {

// Initialize varibles
var connected = false;
var current_user = Number($('#current_user').text());
var current_username = $('#current_username').text();
var current_roleid = Number($('#current_roleid').text());
var target_user;
var socket = io();
var $privMessageslist = $('.privMessageslist');
var $privInputMessage = $('.privInputMessage');
var $privMessages = $('.privMessages');



$('.btn-emit-push-notification').on('click', function(){
	var data = {"id": 2, "reporter_userid": 'EileenW' };
	emitPushNotification(data);
});





$('.modal').on('shown.bs.modal', function() {
  //Make sure the modal and backdrop are siblings (changes the DOM)
  $(this).before($('.modal-backdrop'));
  //Make sure the z-index is higher than the backdrop
  $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
});







$(window).load(function() {
	loadRightBarMenu(current_roleid);
	getUserDirectory();
	
	if ($('#isnewuser').text() == 'true'){
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

//------------------Change Status Socket---------------------------------------------------

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

//-------------------Post Announcement Socket--------------------------------------------------

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

//---------------------Admin Profile Functions ---------------------------------------------
 	 function getUser(str, callback){
 		 console.log("Sending Ajax request to server...");		
 		 $.ajax({
 			 dataType: "json",
 			 url: '/api/users/' + str,
 			 type: 'GET',
 			 data: {},
 			 success: function(data) {

 				 callback(data);
 			 },
 			 error: function(e) {
  		  }
  		});	
 	 }


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
 			displayUserProfile(data);

 		},
 		error: function(e) {
 		}
 	});	
}

	/*---------- Admin Profile Use Case-------------------*/

function displayUserProfile(users){
	
 	$.each(users.offline, function(index, element) {
		var item = index;
		$('#user_list1').append('<option value=' + item + '>' + item + '</option>');
	});
 	$.each(users.online, function(index, element) {
		var item = index;
		$('#user_list1').append('<option value=' + item + '>' + item + '</option>');
	});
	
	
 	$("#user_list1").change(function(){
 		var selectedValue = $(this).find(":selected").val();
		getUser(selectedValue, function(data) {
			$('input[name=new_username]').val(selectedValue);
			// $('input[name=password]').val(data['password']);
			$('#role').val(data['roleid']);
			$('#accountStatus').val(data['accountStatus']);
		});
 	});
	
}
	/*---------- Admin Profile Use Case-------------------*/

//Display User Directory Function
function displayUserDirectory(users){		 
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
  	var post = "<div class=\"announcement-text\">"+data.content+"</div>"+ "<div class=\"announcement-by\">by " +data.user.username +" at "+ dateForamt(data.createdAt) + "</div>";
  	$('#new_announce_post').append(post);
  	$('#announcement').show();
    if($('#postAnnouncementModal').length > 0){
    	$('.latest_announce_content').text(data.content);
		$('.latest_announce_publisher').text("by "+data.user.username+" at "+ dateForamt(data.createdAt));
    }
}


//-----------Public Chat Functions-------------------------------------------------------------

//Get Public Chat History from DB
function getChatHistory(){
	$.ajax({
		dataType: "json",
		url: '/api/messages/wall',
		type: 'GET',
		data: {},
		success: function(data) {
			console.log(data);
 			loadChatHistory(data);
		},
		error: function(e) {
 		}
 	});	
}

//Load Public Chat History on Page
function loadChatHistory(data){
	data.forEach(function(msg){
		var chatContent = "<blockquote><p><div class=\"chat_author\">"+msg.user.username+"</div><div class=\"chat_timestamp\"><small>"+dateForamt(msg.timestamp)+"</small></div><div class=\"clear-float\"></div><div class=\"chat-messsage\">"+	
							msg.chatmessage+"</div></p></blockquote>";
		var item = "<li class=\"messages_item\">"+chatContent+"</li>";
		$('#messages').append(item);			
	});
	scrollListBtm();		
}

//Adds the individual public chat message to the public wall
function addChatMessage (data) {
	var chatContent = "<blockquote><p><div class=\"chat_author\">"+data.chatauthor+"</div><div class=\"chat_timestamp\"><small>"+dateForamt(data.timestamp)+"</small></div><div class=\"clear-float\"></div><div class=\"chat-messsage\">"+	
							data.chatmessage+"</div></p></blockquote>";
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
		var chatContent = "<blockquote><p><div class=\"chat_author\">"+msg.userauthor_id.username+"</div><div class=\"chat_timestamp\"><small>"+dateForamt(msg.timestamp)+"</small></div><div class=\"clear-float\"></div><div class=\"chat-messsage\">"+	
							msg.chatmessage+"</div></p></blockquote>";
		var item = "<li id=\"priv_messages_item\">"+chatContent+"</li>";
		$('#privMsgList').append(item);
	});
	scrollListBtm();		
}

//Adds the individual private chat message to the private chat window and updates badge number
function addPrivChatMessage (data) {
	var chatContent = "<blockquote><p><div class=\"chat_author\">"+data.chatauthor+"</div><div class=\"chat_timestamp\"><small>"+dateForamt(data.timestamp)+"</small></div><div class=\"clear-float\"></div><div class=\"chat-messsage\">"+	
							data.chatmessage+"</div></p></blockquote>";					
	var item = "<li class=\"priv_messages_item\">"+chatContent+"</li>";
	$('#privMsgList').append(item);
	scrollListBtm();	
	
	//updating user directory with msg badge numbers
	var $badge = $("#"+data.chatauthor_id+" .badge");
	if($("#"+data.chatauthor_id+" .badge").length > 0){
		$("#"+data.chatauthor_id+" .badge").text(incrementNumMsg($("#"+data.chatauthor_id+" .badge")));
	}
	else{
		var msgNotification = "<span class=\"badge\">"+1+"</span>";
		var patt = new RegExp(data.chatauthor_id);
		if(!patt.test(window.location.href)){
		$("#"+data.chatauthor_id).append(msgNotification);			
		}
		}		
}

//Update Private Chat Badge Number in User Directory
function incrementNumMsg(badge){
	return parseInt(badge.text())+1;	
}

//-----------Common Functions-------------------------------------------------------------


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
   
		 
// Focus input when clicking on the message input's border
$('.inputMessage').click(function () {
    $('.inputMessage').focus();
});



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
			var data = {"reporter_userid": data.reporter_userid, "founder": data.founder,"founder_id": data.founder_id, "chatmessage": chatmsg};
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
	var content = data.chatauthor+" has found the person that you're looking for! "+'<a href=\'/chat/'+data.chatauthor_id+'\'> See more! </a>';
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