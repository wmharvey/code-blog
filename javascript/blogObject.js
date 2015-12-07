var blog = new Object();

// Use Handlebars to fill in the article template
// Register a Handlebar helper to calculate publication date
// Append new template to the section with ID '#articleContainer'
blog.fillTemplates = function() {

  Handlebars.registerHelper('getDate', function(strDate){
    var strDate = strDate || '';
    var date = parseInt((new Date() - new Date(strDate))/60/60/24/1000);
    return date;
  });

  $.get('templates/template.html', function(data) {
    var template = Handlebars.compile(data);
    for (var i = 0; i < blog.rawData.length; i++) {
      var compiledSingleArticleHtml = template(blog.rawData[i]);
      $('#articleContainer').append(compiledSingleArticleHtml);
    };
  });
};

// Hides the first paragraph of every article when called
blog.hideFirstParagraph = function() {
  var $articleBody = $('.body');
  $articleBody.each(function() {
    var $this = $(this);
    $this.children().filter(':gt(0)').hide();
  });
};

// Function will fill out the dropdown box pre-created in the HTML
// The parameter byType accepts a string with an article object key. ex: 'author'
// The parameter listClass accepts a string that is the dropdown's id
// that begins with a '#'. ex: '#authorList'
blog.createDropdown = function(byType, listID) {
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

//Filter the data based on user selection in dropdown box.
//selectID is the ID in the relevant <select> ex: '#authorList'
//defaultText is the default text when not sorted ex: 'Sort by Author'
//templateClass is the relevant class in arTemplate ex: '.author'
blog.filter = function(selectID, defaultText, templateClass) {
  blog.revealAll();
  var txt = $(selectID + ' option:selected').text();
  if (txt !== defaultText) {
    $(templateClass).each(function() {
      var $this = $(this);
      if ($this.text() !== txt) {
        $this.parents('.articleBundle').hide();
      }
    });
  }
};

//Reveal all articles
blog.revealAll = function() {
  $('.articleBundle').show();
};

// Will cause the .sort method to sort based on
// author, publication date, or title, category, etc.
blog.byAuthor = function(a, b) {
  if (a.author < b.author) {return 1;}
  if (a.author > b.author) {return -1;}
  return 0;
};

blog.byReverseAuthor = function(a, b) {
  if (a.author > b.author) {return 1;}
  if (a.author < b.author) {return -1;}
  return 0;
};

blog.byDate = function(a, b) {
  if (a.publishedOn < b.publishedOn) { return 1; }
  if (a.publishedOn > b.publishedOn) { return -1; }
  return 0;
};

blog.byTitle = function(a, b) {
  if (a.title < b.title) { return 1; }
  if (a.title > b.title) { return -1; }
  return 0;
};

blog.byCategory = function(a, b) {
  if (a.category > b.category) { return 1; }
  if (a.category < b.category) { return -1; }
  return 0;
};
