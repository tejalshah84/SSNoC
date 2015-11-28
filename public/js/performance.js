//-----------Measure Performance (I3)-------------------------------------------------------------


$(window).load(function() {
	loadRightBarMenu(1);
	$('#c-button--push-left').hide();
	$('#navtitle').text('Measure Performance').show();
	
});



var $test_duration = $('#test_duration');	
var timeFunc = '';
var startTime;
var numPOST_s = 0;
var numGET_s = 0;
var numOfReqest = {"GET": 0, "POST": 0 };
var responseGETTimeC,responsePOSTTimeC, responseGETTimeS, responsePOSTTimeS;
var terminate = false;


$('#start_testing_get').on('click', function(){	 
	restart();
	setTimeout(startUseCase_GET, 1);
});
 
$('#start_testing_post').on('click', function(){	 
	restart();
	setTimeout(startUseCase_POST, 1);
});
 
$('#stop_testing').on('click', function(){
	terminate = true;	 
	endUseCase();	 
});

$('#end_testing').on('click', function(){
	terminate = true;	 
	endUseCase();	 
});

function isTimeUp(duration){
	return ((new Date()-startTime) > duration);
}
 
function startUseCase_GET(){
	if(terminate){		 
		return;
	}
	sendGETReq();	
	responseGETTimeC = new Date();
	responseTimeC = new Date();
	var d1 = {
		"POST": 0, 
		"GET": (numOfReqest.GET/((responseGETTimeC-startTime)/1000))
	};		
	$('#get_req_num_c').text(numOfReqest.GET);
	$('#get_req_time_c').text(d1.GET);
	if(!isTimeUp($test_duration.val()*1000)){
		setTimeout(startUseCase_GET, 1);
	}
}
 
function startUseCase_POST(){
	if(terminate){		 
		return;
	}
	sendPOSTReq();	
	responsePOSTTimeC = new Date();
	responseTimeC = new Date();
	var d1 = {
		"POST": (numOfReqest.POST/((responsePOSTTimeC-startTime)/1000)), 
		"GET": 0
	};
	$('#post_req_num_c').text(numOfReqest.POST);
	$('#post_req_time_c').text(d1.POST);
	if(!isTimeUp($test_duration.val()*1000)){
		setTimeout(startUseCase_POST, 1);
	}
}
	

function endUseCase(){
	$.ajax({
		url: '/admin/end_testing',
		type: 'GET',
		success: function(data) {
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
			$('#get_req_time_s').text((numGET_s/((responseGETTimeS-startTime)/1000)));
			if(numGET_s == numOfReqest.GET){
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
			$('#post_req_time_s').text((numPOST_s/((responsePOSTTimeS-startTime)/1000)));
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
	terminate = false;
	updateRequestNumber('c',numOfReqest);
	updateRequestNumber('s',numOfReqest);
	updateRequestTime('c',numOfReqest);
	updateRequestTime('s',numOfReqest);
	console.log("restart...");
}
