$(function() {

var userid = localStorage.getItem('userinfo'),
pickedmyreq = {"N": "<td><span class=\"glyphicon glyphicon-remove-circle\" style=\"color:orange\";></span></td>",
				"Y": "<td><span class=\"glyphicon glyphicon-ok-circle\" style=\"color:green\";></span></td>",
				"X": "<td><span class=\"glyphicon glyphicon-ban-circle\" style=\"color:red\";></span></td>"};

console.log(userid);

$(window).load(function(){
          console.log('load requests page..call func');
          getMyRequests();
 });




function getMyRequests(){
	console.log('get requests');
	$.ajax({
		url: '/requests/myrequests/'+ userid,
		type: 'GET',
		success: function(requests) {

			console.log(requests);
			displayMyRequests(requests);
	    },
		error: function(e) {
		 	console.log('error fetching my requests');
		}

	})
}

function displayMyRequests(requests){

	console.log('displayRequests');

	$.each(requests, function(index, element){

		var catshortcut = element.resourcetype.resourcecategory.id;

		var rtype = makeRequestRows(element);

		if (catshortcut===1){
				$('.medical-requests').append(rtype);

		}
		else if (catshortcut===2){
				$('.food-requests').append(rtype);
		}
	})

}

function makeRequestRows(element){

	var row = "";
		
		var picked = pickedmyreq[element.pickedup_ind];
		console.log(picked);
		var resrcType = "<td> " + element.resourcetype.type_description + " </td>";
		var quantreq = "<td> " + element.quantity_requested + " (" + element.resourcetype.units + ") </td>";
		var reqdate = element.requested_date ? "<td> " + element.requested_date + " </td>" : "<td></td>";
		var pickdate = element.pickedup_date ? "<td> " + element.pickedup_date + " </td>" : "<td></td>";

		console.log(reqdate);
		console.log(pickdate);


		row = "<tr value=\""+ element.id + "\">" + picked + resrcType + quantreq + reqdate + pickdate +"</tr>"

	return row;
} 





})