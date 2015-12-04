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
		$('.card-'+firstPersonCard).show().addClass('current');
	});
	
	function getCurrentCard(){
		return ($('.current > p.missingPeopleId').text());
	}
	
	$('.btn-pass').on('click', function(){
		
		//$('.card-'+currentPersonCard).addClass('rotate-left').delay(700).fadeOut(1);
		//$('.card-'+currentPersonCard).removeClass('current');
    
		
/*			$('.card-'+currentPersonCard).addClass('rotate-left').delay(700).fadeOut(1);
			$('.card-'+currentPersonCard).removeClass('current');
			currentPersonCard++;
			$('.card-'+currentPersonCard).addClass('current');*/
			$('.card-'+currentPersonCard).addClass('rotate-left').delay(700).fadeOut(1);
			$('.card-'+currentPersonCard).removeClass('current');
			if ( $('.card-'+currentPersonCard).is(':first-child') ) {
				$('.card-'+firstPersonCard).removeClass('rotate-left rotate-right').fadeIn(400);
				$('.card-'+firstPersonCard).addClass('current');
			}else{
				$('.card-'+currentPersonCard).prev().removeClass('rotate-left rotate-right').fadeIn(400);
				$('.card-'+currentPersonCard).prev().addClass('current');
			}
			
			
		//	$('.card-'+(currentPersonCard)).removeClass('rotate-left rotate-right').fadeIn(400);

		
		console.log('current==> '+getCurrentCard());
		currentPersonCard = getCurrentCard();
	});
	
	
	$(".buddy").swipe(function( direction, offset ) {
	  console.log( "Moving", direction.x);
	 // console.log( "Touch moved by", offset.x, "horizontally ");
		
	
	
		if (direction.x =="left" && offset.x < -50) {
			console.log("left"); 
			$('.card-'+currentPersonCard).addClass('rotate-right').delay(700).fadeOut(1);
			$('.card-'+currentPersonCard).removeClass('current');
			if ( $('.card-'+currentPersonCard).is(':last-child') ) {
				$('.card-'+lastPersonCard).removeClass('rotate-left rotate-right').fadeIn(400);
				$('.card-'+lastPersonCard).addClass('current');
			}else{
				$('.card-'+currentPersonCard).next().removeClass('rotate-left rotate-right').fadeIn(400);
				$('.card-'+currentPersonCard).next().addClass('current');
			}
			console.log('current= '+getCurrentCard());
			currentPersonCard = getCurrentCard();
		} 
		
		if (direction.x == "right"  && offset.x > 50 ) { 
			console.log("right"); 
			$('.card-'+currentPersonCard).addClass('rotate-left').delay(700).fadeOut(1);
			$('.card-'+currentPersonCard).removeClass('current');
			if ( $('.card-'+currentPersonCard).is(':first-child') ) {
				$('.card-'+firstPersonCard).removeClass('rotate-left rotate-right').fadeIn(400);
				$('.card-'+firstPersonCard).addClass('current');
			}else{
				$('.card-'+currentPersonCard).prev().removeClass('rotate-left rotate-right').fadeIn(400);
				$('.card-'+currentPersonCard).prev().addClass('current');
			}
			console.log('current= '+getCurrentCard());
			currentPersonCard = getCurrentCard();
		}
		
		
		
		
		
	});
	
	
});	