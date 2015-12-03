$(function() {

// RUN WHEN PAGE IS READY

// Sort the articles initially by date
  blog.rawData.sort(blog.byDate);
// Use Handlebars to fill in the article template
  blog.fillTemplates();
// Hide the paragraphs initially
  blog.hideFirstParagraph();
// Create a dropdown list for Authors
  blog.rawData.sort(blog.byReverseAuthor);
  blog.createDropdown('author', '#authorList');
// Create a dropdown list for categories
  blog.rawData.sort(blog.byCategory);
  blog.createDropdown('category', '#categoryList');


// EVENT LISTENERS

//Filter the articles based on user selected author
  $('#authorList').change(function() {
    blog.filter('#authorList', 'Sort by Author', '.author');
  });
//Filter the articles based on user selected category
  $('#categoryList').change(function() {
    blog.filter('#categoryList', 'Sort by Category', '.category');
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

});
