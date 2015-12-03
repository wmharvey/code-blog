$(function() {

// Sort the articles initially by date
  blog.rawData.sort(byDate);

// Use Handlebars to fill in the article template
  Handlebars.registerHelper('getDate', function(strDate){
    var strDate = strDate || '';
    var date = parseInt((new Date() - new Date(strDate))/60/60/24/1000);
    return date;
  });

  var templateScript = $('#article-template').html();
  var template = Handlebars.compile(templateScript);
  for (var i = 0; i < blog.rawData.length; i++) {
    var compiledSingleArticleHtml = template(blog.rawData[i]);
    $('#blogContainer').append(compiledSingleArticleHtml);
  };

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
