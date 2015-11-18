$(function() {

var catinvent = [];
var catselect = "0";
var typeselect = "0";
var requser = localStorage.getItem('userinfo');

$(window).load(function(){
          console.log('load inventory page..call func');
          $('#requser').val(requser);
          getInventory();
          console.log(catinvent);
 });


$(".resource-cat-opt").on('click', function(e){

	catselect = $(this).val();
	e.preventDefault();
	  
	$('.resource-type-opt').empty();
	typeselect = " ";
	$('.qty-avail span').empty();
	$('.qty span').empty();
	$('.qty-amt').val(" ");

	  if (catselect!=0){
	  fetchResourceTypes();
	  }
});


$(".resource-type-opt").on('click', function(e){

	typeselect = $(this).val();
	e.preventDefault();
	  
	  if (typeselect!=0){
	  fetchQuantityUnit();
	  $('.qty-amt').val(" ");
	  }
	  else{
	  $('.qty-avail Span').empty();
	  $('.qty span').empty();
	  $('.qty-amt').val(" ");
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
	$('.resource-cat-opt').append(catOption);

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

	$('.resource-type-opt').append(typeOption);

}

function fetchQuantityUnit(){

	$.each(catinvent, function(index, element){

		if(element.id == catselect){

			$.each(element.resourcetypes, function(index, element){
				
				if(element.id == typeselect){

					var inventNum = (element.inventory ? element.inventory['quantity_inventory'] : 0);
					$('.qty-avail Span').text(inventNum);
					$('.qty span').text(element.units);
				}
			})
		}
	})

}

})


function validateDonation(){

	console.log('testing validation');

	var err = " ";
	var donation = Number($('.qty-amt').val(),10);
	var catselect = $(".resource-cat-opt").val();
	var typeselect = $(".resource-type-opt").val();


	if (catselect == 0 || typeselect == 0 || donation === " " || donation === null){
		$('.err-msg').text('Resource Type and Donation Amount are mandatory fields');
		return false;
	}


	if (!(/^[1-9][0-9]*$/.test(donation)) || donation <=0){
		$('.err-msg').text('Donation Amount must be an integer greater than 0');
		return false;
	}

}


function validateRequest(){

	console.log('testing validation request');

	var err = " ";
	var requested = Number($('.qty-amt').val(),10);
	var catselect = $(".resource-cat-opt").val();
	var typeselect = $(".resource-type-opt").val();
	var availStock = Number($(".qty-avail span").text());


	if (catselect == 0 || typeselect == 0 || requested === " " || requested === null){
		$('.err-msg').text('Resource Type and Request Amount are mandatory fields');
		return false;
	}


	if (!(/^[1-9][0-9]*$/.test(requested)) || requested <=0){
		$('.err-msg').text('Request Amount must be an integer greater than 0');
		return false;
	}


	if (requested > availStock){
		$('.err-msg').text('Request Amount must be less than quantity available');
		return false;
	}
}
