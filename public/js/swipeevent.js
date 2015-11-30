$(function() {
  // Initialize varibles
	
	
	
	
	
	// --------------- Iteration 4 -----------------------//
	
	$(window).load(function() {
		firstPersonCard = $( "#card-deck > div:last-child > p" ).text();
		lastPersonCard = $( "#card-deck > div:first-child > p" ).text();
		currentPersonCard = firstPersonCard;
		console.log('current=> '+currentPersonCard);
		console.log('first=> '+firstPersonCard);
		console.log('last=> '+lastPersonCard);
	});
	
	function getCurrentCard(){
		return ($('.current > p').text());
	}
	
	$('.btn-pass').on('click', function(){
		
		$('.card-'+currentPersonCard).addClass('rotate-left').delay(700).fadeOut(1);
		$('.card-'+currentPersonCard).removeClass('current');
    
		if ( $('.card-'+currentPersonCard).is(':first-child') ) {
			currentPersonCard = firstPersonCard;
			$('.card-'+(currentPersonCard)).removeClass('rotate-left rotate-right').fadeIn(300);
			$('.card-'+currentPersonCard).addClass('current');
		}else{
			$('.card-'+(++currentPersonCard)).removeClass('rotate-left rotate-right').fadeIn(400);
			$('.card-'+currentPersonCard).addClass('current');
		}
		console.log('current= '+getCurrentCard());
		currentPersonCard = getCurrentCard();
	});
	
	
	$(".buddy").swipe(function( direction, offset ) {
		console.log(offset.x);
	if (offset.x > 50 || offset.x < -50){
		if (direction.x == "right") { 
			console.log("right"); 
			$('.card-'+currentPersonCard).addClass('rotate-left').delay(700).fadeOut(1);
			$('.card-'+currentPersonCard).removeClass('current');
		
    
			if ( $('.card-'+currentPersonCard).is(':first-child') ) {
				currentPersonCard = firstPersonCard;
				$('.card-'+(currentPersonCard)).removeClass('rotate-left rotate-right').fadeIn(300);
				$('.card-'+currentPersonCard).addClass('current');
			}else{
				$('.card-'+(++currentPersonCard)).removeClass('rotate-left rotate-right').fadeIn(400);
				$('.card-'+currentPersonCard).addClass('current');
			}    
			console.log('current= '+getCurrentCard());
			currentPersonCard = getCurrentCard();
		}else{
			console.log("left11"); 
			console.log("left"); 
			$('.card-'+currentPersonCard).addClass('rotate-right').delay(700).fadeOut(1);
			$('.card-'+currentPersonCard).removeClass('current');
		
    
			if ( $('.card-'+currentPersonCard).is(':last-child') ) {
				currentPersonCard = lastPersonCard;
				$('.card-'+(currentPersonCard)).removeClass('rotate-left rotate-right').fadeIn(300);
				$('.card-'+currentPersonCard).addClass('current');
			}else{
				$('.card-'+(--currentPersonCard)).removeClass('rotate-left rotate-right').fadeIn(400);
				$('.card-'+currentPersonCard).addClass('current');
			}    
		}
	}
	
	});
	
	
});	