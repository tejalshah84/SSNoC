$(function() {
  // Initialize varibles
  var $window = $(window);
  var searchCat = "";
  var searchTxt = "";
  var pageCount = 0;
  
  
  $(".search-context li a").click(function(e){
	  searchCat = $(this).text();
	  e.preventDefault();
	  console.log(searchCat);
	  
	  if (searchCat === "Citizen Status"){
	  	$("#searchText").hide();
	  	$("#userStatus").show();
	  }
	  else{
	  	$("#userStatus").hide();
	  	$("#searchText").show();
	  }

	  $(this).parents('.btn-group').find('.dropdown-toggle').html(searchCat+' <span class="caret"></span>');
	  console.log(searchCat);
	});
  
  $('#submitSearch').on('click', function(){
	  console.log("Sending Ajax SEARCH request to server...");
	  //var searchCat = $('#searchCat').text(this.innerHTML);
	  searchTxt = $('#searchText').val();
	  //searchTxt = searchTxt.trim().split(/\s+/);
	  console.log(searchTxt[2]);
	  $.ajax({
			dataType: "json",
	  	url: '/search',
	  	type: 'GET',
			data: {
				 searchCriteria:searchCat,
				 searchText: searchTxt,
				 offset: pageCount
			},
	  	success: function(data) {
	  		    console.log(data);
	  		    console.log('search results');
				//displaySearchResult(data);
	  	},
	  	error: function(e) {
				//console.log(e.message);
	  	}
		});	
});

   
  
  
});