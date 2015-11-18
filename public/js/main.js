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
	
	// --------------- Iteration 3 -----------------------//
	var $test_duration = $('#test_duration');	
	var startTime;
	var numPOST_s = 0;
	var numGET_s = 0;
	var numOfReqest = {"GET": 0, "POST": 0 };
	var responseGETTimeC,responsePOSTTimeC, responseGETTimeS, responsePOSTTimeS;
	var test = true;

//------------Iteration 4 ---------------------//
	
	var isMobile = {
		    Android: function() {
		        return navigator.userAgent.match(/Android/i);
		    },
		    BlackBerry: function() {
		        return navigator.userAgent.match(/BlackBerry/i);
		    },
		    iOS: function() {
		        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		    },
		    Opera: function() {
		        return navigator.userAgent.match(/Opera Mini/i);
		    },
		    Windows: function() {
		        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
		    },
		    any: function() {
		        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		    }
		};
	
	
	
	
	
	
	
 $('#start_testing').on('click', function(){
	 console.log("Sending Ajax Start Testing...");	 
	 restart();
	 startUseCase();	 
 });
 
 
 $('#stop_testing').on('click', function(){
	 console.log("Stop sending Ajax Testing...");	 
	 endUseCase();	 
 });
 function isTimeUp(duration){
	 return ((new Date()-startTime) > duration);
 }
 function startUseCase(){
	 $.ajax({
		 url: '/admin/start_testing',
		 type: 'GET',
		 success: function(data) {
			console.log("Test db has been refreshed! Use Case Starts.");	 
			 while(test&&!isTimeUp($test_duration.val()/2*1000)){
				 sendPOSTReq();	
			 }
			 responsePOSTTimeC = new Date();
			 while(test&&!isTimeUp($test_duration.val()*1000)){
			 	sendGETReq();	
			 }		 
			 responseGETTimeC = new Date();
			 responseTimeC = new Date();
			 test = false;
			 console.log("Time is up!");	
			 var d1 = {
				 "POST": Math.round((numOfReqest.POST/((responsePOSTTimeC-startTime)/1000))), 
				 "GET": Math.round((numOfReqest.GET/((responseGETTimeC-startTime)/2/1000)))
			 };
			 updateRequestNumber('c',numOfReqest);
			 updateRequestTime('c',d1);		
			 //endUseCase();
		 },
		 error: function(e) {
		 }
		});	
 }
	
	
 function endUseCase(){
	 $.ajax({
		 url: '/admin/end_testing',
		 type: 'GET',
		 success: function(data) {
			 var d2 = {
				 "POST": Math.round((numOfReqest.POST/((responsePOSTTimeS-startTime)/1000))), 
				 "GET": Math.round((numOfReqest.GET/((responseGETTimeS-startTime)/2/1000)))
			 };		 
			 updateRequestTime('s',d2);	
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
			 if(numGET_s == numOfReqest.GET){
			 	endUseCase();
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
	test = true;
	updateRequestNumber('c',numOfReqest);
	updateRequestNumber('s',numOfReqest);
	updateRequestTime('c',numOfReqest);
	updateRequestTime('s',numOfReqest);
 }
// --------------- Iteration 3 -----------------------//


  
	//console log when click status
	$('.status_list').on('click', 'li', function(event) {
		var button = $(event.target);
		console.log("status menu selected: " + $(this).attr('id')+current_user);
		var statusid = status_arr[$(this).attr('id')];
		socket.emit('change status', {
		      userid: current_user,
		 			status_id: statusid
		});	
	});	


	$('.post_announcement').on('click', function(){
		console.log("Sending Ajax request to server...");
    if($('.new_announcement_content').val() !== ''){
    	console.log('emitting socket for annoucement...');
      socket.emit('new announcement', {
      	publisher_userid: current_user,
			 	content: $('.new_announcement_content').val(),
        createdAt: new Date()
      });
	 	}
    $('.new_announcement_content').val('');
 });

	
	
	$(window).load(function() {
		
		if($("#private_messages").length > 0){
			scrollListBtm();	
		}
		getUserDirectory();
    socket.emit('setUserSocketID', {
        userid: current_user
    });
		retrieveLatestAnnouncement();
		
		socket.emit('emergency status', {
		      userid: current_user
		});
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
  			data: {},
  		  success: function(data) {
			  displayLatestAnnouncement(data);
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
 				data: {},
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
			 data: {},
			 success: function(data) {
 				loadChatHistory(data);
			 },
			 error: function(e) {
 		  }
 		});	
	 }
	 
	 function getPrivChatHistory(element){
		 console.log("Sending Ajax PrivChatHistory..."); 		 
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
	 
	 function displayUserDirectory(users){
		 console.log(users.offline);
		 $('#user_list').empty();
		 var users_online = users.online;
		 $('#current_status').removeClass().addClass(status_logo[users_online[current_user].status_id]);
		 delete users_online[current_user];
		 $.each(users_online, function(index, element) {
			 var statusLogo = getUserStatus(element.status_id); 
	 		 var item = "<a class = 'onusers' id =\""+index+"\" href=\"/chat/"+index+"\" style=\"color: #62615f;\"><span class=\"statuslogo\">"+statusLogo+"</span>"+element.username+"</a>";
		 		$('#user_list').append("<li id='targetName'>"+item+"</li>");	 		
			});
	 	 $.each(users.offline, function(index, element) {
		 	var statusLogo = getUserStatus(element.status_id); 
			var item = " <a id =\""+index+"\" href=\"/chat/"+index+"\" style=\"color: #a7a6a4;\"><span class=\"statuslogo\">"+statusLogo+"</span>"+element.username+"</a>";
			$('#user_list').append("<li>"+item+"</li>");
		});
	 }
 
	 function getUserStatus(num){ 
	      if(num===1){
	        statusLogo = "<span class=\"glyphicon glyphicon-ok-sign\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";
	      }else if (num===2){
	        statusLogo = "<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";
	 			}else if (num===3){
	        statusLogo = "<span class=\"glyphicon glyphicon-plus-sign\" aria-hidden=\"true\" style=\"padding-right:10px;\"></span>";			 
	      }else{
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
    loadChatHistory(data);
  });

	//Emits event for Private Chat
  socket.on('private chat', function (data) {
    console.log("Private Msg Received on client!");
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
          chatauthor_id: $('#user').text(),
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
    		var data = {
				chatauthor: $('#current_username').text(),
				chatmessage: $('.privInputMessage').val(),
				createdAt: new Date()
			}
			console.log("--- The data to append on my side is: "+data);
      addPrivChatMessage(data);
			console.log("current user: "+current_user+"   target: "+$('#targetUserName').text());
      socket.emit('PrivateChatMsg', {
          chatauthor_id: current_user,
          chattarget_id: $('#targetUserName').text(),
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
	
  socket.on('emergency user', function (data) {
	   var loggedUser = sessionStorage.getItem('ExistingUser');
	   console.log('Existing User');
	   console.log(data);
	  //var user=getCookie("uname");
	    //if (document.cookie == null || document.cookie == "") {
	  if (loggedUser != data.loguser) {
	    	$('#dialog').append("<p>"+data.username+" is in Emrgency. Please Help.</p>");
			$("#dialog" ).dialog();
			doBlink($("#dialog"),20);
			console.log('Existing User##');
			   console.log(data.userid);
			   $(".audioDemo").trigger('play');
			   $("#dialog").dialog('option', 'buttons', {
				"Contact Immediately" : function() {
	               // window.location.href = theHREF;
	            	window.location = '/chat/'+data.userid;
	            },
	            "Ignore" : function() {
	            	window.location.reload();
	            	//$('.audioDemo').trigger('pause');
	            $(this).dialog("close");
	            	
	            }
	        });
			if( isMobile.any() ) {$("#wrapper").toggleClass("toggled");}
			
			
			sessionStorage.setItem('ExistingUser', data.loguser);
	    } else {
	    	console.log('Already prompted user');
			
	    }
	  
		});
  
  
  
 
  socket.on('new status', function (data) {	
    console.log(data.statusid);
    if(data.userid == current_user){
			$('#current_status').removeClass().addClass(status_logo[data.statusid]);    
		}
		//$('#'+data.userid+" .statuslogo").empty().append(getUserStatus(data.statusid));
		
		if(data.userid != current_user && data.statusid == 3){
			console.log('User is in emergency');
			console.log(data);
			$('#'+data.userid+" .statuslogo").empty().append(getUserStatus(data.statusid));
			$('#dialog').append("<p>"+data.username+" is in Emrgency. Please Help.</p>");
			$("#dialog" ).dialog();
			doBlink($("#dialog"),20);
		/*	$("#dialog").dialog({
			    close: function () {
			        window.location = '/chat/'+data.userid;
			    }
			});*/
			
			$("#dialog").dialog('option', 'buttons', {
				"Contact Immediately" : function() {
	               // window.location.href = theHREF;
	            	window.location = '/chat/'+data.userid;
	            },
	            "Ignore" : function() {
	            	window.location.reload();
	            	//$('.audioDemo').trigger('pause');
	                $(this).dialog("close");
	            }
	        });
			
			 //if(typeof window.orientation !== 'undefined'){$("#wrapper").toggleClass("toggled");}
			if( isMobile.any() ) {$("#wrapper").toggleClass("toggled");}
			 //if ($("#wrapper").is(":visible") == false){ $("#wrapper").toggleClass("toggled");}
		//doBlink($('#targetName'),10);
		//	doBlink($("#"+data.userid+".onusers"),20);
			$(".audioDemo").trigger('play');
			
		}else if (data.userid != current_user && data.statusid == 2){
			console.log('User needs help');
			$('#'+data.userid+" .statuslogo").empty().append(getUserStatus(data.statusid));
			//doMildBlink($('#targetName'),20);
			if( isMobile.any() ) {$("#wrapper").toggleClass("toggled");}
			doMildBlink($("#"+data.userid+".onusers"),20);
			$(".audioMildDemo").trigger('play');
		}else {
			$('#'+data.userid+" .statuslogo").empty().append(getUserStatus(data.statusid));
		}
  });
  
  
  function doBlink(id, count) {  
	    $(id).animate({ backgroundColor: "#ff6666" }, {
	        duration: 100, 
	        complete: function() {

	            // reset
	            $(id).delay(100).animate({ backgroundColor: "#f0eeef" }, {
	                duration: 100,
	                complete: function() {

	                    // maybe call next round
	                    if(count > 1) {
	                        doBlink(id, --count);
	                    }
	                }
	            });

	        }
	    });	    
	}
  
  function doMildBlink(id, count) {  
	    $(id).animate({ backgroundColor: "#ffad33" }, {
	        duration: 100, 
	        complete: function() {

	            // reset
	            $(id).delay(100).animate({ backgroundColor: "#f0eeef" }, {
	                duration: 100,
	                complete: function() {

	                    // maybe call next round
	                    if(count > 1) {
	                    	doMildBlink(id, --count);
	                    }
	                }
	            });

	        }
	    });	    
	}
   
	function dateForamt(date){
		var d = new Date(date);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = d.getDate() + " " + month[d.getMonth()] + ", " +  d.getFullYear();
    var time = d.toLocaleTimeString().toLowerCase();
    return (date + " at " + time); 
	}
  
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
			
			//updating userdir with msg badge
			var $badge = $("#"+data.chatauthor_id+" .badge");
			console.log($badge.length); 
			if($("#"+data.chatauthor_id+" .badge").length > 0){
				$("#"+data.chatauthor_id+" .badge").text(incrementNumMsg($("#"+data.chatauthor_id+" .badge")));
			}else{
				var msgNotification = "<span class=\"badge\">"+1+"</span>";
				//var msgNotification = '<button class="btn btn-default btn-lg btn-link" style="font-size:20px;"><span class="glyphicon glyphicon-comment"></span></button><span class="badge badge-notify">'+1+'</span>';
				$("#"+data.chatauthor_id).append(msgNotification);			
			}		
			
				
			
		}

		function incrementNumMsg(badge){
			return parseInt(badge.text())+1;	
		}	
  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }
  // Adds the visual chat message to the message list
  function addChatMessage (data) {
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