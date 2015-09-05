var socket = io();
var re_user;
var re_msg;
var re_tstamp;
var d	= new Date();
var ctime = (d.getMonth()+1)+"-"+(d.getDate())+"-"+d.getFullYear()+
" "+(d.getHours())+":"+(d.getMinutes())+":"+(d.getSeconds());


//History message retrieval
function dbMessages(){
	socket.emit('retrieveMessage','Data');	
	socket.on('oldMessages',function(data){
		var msglist = data.split("~");
		re_user = msglist[0];
		re_msg = msglist[1];
		re_tstamp = msglist[2];		
		$('#archive_messages').append('<li><b style="color:black">' + re_user + '</b>:<b style="float: right; font-size:60%; font-family:verdana">'+ re_tstamp +'&ensp;</b><br>'+ re_msg +'</li>');
	});	
}

//User left chat room notification
function logout(){
	var name = sessionStorage.getItem("username");
	socket.emit('chatMessage', 'User', '<b>' + name + '</b> has left the chatroom',ctime);    
}

//submitting chat messages typed by user and emiting 'chatMessage' event on click of 'send'
function submitfunction(){
	var from = sessionStorage.getItem("username");
	var message = $('#m').val();
	message = message.replace(/\r?\n/g, '<br />');
	if(message != '') {
		socket.emit('chatMessage', from, message,ctime);
	}
	$('#m').val('').focus();
	return false;
}
//Emit event for user typing 
function notifyTyping() {
	var user = sessionStorage.getItem("username");
	socket.emit('notifyUser', user);
}
//appending messages to unordered list of message block
socket.on('chatMessage', function(from, msg,ctime){
	var me = sessionStorage.getItem("username");
	var color = (from == me) ? 'green' : '#009afd';
	var from = (from == me) ? 'Me' : from;
	if(ctime != null){
		$('#messages').append('<li><b style="color:' + color + '">' + from + '</b>:<b style="float: right; font-size:60%; font-family:verdana">'+ ctime +'&ensp;</b><br>'+ msg +'</li>');
	} else {
		$('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
	}
});

//user typing notification
socket.on('notifyUser', function(user){
	var me = sessionStorage.getItem("username");
	if(user != me) {
		$('#notifyUser').text(user + ' is typing ...');
	}
	setTimeout(function(){ $('#notifyUser').text(''); }, 10000);
});

$(document).ready(function(){
	var name = sessionStorage.getItem("username");
	if (name != null) {
		socket.emit('chatMessage', 'User', '<b>' + name + '</b> has joined the discussion',ctime);
	}
//	Allows 'Return : Keycode = 13' button to submit the chat Message on click of Enter (If Input type is text it's not required but for textarea it allows multiple line input)
	$('textarea').bind('keypress', function(e) {
		if ((e.keyCode || e.which) == 13) {
			$(this).parents('form').submit();
			return false;
		}
	});	  
});