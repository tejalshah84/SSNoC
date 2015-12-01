/**
* Push left instantiation and action.
*/
var pushLeft = new Menu({
  wrapper: '#o-wrapper',
  type: 'push-left',
  menuOpenerClass: '.c-button',
  maskId: '#c-mask'
});

var pushLeftBtn = document.querySelector('#c-button--push-left');
      
  pushLeftBtn.addEventListener('click', function(e) {
  e.preventDefault;
  pushLeft.open();
});


/**
* Push right instantiation and action.
*/
var pushRight = new Menu({
  wrapper: '#o-wrapper',
  type: 'push-right',
  menuOpenerClass: '.c-button',
  maskId: '#c-mask'
});

var pushRightBtn = document.querySelector('#c-button--push-right');
      
  pushRightBtn.addEventListener('click', function(e) {
  e.preventDefault;
  pushRight.open();
});


//Menu configuring access to various features
var menu = {    

  'home': "<li class=\"c-menu__item\">" +
  "<a href=\"/community\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-home icon-margin\" aria-hidden=\"true\"></span> Home</a></li>",

    'missing': "<li class=\"c-menu__item\">" +
    "<a href=\"/missing/deck\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-info-sign icon-margin\" aria-hidden=\"true\"></span> Missing People</a></li>",

    'announcement': "<li class=\"c-menu__item\">" +
    "<a data-toggle=\"modal\" data-target=\"#postAnnouncementModal\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-volume-up icon-margin\" aria-hidden=\"true\"></span> Post Announcement</a></li>",

    'userprofile': "<li class=\"c-menu__item\">" +
    "<a href=\"/profile\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-cog icon-margin\" aria-hidden=\"true\"></span> Admin User Profile</a></li>",
        
    'monitorperform': "<li class=\"c-menu__item\">" +
    "<a href=\"/admin\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-equalizer icon-margin\" aria-hidden=\"true\"></span> Measure Performance</a></li>",
        
    'signout': "<li class=\"c-menu__item\">" +
    "<a href=\"/signout\" class=\"c-menu__link\"><span class=\"glyphicon glyphicon-log-out icon-margin\" aria-hidden=\"true\"></span> Signout</a></li>"
}


function loadRightBarMenu(roleid){

  var menulist = " ";

  if (roleid ===1){ //minitor
    menulist = menu['home'] + menu['missing'] +  menu['monitorperform'] + menu['signout'];
    $('.c-menu__items').append(menulist);
  }
  else if (roleid ===2){ //admin
    menulist = menu['home'] + menu['missing'] +  menu['announcement'] +  menu['userprofile'] + menu['signout'];
    $('.c-menu__items').append(menulist);
  }
  else if (roleid ===3){ //coordinator
    menulist = menu['home'] + menu['missing'] +  menu['announcement'] + menu['signout'];
    $('.c-menu__items').append(menulist);
  }
  else if (roleid ===4){
    menulist = menu['home'] + menu['missing'] + menu['signout'];
    $('.c-menu__items').append(menulist);
  }
}

