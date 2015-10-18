$(function() {
  // Initialize varibles
  var $window = $(window);
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box
  var connected = false;
  var current_user = $('#current_user').text();

  var socket = io();
	console.log("-- Loading main.js --");
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
	
 $('.post_announcement').on('click', function(){
	 //console.log("Sending Ajax request to server...");
 		
     if($('.new_announcement_content').val() !== ''){
       //console.log('emitting socket for annoucement...');
         socket.emit('new announcement', {
           publisher_username: current_user,
			 		content: $('.new_announcement_content').val(),
           createdAt: new Date()
         });
	 }
         $('.new_announcement_content').val('');
			
 });
	
	
	$(window).load(function() {
		getChatHistory();
		getUserDirectory();
		
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
			  //console.log(data[0]);
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
 		  url: '/messages/wall',
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
	 
	 window.getPrivChatHistory = function (element){
		 console.log("Sending Ajax PrivChatHistory...");
		 console.log(element);
		 $("#PrivWindow").attr("title", element);
		 $( "#PrivWindow" ).dialog();
		 //$("#PrivWindow").attr("title", element);
		 $("#targetName").text(element);
		 		 
 		$.ajax({
 			dataType: "json",
 		  url: '/messages/room',
 		  type: 'GET',
 			data: {
       //  appID: $inputAppID.val()
 				chatauthor:current_user,
 				chattarget: element
 			},
 		  success: function(data) {
 				//loadPrivChatHistory(data);
 			  console.log('SuccessPrivateJson');
 			  console.log(JSON.stringify(data));
 		  },
 		  error: function(e) {
 			//console.log(e.message);
 		  }
 		});
 		
	 }
 
	 function displayUserDirectory(users){
		 $('#user_list').empty();
		 var users_online = users.online;
		 delete users_online[current_user];
		 $.each(users_online, function(index, element) {
			 var statusLogo = getUserStatus(element); 
			 var item = '<a href="#" style="color: #62615f;" onclick="getPrivChatHistory(\''+element+'\')";>'+statusLogo+element+"</a>";
		 		$('#user_list').append("<li>"+item+"</li>");			 		
		 });
	 $.each(users.offline, function(index, element) {
		 var statusLogo = getUserStatus(element); 
		 var item = " <a href=\"#\" style=\"color: #a7a6a4;\">"+statusLogo+element+"</a>"
	 	$('#user_list').append("<li>"+item+"</li>");
 	});
	 }
  
	 //window.chatPriv = function (){
		 //$( "#PrivWindow" ).dialog();
		// getPrivChatHistory(); 
	 //}
	 	 
	 
	 function getUserStatus(data){
		 var statusLogo = "<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";
		 
		 /*
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
     }*/
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
    //console.log('received chathist')
    loadChatHistory(data);
  });
  
  
  socket.emit('setUsername', {
  chatauthor: current_user
  });

  socket.on('PrivateChatMsg', function (data) {
	    //console.log("new message need to be appended!");
	    addPrivChatMessage(data);
	  });
  
  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    //console.log("new message need to be appended!");
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
          chattype: "wall",
          chatmessage: $('.inputMessage').val()
        });
        $('.inputMessage').val('');
      }
    });


  //emit messages for private chats
  $('#privChatSend').on('click', function(){
	    if($('#privTextMsg').val() !== ''){
	      console.log('emitting Private chat...');
	        socket.emit('PrivateChatMsg', {
	          chatauthor: current_user,
	          chattarget: $('#targetName').text(),
	          chattype: "room",
	          chatmessage: $('#privTextMsg').val(),
	          timestamp: new Date().toLocaleTimeString()
	        });
	        $('#privTextMsg').val('');
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
		
  //  console.log(data.content);
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
			//console.log(msg);
			var chatContent = "<blockquote><p><span class=\"chat_author\">"+msg.chatauthor+": </span>"+	
							msg.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(msg.createdAt)+"</small></span></p></blockquote>";
		/*	var chatContent = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>"+msg.chatauthor+
										"<span style=\"float:right;\"><small>"+msg.timestamp+"</small></span></h4></div><div class=\"panel-body\">"+
										msg.chatmessage+"</div></div>";*/
			var item = "<li class=\"messages_item\">"+chatContent+"</li>";
			$('#messages').append(item);
			
		});
			scrollListBtm();		
	}

	//Function to fetch private msgs
	function loadPrivChatHistory(data){
	data.forEach(function(msg){
		//console.log(msg);
		var chatContent = "<blockquote><p><span class=\"chat_author\">"+msg.chatauthor+": </span>"+	
						msg.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(msg.createdAt)+"</small></span></p></blockquote>";
	/*	var chatContent = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>"+msg.chatauthor+
									"<span style=\"float:right;\"><small>"+msg.timestamp+"</small></span></h4></div><div class=\"panel-body\">"+
									msg.chatmessage+"</div></div>";*/
		var item = "<li class=\"messages_item\">"+chatContent+"</li>";
		$('#privMsgList').append(item);
		
	});
		scrollListBtm();		
}
	
	
	
  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }
  
  function addPrivChatMessage (data) {
	    
				var chatContent = "<blockquote><p><span class=\"chat_author\">"+data.chatauthor+": </span>"+	
								data.chatmessage+"<span class=\"chat_timestamp\"><small>"+dateForamt(data.createdAt)+"</small></span></p></blockquote>";					
								var item = "<li class=\"messages_item\">"+chatContent+"</li>";
								$('#privMsgList').append(item);
								scrollListBtm();				 
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
		var last_li = $("#messages li:last-child").offset().top;
		$("#public_messages").animate({
		    scrollTop: last_li
		  }, 1000);
	}
 
  
});