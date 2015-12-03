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
    $newArticle.find('.url').attr('href', this.authorUrl);
    return $newArticle;
  };

// Sort the articles initially by date
  blog.rawData.sort(byDate);

//Load all the articles onto the blog website
  for (var i = 0; i < blog.rawData.length; i++) {
    $('.arTemplate').after(new makeArticle(blog.rawData[i]).toHtml());
  }

// Hide the paragraphs initially
  var $articleBody = $('.body');
  $articleBody.each(function() {
    var $this = $(this);
    $this.children().filter(':gt(0)').hide();
  });

// Expand and Minimize the article when "more" or "less" is clicked
  $('.more').on('click', function() {
    var $this = $(this);
    $this.siblings('.body').children().filter(':gt(0)').slideToggle(500);
    var str = $this.text();
    if (str === 'See More') {
      $this.text('See Less');
      $this.css('cursor', 'n-resize');
    } else {
      $this.text('See More');
      $this.css('cursor', 's-resize');
      $('html, body').animate({
        scrollTop: $($this.siblings('.title')).offset().top
      }, 500);
    }
  });

// Create a dropdown list for Authors
  blog.rawData.sort(byReverseAuthor);
  createDropdown('author', '#authorList');

// Create a dropdown list for categories
  blog.rawData.sort(byCategory);
  createDropdown('category', '#categoryList');


//Filter the articles based on user selected author
  $('#authorList').change(function() {
    filter('#authorList', 'Sort by Author', '.author');
  });

//Filter the articles based on user selected category
  $('#categoryList').change(function() {
    filter('#categoryList', 'Sort by Category', '.category');
  });

});
