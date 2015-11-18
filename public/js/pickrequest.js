$(function() {


$(window).load(function(){
          console.log('load requests picked page..call func');
          getPendingRequests();
 });





function getPendingRequests(){

	$.ajax({
		url: '/requests/pendingrequests',
		type: 'GET',
		success: function(requests) {
			console.log(requests);
			displayAllRequests(requests);
	    },
		error: function(e) {
		 	console.log('error fetching requests');
		}

	})

}


function displayAllRequests(requests){

	console.log('displayRequests');

	$.each(requests, function(index, element){

		var catshortcut = element.resourcetype.resourcecategory.id;

		var rtype = makeAllRequestRows(element);		


		if (catshortcut==1){
				$('.medical-requests').append(rtype);

		}
		else if (catshortcut==2){
				$('.food-requests').append(rtype);
		
		}
	})

}

function makeAllRequestRows(element){

	var row = "";
		
		var picked = "<td><input class=\"pickcheck\" type=\"checkbox\" value=\""+ element.id + "\"/></td>"
		var resrcType = "<td> " + element.resourcetype.type_description + " </td>";
		var quantreq = "<td> " + element.quantity_requested + " (" + element.resourcetype.units + ") </td>";
		var reqby = "<td value=\""+ element.requestby.id + "\"> " + element.requestby.username + " </td>";
		var reqdate = element.requested_date ? "<td> " + element.requested_date + " </td>" : "<td></td>";
		var cancel = "<td> </td>";


		row = "<tr class=\"pickrow\" value=\""+ element.id + "\">" + picked + resrcType + quantreq + reqby + reqdate +"</tr>"

		console.log(row);

	return row;
} 


})


function picked(){

	sendUpdates("Y");
}


function cancelled() {

	sendUpdates("X");
}


function getChecked(){

	var updateList=[];

	$('.medical-requests input:checkbox:checked').each(function(){
    updateList.push($(this).attr('value'));
    console.log(updateList);
	});

	$('.food-requests input:checkbox:checked').each(function(){
    updateList.push($(this).attr('value'));
    console.log(updateList);
	});

	return updateList;

}


function sendUpdates(flag){

	var arr = getChecked();
	var userid = localStorage.getItem('userinfo');

	console.log(arr);
	console.log(userid);
	console.log(flag);

	if (arr.length==0){
		$('.err-msg').text('No requests have been selected for update');

	}
	else{
	$.ajax({
		url: '/requests/updatepicked',
		type: 'POST',
		data: {
			pickfrom: userid,
			pickdate: new Date().toLocaleString(),
			pickind: flag,
			list: arr
		},
		success: function() {
			location.href="/requestapproval"
	    },
		error: function(e) {
		 	console.log('error fetching requests');
		}

	})
	}


}