/*
//Toggle Directory
$("#menu-toggle").click(function(e){
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

//Toggle the Public wall to Private room on click of username from directory

function replace(id1,id2) {
	var pubwall = document.getElementById(id1);
    var privroom = document.getElementById(id2);
    
    console.log('Checking Public and private toggle');
    console.log(pubwall);
    console.log(privroom);
    
    if(document.getElementById(id1).style.display == 'block'){
    	document.getElementById(id1).style.display = 'none';
    	document.getElementById(id2).style.display = 'block';
    }
    else{
    	document.getElementById(id1).style.display = 'block';
    	document.getElementById(id2).style.display = 'none';
    }
   }

   */