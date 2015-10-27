$(function() {
  // Initialize varibles
  var $window = $(window);
  
  $(".dropdown-menu li a").click(function(){
	  var selText = $(this).text();
	  $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
	});
  
  $('#submitSearch').on('click', function(){
	  console.log("Sending Ajax SEARCH request to server...");
	  $.ajax({
			dataType: "json",
	  	url: '/search',
	  	type: 'GET',
			data: {},
	  	success: function(data) {
				displaySearchResult(data);
	  	},
	  	error: function(e) {
				//console.log(e.message);
	  	}
		});	
});

});