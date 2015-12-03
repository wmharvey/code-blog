//Sets the initial header to be the size of the screen
var height = $(window).height();
var width = $(window).width();
$('#first-view').css('height', height);
$('#first-view h1').css('top', (height * 3/10));

//Resizes the header when device is rotated
$(window).on('orientationchange', function() {
  $('#first-view').css('height', width);
  $('#first-view h1').css('top', (height * 3/10));
  var temp = height;
  height = width;
  width = temp;
});

//Opens and closes the menu
$('#menu-button').on('click', function () {
  $('.menu').slideDown(500);
});

$('#close-tab').on('click', function () {
  $('.menu').slideUp(500);
});

// Expand the about link when clicked
$('.toggle').on('click', function() {
  $('.about').toggle(500);
});
