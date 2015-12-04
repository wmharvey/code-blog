//Sets the initial header to be the size of the screen
var viewportHeight = $(window).height();
var viewportWidth = $(window).width();
$('#first-view').css('height', viewportHeight);
$('#first-view h1').css('top', (viewportHeight * 3/10));

//Resizes the header when device is rotated
$(window).on('orientationchange', function() {
  $('#first-view').css('height', viewportWidth);
  $('#first-view h1').css('top', (viewportHeight * 3/10));
  var temp = viewportHeight;
  viewportHeight = viewportWidth;
  viewportWidth = temp;
});

//Opens and closes the menu
$('#menu-button').on('click', function () {
  $('#dropdown-menu').slideDown(500);
});

$('#close-tab').on('click', function () {
  $('#dropdown-menu').slideUp(500);

});
