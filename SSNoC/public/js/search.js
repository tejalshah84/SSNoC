$(function() {
  // Initialize varibles
  var $window = $(window);
  var searchCat = "";
  var searchTxt = "";
  
  
  $(".dropdown-menu li a").click(function(){
	  searchCat = $(this).text();
	  $(this).parents('.btn-group').find('.dropdown-toggle').html(searchCat+' <span class="caret"></span>');
	});
  
  $('#submitSearch').on('click', function(){
	  console.log("Sending Ajax SEARCH request to server...");
	  //var searchCat = $('#searchCat').text(this.innerHTML);
	  searchTxt = $('#searchText').val();
	  searchTxt = searchTxt.trim().split(/\s+/);
	  console.log(searchTxt[2]);
	  $.ajax({
			dataType: "json",
	  	url: '/search',
	  	type: 'GET',
			data: {
				 searchCategory:searchCat,
				 searchText: searchTxt
			},
	  	success: function(data) {
				displaySearchResult(data);
	  	},
	  	error: function(e) {
				//console.log(e.message);
	  	}
		});	
});

  
  
  
  
});