function setHeightCrossDomainIframe(){
	var defaultCSS = document.getElementById('bootstrap-css');
	function changeCSS(css){
		if(css) $('head > link').filter(':first').replaceWith('<link rel="stylesheet" href="'+ css +'" type="text/css" />'); 
		else $('head > link').filter(':first').replaceWith(defaultCSS); 
	}
	$( document ).ready(function() {
		var iframe_height = parseInt($('html').height()); 
		window.parent.postMessage( iframe_height, 'http://bootsnipp.com');
	});
}

function validateSignup(){
	//alert($('#uname').val());
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


	if ($('#p').val() != $('#cp').val()) { 
		alert("Your password and confirmation password do not match.");
		$('#cp').focus();
		return false; 
	}
}