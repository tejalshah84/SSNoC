//This file includes common functions

var status_arr = {'ok':3, 'help':2, 'emergency': 1, 'no_status': 4};
var status_logo = {3:'glyphicon glyphicon-ok-sign', 2:'glyphicon glyphicon-exclamation-sign', 1:'glyphicon glyphicon-plus-sign', 4: 'glyphicon glyphicon-question-sign'};
var status_desc = {4: 'No Status', 3:'OK!', 2:'Help!', 1:'Emergency!'};


//Retrieve Status Logo given status id
function getUserStatus(num){ 
	if(num===3){
	    statusLogo = "<span class=\"" + status_logo[3]+ "\" aria-hidden=\"true\" style=\"color:green;padding-right:10px;\"></span>";
	}
	else if (num===2){
	     statusLogo = "<span class=\"" + status_logo[2]+ "\" aria-hidden=\"true\" style=\"color:yellow;padding-right:10px;\"></span>";
	}
	else if (num===1){
	    statusLogo = "<span class=\"" + status_logo[1]+ "\" aria-hidden=\"true\" style=\"color:red;padding-right:10px;\"></span>";			 
	}
	else{
	    statusLogo = "<span class=\"" + status_logo[4]+ "\" aria-hidden=\"true\" style=\"color:grey;padding-right:10px;\"></span>";
	}
	return statusLogo;
}


//Format Date Function
function dateForamt(date){
	var d = new Date(date);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = d.getDate() + " " + month[d.getMonth()] + ", " +  d.getFullYear();
    var time = d.toLocaleTimeString().toLowerCase();
    return (date + " at " + time); 
}






