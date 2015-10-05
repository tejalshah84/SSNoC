$(function() {
  

  // Initialize varibles
  var $window = $(window);
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

	
  // Prompt for setting a username
  var username;
  var connected = false;
 // var $currentInput = $usernameInput.focus();

  var socket = io();
	console.log("here????");
  
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
	
	

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  
  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Chatroom! ";
    log(message, {
      prepend: true
    });
		loadChatHistory(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
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
		data.msgHistory.forEach(function(msg){
			var chatContent = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>"+msg.userName+
										"span style=\"float:right;\"><small>"+msg.createdAt+"/small></span></h4></div><div class=\"panel-body\">"+
										msg.chatContent+"</div></div>";
			var item = "<li>"+chatContent+"</li>";
			$('#messages').append(item);
		});
	}
  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }
  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }
  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {

	 var timestamp = new Date().toISOString();
	 var $chatContent = "<div class=\"panel panel-default\"><div class=\"panel-heading\"><h4>"+data.username+
							"span style=\"float:right;\"><small>"+timestamp+"/small></span></h4></div><div class=\"panel-body\">"+
							data.message+"</div></div>";
    addMessageElement($chatContent, options);
 
  }
  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
		$("body").animate({ scrollTop: $messages[0].scrollHeight }, "slow");
  }
  
});