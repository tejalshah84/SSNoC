$(function() {
  // Initialize varibles
  var $window = $(window);
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box
  var connected = false;
  var current_user = $('#current_user').text();
  var target_user = "";
  var socket = io();
	console.log("-- Loading main.js --");
  var status_arr = {'ok':1, 'help':2, 'emergency': 3};
  var status_logo = {1:'glyphicon glyphicon-ok-sign', 2:'glyphicon glyphicon-exclamation-sign', 3:'glyphicon glyphicon-plus-sign'};
  var $privMessageslist = $('.privMessageslist');
  var $privInputMessage = $('.privInputMessage');
  var $privMessages = $('.privMessages');
  
  
  // Keyboard events
/*  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
  //  if (event.which === 13) {
      if (username) {
				console.log("Sending msg...");
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } 
 //   }
  });*/
	
	//console log when click status
$('.status_list').on('click', 'li', function(event) {
		var button = $(event.target);
		console.log("status menu selected: " + $(this).attr('id'));
		var statusid = status_arr[$(this).attr('id')];
		
		socket.emit('change status', {
		      username: current_user,
		 			status_id: statusid
		    });
		
});	



	
 $('.post_announcement').on('click', function(){
	 console.log("Sending Ajax request to server...");
 		
     if($('.new_announcement_content').val() !== ''){
       console.log('emitting socket for annoucement...');
         socket.emit('new announcement', {
           publisher_username: current_user,
			 		content: $('.new_announcement_content').val(),
           createdAt: new Date()
         });
	 }
         $('.new_announcement_content').val('');
		 
		
 });
	
	
	$(window).load(function() {
		if($("#public_messages").length > 0){
			getChatHistory();
		}
		if($("#private_messages").length > 0){
			scrollListBtm();	
		}
		getUserDirectory();
    socket.emit('setUserSocketID', {
        username: current_user
      });
		
		
	//	$('#announcement').hide();
		retrieveLatestAnnouncement();
	});
	
	//handling user directoy display
	 $('.user_directory').on('click', function(){
		 getUserDirectory();
	 });
	 
	 function retrieveLatestAnnouncement(){
  		$.ajax({
  			dataType: "json",
  		  url: '/announcements/latest',
  		  type: 'GET',
  			data: {
        //  appID: $inputAppID.val()
  			},
  		  success: function(data) {
			  console.log(data[0]);
			  displayLatestAnnouncement(data[0]);
  		  },
  		  error: function(e) {
  			//console.log(e.message);
  		  }
  		});	
	 }
	 
	 function getUserDirectory(){
		 console.log("Sending Ajax request to server...");
  		
 		$.ajax({
 			dataType: "json",
 		  url: '/users/online',
 		  type: 'GET',
 			data: {
       //  appID: $inputAppID.val()
 			},
 		  success: function(data) {
 				displayUserDirectory(data);
 		  },
 		  error: function(e) {
 			//console.log(e.message);
 		  }
 		});	
	 }
	 
	 
	 function getChatHistory(){
		 console.log("Sending Ajax request to server...");
  		
 		$.ajax({
 			dataType: "json",
 		  url: '/messages',
 		  type: 'GET',
 			data: {
       //  appID: $inputAppID.val()
 			},
 		  success: function(data) {
 				loadChatHistory(data);
 		  },
 		  error: function(e) {
 			//console.log(e.message);
 		  }
 		});	
	 }
	 
	 function getPrivChatHistory(element){
		 console.log("Sending Ajax PrivChatHistory...");
		 console.log(element);
		 //$("#PrivWindow").attr("title", element);
		 //$( "#PrivWindow" ).dialog();
		 //$("#PrivWindow").attr("title", element);
		 //$("#targetName").text(element);
		 		 
 		$.ajax({
 			dataType: "json",
 		  url: '/privatechats',
 		  type: 'GET',
 			data: {
       //  appID: $inputAppID.val()
 			chatauthor:current_user,
 		chattarget: element
 			},
 		  success: function(data) {
 			  console.log('SuccessPrivateJson');
 			  console.log(JSON.stringify(data));
 			 loadPrivChatHistory(data);
 		  },
 		  error: function(e) {
 			//console.log(e.message);
 		  }
 		});
 		
	 }
	 
	 window.privateChatWindow = function (element){
		 console.log("Sending  PrivChatWindow...");
		 console.log(element);
		 replace('public_wall','private_room');
		 //data = {chatauthor:current_user,
		 	//		chattarget: element
	 			//}
		 //getPrivChatHistory();
		 //loadPrivChatHistory(data); 
		 getPrivChatHistory(element);
		 target_user = element;
	 }
	 
	 function displayUserDirectory(users){
		 
		 $('#user_list').empty();
		 var users_online = users.online;
		 $('#current_status').removeClass().addClass(status_logo[users_online[current_user]]);
		 delete users_online[current_user];
		 $.each(users_online, function(index, element) {
			 var statusLogo = getUserStatus(element.status_id); 
			// var item = "<a id =\"\""+index+" href=\"#\" style=\"color: #62615f;\"  onclick=\"privateChatWindow(\''+index+'\')\";><span class="statuslogo">'+statusLogo+"</span>"+index+"</a>";
		 		
	 		 var item = "<a id =\""+index+"\" href=\"/chat/"+index+"\" style=\"color: #62615f;\"><span class=\"statuslogo\">"+statusLogo+"</span>"+index+"</a>";
		 		$('#user_list').append("<li id='targetName'>"+item+"</li>");
		 		
	 	});
	 $.each(users.offline, function(index, element) {
		 var statusLogo = getUserStatus(element.status_id); 
		 
		 var item = " <a id =\""+index+"\" href=\"/chat/"+index+"\" style=\"color: #a7a6a4;\"><span class=\"statuslogo\">"+statusLogo+"</span>"+index+"</a>";
	 	$('#user_list').append("<li>"+item+"</li>");
 	});
	 }
 
	 function getUserStatus(num){ 
		 
	      if(num===1){
	        statusLogo = "<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";
	      }
	      else if (num===2){
	        statusLogo = "<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";
		
	 		}
	      else if (num===3){
	        statusLogo = "<span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";
			 
	      }
	      else{
	        statusLogo = "<span class=\"glyphicon glyphicon-question-sign\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";

	      }
	 		 return statusLogo;
	 	 }
  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    console.log('received chathist')
    loadChatHistory(data);
  });



