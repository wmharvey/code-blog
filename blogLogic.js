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
    $newArticle.find('.author').html('By ' + this.author);
    $newArticle.find('time').html('Published ' + parseInt((new Date()
    - new Date(this.publishedOn))/60/60/24/1000) + ' days ago');
    $newArticle.find('.body').html(this.body);
    $newArticle.find('.category').html('Tags: ' + this.category);
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

// Sort the articles initially by date
  blog.rawData.sort(byTitle);

  for (var i = 0; i < blog.rawData.length; i++) {
    $('.arTemplate').after(new makeArticle(blog.rawData[i]).toHtml());
  }

// Hide the paragraphs initially
  // $(.body:nth-of-type(n>1)).hide();
  $('.body>*:gt(0)').hide();

// Expand and Minimize the article when "more" or "less" is clicked
  $('.more').on('click', function() {
    $(this).siblings('.body').children('p').slideToggle(500);
    var str = $(this).text();
    if (str === 'See More') {
      $(this).text('See Less');
    } else {
      $(this).text('See More');
      $('html, body').animate({
        scrollTop: $($(this).siblings('.title')).offset().top
      }, 500);
    }
  });


});
