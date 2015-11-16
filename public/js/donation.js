$(function() {

var catinvent = [];
var catselect = "0";
var typeselect = "0";


$(window).load(function(){
          console.log('load inventory page..call func');
          getInventory();
          console.log(catinvent);
 });


$("#resource-cat-opt").on('click', function(e){

	catselect = $(this).val();
	e.preventDefault();
	  
	$('#resource-type-opt').empty();
	typeselect = " ";
	$('#qty-avail span').empty();
	$('#qty-donate span').empty();
	$('#donate-amt').val(" ");

	  if (catselect!=0){
	  fetchResourceTypes();
	  }
});


$("#resource-type-opt").on('click', function(e){

	typeselect = $(this).val();
	e.preventDefault();
	  
	  if (typeselect!=0){
	  fetchQuantityUnit();
	  $('#donate-amt').val(" ");
	  }
	  else{
	  $('#qty-avail Span').empty();
	  $('#qty-donate span').empty();
	  $('#donate-amt').val(" ");
	  }
});




function getInventory(){
	console.log('get inventory');
	$.ajax({
		url: '/resources/catinventory',
		type: 'GET',
		success: function(catinventory) {
			catinvent = catinventory;
			loadCategories();
	    },
		error: function(e) {
		 	console.log('error fetching inventory');
		}

	})
}

function loadCategories(){
	var catOption = "<option value=\"0\">Choose Category</option>";
	
	$.each(catinvent, function(index, element){
		catOption = catOption + "<option value=\"" + element.id + "\">" + element.cat_description + "</option>"
	})

	console.log(catOption);
	$('#resource-cat-opt').append(catOption);

}


function fetchResourceTypes(){

	var typeOption = "<option value=\"0\">Choose Resource</option>";

	$.each(catinvent, function(index, element){

		if(element.id == catselect){

			$.each(element.resourcetypes, function(index, element){
				typeOption = typeOption + "<option value=\"" + element.id + "\">" + element.type_description + "</option>"
			})
		}
	})

	$('#resource-type-opt').append(typeOption);

}

function fetchQuantityUnit(){

	$.each(catinvent, function(index, element){

		if(element.id == catselect){

			$.each(element.resourcetypes, function(index, element){
				
				if(element.id == typeselect){

					var inventNum = (element.inventory ? element.inventory['quantity_inventory'] : 0);
					$('#qty-avail Span').text(inventNum);
					$('#qty-donate span').text(element.units);
				}
			})
		}
	})

}

})


function validateDonation(){

	console.log('testing validation');

	var err = " ";
	var intRegex = /^\d+$/;
	var donation = $('#donate-amt').val();
	var catselect = $("#resource-cat-opt").val();
	var typeselect = $("#resource-type-opt").val();


	if (catselect == 0 || typeselect == 0 || donation === " "){
		$('.err-msg').text('Resource Type and Donation Amount are mandatory fields');
		return false;
	}

	if (intRegex.test(donation)===false || donation <=0){
		$('.err-msg').text('Donation Amount must an integer greater than 0');
		return false;
	}

}