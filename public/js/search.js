$(function() {
  // Initialize varibles
  var searchCat = "";
  var searchTxt = "";
  var pageCount = 0;
  var totalPages = 0;
  
  

  $(".search-context li a").on('click', function(e){

	  searchCat = $(this).text();
	  
	  $(this).parents('.btn-group').find('.dropdown-toggle').html(searchCat+' <span class="caret"></span>');

	  e.preventDefault();
	  
	  if (searchCat === "Citizen Status"){
	  	$("#searchText").hide();
	  	$("#userStatus").show();
	  }
	  else{
	  	$("#userStatus").hide();
	  	$("#searchText").show();
	  }

	});
  
  $('#submitSearch').on('click', function(){
	  
	  if(searchCat === "Citizen Status"){
	  	searchTxt = $('#statusOptions').val();
	  }else{
	  	searchTxt = $('#searchText').val();
	  }
	 
	  fetchSearchResults();

	});

 /* $(".pagination li span").on('click', function(e){
  	pageCount = (totalPages-pageCount>10)? pageCount+10 : (totalPages-(pageCount+10)>0) 

  });*/


function fetchSearchResults(){

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
	  		    if (searchCat!=="Citizen" && searchCat!=="Citizen Status"){
	  		    totalPages = data.count;
	  			}

	  			if ('error' in data){
	  				var errmsg = "<p class=\"error-message\">" + data.error + "</p>";
	  				$('#search-list').empty();
				 	$('#search-list').append(errmsg);
	  			}
				else if ('rows' in data && data.rows.length === 0) {
				 	var errarray = "<p class=\"error-message\">No results matching the search criteria</p>";
				 	$('#search-list').empty();
				 	$('#search-list').append(errarray);
				}
				else {
				 	displaySearchResults(data);
				}

		},
	  	error: function(e) {

	  	}
		});	
}


function displaySearchResults(data){

	var resultString ='';
	$('#search-list').empty();

	if (searchCat === "Citizen"){

		$.each(data.online, function(index, element){

          resultString = "<div class=\"search-result-block\"><div class=\"searchlist_item\"><p class=\"srch_username pull-left\">" + getUserStatus(element.status_id) + index
          + "</p><p class=\"chat_timestamp\">" 
			+ dateForamt(element.lastlogin) + "</p><div style=\"clear: both;\"></div>"
          + "<p class=\"srchlocation\">" 
			+ element.location + "</p></div></div>";

	      $('#search-list').append(resultString);
		})

		$.each(data.offline, function(index, element){

          resultString = "<div class=\"search-result-block\"><div class=\"searchlist_item\"><p class=\"srch_username pull-left\">" + getUserStatus(element.status_id) + index
          + "</p><p class=\"chat_timestamp\">" 
			+ dateForamt(element.lastlogin) + "</p><div style=\"clear: both;\"></div>"
          + "<p class=\"srchlocation\">" 
			+ element.location + "</p></div></div>";

	      $('#search-list').append(resultString);
		})

	}
	else if (searchCat === "Citizen Status"){

		$.each(data.online, function(index, element){

          resultString = "<div class=\"search-result-block\"><div class=\"searchlist_item\"><p class=\"srch_username pull-left\">" + getUserStatus(element.status_id) + index
          + "</p><p class=\"chat_timestamp\">" 
			+ dateForamt(element.lastlogin) + "</p><div style=\"clear: both;\"></div>"
          + "<p class=\"srchlocation\">" 
			+ element.location + "</p></div></div>";

	      $('#search-list').append(resultString);
		})

		$.each(data.offline, function(index, element){

          resultString = "<div class=\"search-result-block\"><div class=\"searchlist_item\"><p class=\"srch_username pull-left\">" + getUserStatus(element.status_id) + index
          + "</p><p class=\"chat_timestamp\">" 
			+ dateForamt(element.lastlogin) + "</p><div style=\"clear: both;\"></div>"
          + "<p class=\"srchlocation\">" 
			+ element.location + "</p></div></div>"	;

	      $('#search-list').append(resultString);
		})

	}
	else if (searchCat === "Announcements"){

		$.each(data.rows, function (index, element){

			resultString = "<div class=\"search-result-block\"><div class=\"searchlist_item\"><p class=\"srch_username pull-left\">" + getUserStatus(element.user.statusid) + element.user.username
          + "</p><p class=\"chat_timestamp\">" 
			+ dateForamt(element.createdAt) + "</p><div style=\"clear: both;\"></div>"
          + "<p class=\"srchlocation\">" 
			+ element.user.location + "</p><p class=\"ann_content\">" + element.content + "</p></div></div>";

	      $('#search-list').append(resultString);
	      if (totalPages>10){
	      	$('#search-pagination').show();
	      }
		})

	}
	else if (searchCat === "Public Messages"){

		$.each(data.rows, function (index, element){

			resultString = "<div class=\"search-result-block\"><div class=\"searchlist_item\"><p class=\"srch_username pull-left\">" + getUserStatus(element.user.statusid) + element.user.username
          + "</p><p class=\"chat_timestamp\">" 
			+ dateForamt(element.timestamp) + "</p><div style=\"clear: both;\"></div>"
          + "<p class=\"srchlocation\">" 
			+ element.user.location + "</p><p class=\"ann_content\">" + element.chatmessage + "</p></div></div>";

	      $('#search-list').append(resultString);
	      if (totalPages>10){
	      	$('#search-pagination').show();
	      }
		})

	}
	else if (searchCat ==="Private Messages"){

		$.each(data.rows, function (index, element){

			resultString =  "<div class=\"search-result-block\"><div class=\"searchlist_item\"><p class=\"srch_username pull-left\">Sent By: " + getUserStatus(element.userauthor_id.statusid) + element.userauthor_id.username
          + "</p><p class=\"chat_timestamp\">" 
			+ dateForamt(element.timestamp) + "</p><div style=\"clear: both;\"></div><p class=\"srchlocation\">" 
			+ element.userauthor_id.location + "</p><p class=\"srch_username pull-left\">Sent To: " + getUserStatus(element.usertarget_id.statusid) + element.usertarget_id.username
          + "</p><div style=\"clear: both;\"><p class=\"srchlocation\">" 
			+ element.usertarget_id.location + "</p><p class=\"ann_content\">" + element.chatmessage + "</p></div></div>";

	      $('#search-list').append(resultString);
	      if (totalPages>10){
	      	$('#search-pagination').show();
	      }
		})

	}
       
}
  
  
});