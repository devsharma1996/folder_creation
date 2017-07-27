var menu = document.querySelector("#context-menu");
var menuState = 0;
var activeClassName = "context-menu--active";
var menuPosition;
var menuPositionX;
var menuPositionY;

var clickCoords;
var clickCoordsX;
var clickCoordsY;


var menuWidth;
var menuHeight;

var folder_selected="";

menuWidth = menu.offsetWidth;
menuHeight = menu.offsetHeight;

var windowWidth;
var windowHeight;

windowWidth = window.innerWidth;
windowHeight = window.innerHeight;



function toggleMenuOn() {
  if ( menuState !== 1 ) {
    menuState = 1;
    menu.classList.add(activeClassName);
 }
}

function toggleMenuOff() {
  if ( menuState !== 0 ) {
    menuState = 0;
    menu.classList.remove(activeClassName);
  }
}

function getPosition(e) {
  var posx = 0;
  var posy = 0;

  if (!e) var e = window.event;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + 
                       document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + 
                       document.documentElement.scrollTop;
  }

  return {
    x: posx,
    y: posy
  }
}


function positionMenu(e) {
   clickCoords = getPosition(e);
  clickCoordsX = clickCoords.x;
  clickCoordsY = clickCoords.y;

  menuWidth = menu.offsetWidth + 4;
  menuHeight = menu.offsetHeight + 4;

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  if ( (windowWidth - clickCoordsX) < menuWidth ) {
    menu.style.left = windowWidth - menuWidth + "px";
  } else {
    menu.style.left = clickCoordsX + "px";
  }

  if ( (windowHeight - clickCoordsY) < menuHeight ) {
    menu.style.top = windowHeight - menuHeight + "px";
  } else {
    menu.style.top = clickCoordsY + "px";
  }
}



document.addEventListener("contextmenu",function(event){
 if(event.target.tagName=="IMG"){
      event.preventDefault();
      folder_selected=event.target.nextSibling;
     console.log("Selected folder is: "+folder_selected.textContent);
     console.log(folder_selected);
      toggleMenuOn();
      positionMenu(event);
 }
 else{
     toggleMenuOff();
 } 
});


