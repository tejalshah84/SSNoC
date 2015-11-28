$(function() {
  // Initialize varibles
  var searchCat = "";
  var searchTxt = "";
  var pageCount = 0;
  var totalPages = 0;
  
  

  $(".search-context li a").on('click', function(e){

	  searchCat = $(this).text();
	  
	  $(this).parents('.btn-group').find('.dropdown-toggle').html(searchCat+' <span class="caret"></span>');
	  console.log(searchCat);

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
	  				var errmsg = "<p style=\"color: red;\">" + data.error + "</p>";
	  				$('#search-list').empty();
				 	$('#search-list').append(errmsg);
	  			}
				else if ('rows' in data && data.rows.length === 0) {
				 	var errarray = "<p style=\"color: red;\">No results matching the search criteria</p>";
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

          resultString = "<blockquote><div class=\"searchlist_item\"><p class=\"srch_username\">" + index + getUserStatus(element.status_id) 
          + "</p><div style=\"clear: both;\"></div>"
          + "<small><p class=\"statdesc\">" + status_desc[element.status_id] + "</p><p class=\"srchlocation\">" 
			+ element.location + "</p><p class=\"srchlogintime\">" 
			+ dateForamt(element.lastlogin) + "</p></small></div></blockquote>";

	      $('#search-list').append(resultString);
		})

		$.each(data.offline, function(index, element){

          resultString = "<blockquote><div class=\"searchlist_item\"><p class=\"srch_username\">" + index + getUserStatus(element.status_id) 
          + "</p><div style=\"clear: both;\"></div>"
          + "<small><p class=\"statdesc\">" + status_desc[element.status_id] + "</p><p class=\"srchlocation\">" 
			+ element.location + "</p><p class=\"srchlogintime\">" 
			+ dateForamt(element.lastlogin) + "</p></small></div></blockquote>";

	      $('#search-list').append(resultString);
		})

	}
	else if (searchCat === "Citizen Status"){

		$.each(data.online, function(index, element){

          resultString = "<blockquote><div class=\"searchlist_item\"><p class=\"srch_username\">" + index + getUserStatus(element.status_id) 
          + "</p><div style=\"clear: both;\"></div>"
          + "<small><p class=\"statdesc\">" + status_desc[element.status_id] + "</p><p class=\"srchlocation\">" 
			+ element.location + "</p><p class=\"srchlogintime\">" 
			+ dateForamt(element.lastlogin) + "</p></small></div></blockquote>";

	      $('#search-list').append(resultString);
		})

		$.each(data.offline, function(index, element){

          resultString = "<blockquote><div class=\"searchlist_item\"><p class=\"srch_username\">" + index + getUserStatus(element.status_id) 
          + "</p><div style=\"clear: both;\"></div>"
          + "<small><p class=\"statdesc\">" + status_desc[element.status_id] + "</p><p class=\"srchlocation\">" 
			+ element.location + "</p><p class=\"srchlogintime\">" 
			+ dateForamt(element.lastlogin) + "</p></small></div></blockquote>";

	      $('#search-list').append(resultString);
		})

	}
	else if (searchCat === "Announcements"){

		$.each(data.rows, function (index, element){

			resultString = "<blockquote><div class=\"searchlist_item\"><p class=\"ann_pub\">" + element.user.username + getUserStatus(element.user.statusid) 
          + "</p><div style=\"clear: both;\"></div>"
          + "<small><p class=\"ann_content\">" + element.content + "</p><p class=\"ann_loc\">" 
			+ element.user.location + "</p><p class=\"ann_dt\">" 
			+ dateForamt(element.createdAt) + "</p></small></div></blockquote>";

	      $('#search-list').append(resultString);
	      if (totalPages>10){
	      	$('#search-pagination').show();
	      }
		})

	}
	else if (searchCat === "Public Messages"){

		$.each(data.rows, function (index, element){

			resultString = "<blockquote><div class=\"searchlist_item\"><p class=\"msg_author\">" + element.user.username + getUserStatus(element.user.statusid) 
          + "</p><div style=\"clear: both;\"></div>"
          + "<small><p class=\"msg_content\">" + element.chatmessage + "</p><p class=\"msg_loc\">" 
			+ element.user.location + "</p><p class=\"msg_dt\">" 
			+ dateForamt(element.timestamp) + "</p></small></div></blockquote>";

	      $('#search-list').append(resultString);
	      if (totalPages>10){
	      	$('#search-pagination').show();
	      }
		})

	}
	else if (searchCat ==="Private Messages"){

		$.each(data.rows, function (index, element){

			resultString = "<blockquote><div class=\"searchlist_item\"><p class=\"msg_author\">" + "Sent By: " + element.userauthor_id.username + getUserStatus(element.userauthor_id.statusid)
          + "</p><p class=\"msg_author\">" + "Sent To: " + element.usertarget_id.username + getUserStatus(element.usertarget_id.statusid) + "<div style=\"clear: both;\"></div>"
          + "<small><p class=\"msg_content\">" 
          + element.chatmessage + "</p><p class=\"msg_loc\">" 
			+ element.usertarget_id.location + "</p><p class=\"msg_dt\">" 
			+ dateForamt(element.timestamp) + "</p></small></div></blockquote>";

	      $('#search-list').append(resultString);
	      if (totalPages>10){
	      	$('#search-pagination').show();
	      }
		})

	}
       
}
  
  
});