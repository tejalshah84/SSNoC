$(function() {


$(window).load(function(){
          console.log('load inventory page..call func');
          getInventory();
 });



function getInventory(){
	console.log('get inventory');
	$.ajax({
		url: '/resources/catinventory',
		type: 'GET',
		success: function(catinventory) {
			$.ajax({
				url: '/resources/reserved',
				type: 'GET',
				success: function(reserve) {
					displayInventory(catinventory, reserve);
	     	},
				 error: function(e) {
				 console.log('error fetching reserve');
			}

			})
	    },
		error: function(e) {
		 	console.log('error fetching inventory');
		}

	})
}



function displayInventory(cattype, reserve){


	$.each(cattype, function(index, element){

		var rtype = makeTableRows(element.resourcetypes, reserve);

		if (element.id===1){
				$('#medical-inventory').append(rtype);

		}
		else if (element.id===2){
				$('#food-inventory').append(rtype);
		}
	})

}

function makeTableRows(rtype, reserve){

	var table = "";
	
	$.each(rtype, function (index, element){

		var resrcType = "<td> " + element.type_description + " </td>"
		var inventoryNum = "<td> " + (element.inventory ? element.inventory['quantity_inventory'] : 0) + " </td>";
		var reservedNum = parseReserved(element.id, reserve);
		var unit = "<td> " + element.units + " </td>"

		table = table + "<tr value=\""+ element.id + "\">" + resrcType + inventoryNum + reservedNum + unit + "</tr>"

	})

	return table;
} 


function parseReserved(idnum, ReservedArr){

	var num = 0;

	$.each(ReservedArr, function(index, element){

		if (element.id === idnum){
			num = (element.quantity_reserved ? element.quantity_reserved : 0);
		}
		
	})

	return "<td>" + num + "</td>";
}


})