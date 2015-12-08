$(function() {

// RUN WHEN PAGE IS READY

// Get data from file OR local storage
  blog.getData();
// Sort the articles initially by date
  // blog.rawData.sort(blog.byDate);
// Use Handlebars to fill in the article template
  // blog.fillTemplates();
// Create a dropdown list for Authors
  // blog.rawData.sort(blog.byReverseAuthor);
  // blog.createDropdown('author', '#authorList');
// Create a dropdown list for categories
  // blog.rawData.sort(blog.byCategory);
  // blog.createDropdown('category', '#categoryList');


// EVENT LISTENERS

//Filter the articles based on user selected author
  $('#authorList').change(function() {
    blog.filter('#authorList', 'Sort by Author', '.author');
  });
//Filter the articles based on user selected category
  $('#categoryList').change(function() {
    blog.filter('#categoryList', 'Sort by Category', '.category');
  });

});
