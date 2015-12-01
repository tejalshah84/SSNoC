
//Signup validation function
function validateSignup(){
	if ($('#uname').val() == null || $('#uname').val() == "" || !/\S/.test($('#uname').val())) { 
		alert("Please enter your username");
		$('#uname').focus();
		return false; 
	}
	
	if ($('#uname').val().length < 3) { 
		alert("The username must be 3 characters or longer");
		$('#uname').focus();
		return false; 
	}
	
	if(!$('#uname').val().match(/^[a-zA-Z0-9]+$/)){
		alert("Please enter valid username. Username can not contain symbols");
		$('#uname').focus();
		return false; 
	}

	if ($('#p').val() == null || $('#p').val() == "" || !/\S/.test($('#p').val())) { 
		alert("Password can not be blank, please enter password");
		$('#p').focus();
		return false; 
	}
	
	if ($('#p').val().length < 4) { 
		alert("The password must be 4 characters or longer");
		$('#p').focus();
		return false; 
	}
	if ($('#p').val() != $('#cp').val()) { 
		alert("Your password and confirmation password do not match.");
		$('#cp').focus();
		return false; 
	}
}

//Signin validation function
function validateSignin(){
	if ($('#uname').val() == null || $('#uname').val() == "" || !/\S/.test($('#uname').val())) { 
		alert("Please enter your username");
		$('#uname').focus();
		return false; 
	}

	if ($('#pword').val() == null || $('#pword').val() == "" || !/\S/.test($('#pword').val())) { 
		alert("Please enter your password");
		$('#pword').focus();
		return false; 
	}
}
