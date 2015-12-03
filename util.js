//Reveal all articles and hide the template
function revealAll() {
  $('.articleBundle').show();
}

// Will cause the .sort method to sort based on
// author, publication date, or title, category, etc.

var byAuthor = function(a, b) {
  if (a.author < b.author) {return 1;}
  if (a.author > b.author) {return -1;}
  return 0;
};

var byReverseAuthor = function(a, b) {
  if (a.author > b.author) {return 1;}
  if (a.author < b.author) {return -1;}
  return 0;
};

var byDate = function(a, b) {
  if (a.publishedOn < b.publishedOn) { return 1; }
  if (a.publishedOn > b.publishedOn) { return -1; }
  return 0;
};

var byTitle = function(a, b) {
  if (a.title < b.title) { return 1; }
  if (a.title > b.title) { return -1; }
  return 0;
};

var byCategory = function(a, b) {
  if (a.category > b.category) { return 1; }
  if (a.category < b.category) { return -1; }
  return 0;
};

// Function will fill out the dropdown box pre-created in the HTML
// The parameter byType accepts a string with an article object key.
// The parameter listClass accepts a string that is the dropdown's id
// that begins with a '#'
function createDropdown(byType, listID) {
  var track = [];
  for (var i = 0; i < blog.rawData.length; i++) {
    var type = blog.rawData[i][byType];
    if (track.indexOf(type) === -1) {
      var string = '<option>' + type + '</option>';
      var $html = $(string);
      $(listID).append($html);
      track.push(type);
    }
  }
};

//Filter the data based on user selection
//selectID is the ID in the relevant <select> ex: '#authorList'
//defaultText is the default text when not sorted ex: 'Sort by Author'
//templateClass is the relevant class in arTemplate ex: '.author'
function filter (selectID, defaultText, templateClass) {
  revealAll();
  var txt = $(selectID + ' option:selected').text();
  if (txt !== defaultText) {
    $(templateClass).each(function() {
      var $this = $(this);
      if ($this.text() !== txt) {
        $this.parent('.articleBundle').hide();
      }
    });
  }
}
