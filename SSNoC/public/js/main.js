$(function() {
  // Initialize varibles
  var $window = $(window);
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box
  var connected = false;

  var socket = io();
	console.log("-- Loading main.js --");
  
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
	

	function loadChatHistory (data){
		data.chatHistory.forEach(function(msg){
			var chatContent = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>"+msg.chatauthor+
										"<span style=\"float:right;\"><small>"+msg.timestamp+"</small></span></h4></div><div class=\"panel-body\">"+
										msg.chatmessage+"</div></div>";
			var item = "<li>"+chatContent+"</li>";
			$('#messages').append(item);
		});
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

		var $chatContent = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>"+data.chatauthor+
							"<small style=\"padding-left:20px;\"><span class=\"glyphicon glyphicon-map-marker\" ></span>"+data.location+"</small>"+
              statusLogo + 
							"<span style=\"float:right;\"><small>"+data.timestamp+"</small></span></h4></div><div class=\"panel-body\">"+
							data.chatmessage+"</div></div>";
  	var $messageDiv = $('<li class="message"/>')
    .append($chatContent);
		addMessageElement($messageDiv,options);
 
  }
  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
		
    var $el = $(el);
    $messages.append($el);
    $messages[0].scrollTop = $messages[0].scrollHeight;
		//$("body").animate({ scrollTop: $messages[0].scrollHeight }, "slow");
  }
  
});