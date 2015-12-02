$(function() {

// This function makes the Article object. Use it by calling
// new makeArticle(blog.rawData[i])
  function makeArticle(obj) {
    this.title = obj.title;
    this.category = obj.category;
    this.author = obj.author;
    this.authorUrl = obj.authorUrl;
    this.publishedOn = obj.publishedOn;
    this.body = obj.body;
  }

  // This function takes an object created by the makeArticle constructor
  // and creates HTML that is then returned to be inserted into the DOM
  makeArticle.prototype.toHtml = function() {
    var $newArticle = $('article.arTemplate').clone();
    $newArticle.removeClass('arTemplate');
    $newArticle.find('.title').html(this.title);
    $newArticle.find('.author').html(this.author);
    $newArticle.find('time').html('Published ' + parseInt((new Date()
    - new Date(this.publishedOn))/60/60/24/1000) + ' days ago');
    $newArticle.find('.body').html(this.body);
    $newArticle.find('.category').html(this.category);
    $newArticle.find('.url').html('Original source: ' + this.authorUrl);
    $newArticle.find('.url').attr('href', this.authorUrl);
    return $newArticle;
  };

  // These functions receive an array of articles and sorts based on
  // their  author, publication date, or title

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
    if (a.publishedOn > b.publishedOn) { return 1; }
    if (a.publishedOn < b.publishedOn) { return -1; }
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

// Sort the articles initially by date
  blog.rawData.sort(byDate);

//Load all the articles onto the blog website
  for (var i = 0; i < blog.rawData.length; i++) {
    $('.arTemplate').after(new makeArticle(blog.rawData[i]).toHtml());
  }

// Hide the paragraphs initially
  // $(.body:nth-of-type(n>1)).hide();
  var $articleBody = $('.body');
  $articleBody.each(function() {
    var $this = $(this);
    $this.children().filter(':gt(0)').hide();
  });

// Expand and Minimize the article when "more" or "less" is clicked
  $('.more').on('click', function() {
    $(this).siblings('.body').children().filter(':gt(0)').slideToggle(500);
    var str = $(this).text();
    if (str === 'See More') {
      $(this).text('See Less');
      $(this).css('cursor', 'n-resize');
    } else {
      $(this).text('See More');
      $(this).css('cursor', 's-resize');
      $('html, body').animate({
        scrollTop: $($(this).siblings('.title')).offset().top
      }, 500);
    }
  });

// Function will fill out the dropdown box pre-created in the HTML
// The parameter byType accepts a string with an article object key.
// The parameter listClass accepts a string that is the dropdown's class
// that begins with a '.'
  function createDropdown(byType, listClass) {
    var track = [];
    for (var i = 0; i < blog.rawData.length; i++) {
      var type = blog.rawData[i][byType];
      if (track.indexOf(type) === -1) {
        var string = '<option>' + type + '</option>';
        var $html = $(string);
        $(listClass).append($html);
        track.push(type);
      }
    }
  };

// Create a dropdown list for Authors
  blog.rawData.sort(byReverseAuthor);
  createDropdown('author', '.authorList');

// Create a dropdown list for categories
  blog.rawData.sort(byCategory);
  createDropdown('category', '.categoryList');

//Filter the articles based on user selected author
  $('.authorList').change(function() {
    $('.articleBundle').show();
    var auth = $('.authorList option:selected').text();
    $('.author').each(function() {
      var $this = $(this);
      if ($this.text() !== auth) {
        $this.parent('.articleBundle').hide();
      }
    });
  });

//Filter the articles based on user selected category
  $('.categoryList').change(function() {
    $('.articleBundle').show();
    var cat = $('.categoryList option:selected').text();
    $('.category').each(function() {
      var $this = $(this);
      console.log($this.text());
      if ($this.text() !== cat) {
        $this.parent('.articleBundle').hide();
      }
    });
  });

});