//Emits event for Private Chat
  socket.on('private chat', function (data) {
    console.log("PRIVATE MSG RECEIVED ON CLIENT!");
    console.log(data);
	    addPrivChatMessage(data);
	  });
   
  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    console.log("new message need to be appended!");
    addChatMessage(data);
  });

  //emit message to server when user click submit
  $('#submitMessage').on('click', function(){
    if($('.inputMessage').val() !== ''){
      console.log('emitting chat...');
        socket.emit('new message', {
          chatauthor: $('#user').text(),
          location: $('#location').text(),
          status: parseInt($('#status').text(),10),
          timestamp: new Date().toLocaleTimeString(),
          chatmessage: $('.inputMessage').val()
        });
        $('.inputMessage').val('');
      }
    });

  //emit message to server when user does private chat 
  $('#privSubmitMessage').on('click', function(){
    if($('.privInputMessage').val() !== ''){
      console.log('emitting private chat...');
      var abc = $('#targetName').text();
      console.log(abc);
      abc = $('.privInputMessage').val();
      console.log(abc);
			var data = {
				chatauthor: current_user,
				chatmessage: $('.privInputMessage').val(),
				createdAt: new Date()
			}
			console.log("--- The data to append on my side is: "+data);
      addPrivChatMessage(data);
      socket.emit('PrivateChatMsg', {
          chatauthor: current_user,
          chattarget: $('#targetName').text(),
          chatmessage: $('.privInputMessage').val(),
          timestamp: new Date().toLocaleTimeString()
        });
    //Setting username for Private Chat  
      socket.emit('setUsername', {
    	  chatauthor: current_user,
    	  chattarget: $('#targetName').text(),
    	  });
        $('.privInputMessage').val('');
      }
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
	
  socket.on('new annoucement', function (data) {
		
    console.log(data.content);
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
  
  
  
  socket.on('new status', function (data) {
		
    console.log(data.statusid);
    if(data.username == current_user){
		$('#current_status').removeClass().addClass(status_logo[data.statusid]);
    
	}
	$('#'+data.username+" .statuslogo").empty().append(getUserStatus(data.statusid));
	
  });
  
 
  
  
	function dateForamt(date){
		var d = new Date(date);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = d.getDate() + " " + month[d.getMonth()] + ", " +  d.getFullYear();
    var time = d.toLocaleTimeString().toLowerCase();
    return (date + " at " + time); 
	}
  
  function displayLatestAnnouncement(data){
		
		$('#new_announce_post').empty();
  	var post = "<strong>"+data.content+"</strong>"+"   - posted by: "+data.publisher_username+" at "+dateForamt(data.createdAt);
  	$('#new_announce_post').append(post);
  	$('#announcement').show();
    if($('#postAnnouncementModal').length > 0){
    	$('.latest_announce_content').text(data.content);
			$('.latest_announce_publisher').text("by "+data.publisher_username+" at "+ dateForamt(data.createdAt));
    }
  }

	function loadChatHistory(data){
		data.forEach(function(msg){
			var chatContent = "<blockquote><p><span class=\"chat_author\">"+msg.chatauthor+": </span>"+	
							msg.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(msg.createdAt)+"</small></span></p></blockquote>";
			var item = "<li class=\"messages_item\">"+chatContent+"</li>";
			$('#messages').append(item);			
		});
			scrollListBtm();		
	}

	//Function to fetch private msgs
	function loadPrivChatHistory(data){
	data.forEach(function(msg){
		console.log("I am loading private chat history!!!!!!");
		console.log(msg);
		var chatContent = "<blockquote><p><span class=\"chat_author\">"+msg.chatauthor+": </span>"+	
						msg.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(msg.createdAt)+"</small></span></p></blockquote>";
	/*	var chatContent = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>"+msg.chatauthor+
									"<span style=\"float:right;\"><small>"+msg.timestamp+"</small></span></h4></div><div class=\"panel-body\">"+
									msg.chatmessage+"</div></div>";*/
		var item = "<li id=\"priv_messages_item\">"+chatContent+"</li>";
		$('#privMsgList').append(item);
		
	});
		scrollListBtm();		
}


	//Append Private msg list 
	  function addPrivChatMessage (data) {
		  console.log('I am in addPrivChatMessage Function');
		  console.log(data);
		    
					var chatContent = "<blockquote><p><span class=\"chat_author\">"+data.chatauthor+": </span>"+	
									data.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(data.createdAt)+"</small></span></p></blockquote>";					
									var item = "<li class=\"priv_messages_item\">"+chatContent+"</li>";
									$('#privMsgList').append(item);
									scrollListBtm();	
									

		  }
	
	
  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }
  // Adds the visual chat message to the message list
  function addChatMessage (data) {
    var options = options || {};
    var statusLogo;

    if(data.status===1){
      statusLogo = "<small style=\"padding-left:20px;\"><span class=\"glyphicon glyphicon-plus-sign\" style=\"color: red;\" aria-hidden=\"true\"></span> Emergency!</small>"
    }
    else if (data.status===2){
      statusLogo = "<small style=\"padding-left:20px;\"><span class=\"glyphicon glyphicon-exclamation-sign\" style=\"color: yellow;\" aria-hidden=\"true\"></span> Help!</small>"
    }
    else if (data.status===3){
      statusLogo = "<small style=\"padding-left:20px;\"><span class=\"glyphicon glyphicon-ok-sign\" style=\"color: green;\" aria-hidden=\"true\"></span> OK!</small>"
    }
    else{
      statusLogo = "<small style=\"padding-left:20px;\"><span class=\"glyphicon glyphicon-question-sign\" style=\"color: grey;\" aria-hidden=\"true\"></span> Status Unknown</small>"
    }
	
			var chatContent = "<blockquote><p><span class=\"chat_author\">"+data.chatauthor+": </span>"+	
							data.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(data.createdAt)+"</small></span></p></blockquote>";					
							var item = "<li class=\"messages_item\">"+chatContent+"</li>";
							$('#messages').append(item);
							scrollListBtm();				 
  }
 
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
   
});