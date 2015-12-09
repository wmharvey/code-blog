var blog = new Object();

//Send an ajax request to get an eTag to compare
blog.getData = function() {
  $.ajax({
    type: 'HEAD',
    url: 'javascript/blogArticles.json',
    success: blog.compareETags
  });
};

//Compare the eTag to an eTag in localStorage. If it matches, the
//data is the same and can be aquired from localStorage. If it
//doesn't match, we update the eTag in localStorage and send a JSON
//request to get updated articles
blog.compareETags = function(data, status, xhr) {
  eTag = xhr.getResponseHeader('eTag');
  if (eTag === localStorage.getItem('eTag')) {
    console.log('cache hit');
    blog.loadFromLocal();
  } else {
    console.log('cache miss');
    localStorage.setItem('eTag', eTag);
    blog.loadFromJSON();
  };
};

//Send JSON request, store the returned object in localStorage
//as a string, call a function to load data from the localStorage
blog.loadFromJSON = function() {
  $.getJSON('javascript/blogArticles.json', function(data) {
    var stringArticles = JSON.stringify(data);
    localStorage.setItem('articles', stringArticles);
    blog.loadFromLocal();
  });
};

//Parse out an array from localStorage, sort to convert markdown
//and create two dropdown boxes
blog.loadFromLocal = function() {
  var stringArticles = localStorage.getItem('articles');
  var articlesArray = JSON.parse(stringArticles);
  blog.convertToHTML(articlesArray);
};

//Receives an array to convert "markdown" key-value pairs to "body"
//key-value pairs. Calls fillTemplate once completed.
blog.convertToHTML = function(articlesArray) {
  var articleArrayCopy = articlesArray.slice();
  articleArrayCopy.sort(blog.byDate);
  articleArrayCopy.forEach(function(item) {
    var body = item.markdown;
    if (body !== undefined) {
      var bodyHTML = marked(body);
      item.body = bodyHTML;
    }
  });
  blog.fillTemplates(articleArrayCopy);
  blog.formatPage(articlesArray);
};


// Use Handlebars to fill in the article template
// Register a Handlebar helper to calculate publication date
// Append new template to the section with ID '#articleContainer'
// Hide the first paragraph and make "see more" responsive
blog.fillTemplates = function(articlesArray) {

  Handlebars.registerHelper('getDate', function(strDate){
    var strDate = strDate || '';
    var date = parseInt((new Date() - new Date(strDate))/60/60/24/1000);
    return date;
  });

  Handlebars.registerHelper('getWordCount', function(obj) {
    return wordCount(obj);
  });

  $.get('templates/template.html', function(data) {
    var template = Handlebars.compile(data);
    for (var i = 0; i < articlesArray.length; i++) {
      var compiledSingleArticleHtml = template(articlesArray[i]);
      $('#articleContainer').append(compiledSingleArticleHtml);
    };
    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
      blog.hideFirstParagraph();
      blog.addEventListernerMore();
    });
  });
};

blog.formatPage = function(articlesArray) {
  blog.loadDropDowns(articlesArray);
  blog.addEventListernerAuthor();
  blog.addEventListernerCategory();
};

blog.loadDropDowns = function(articlesArray) {
  articlesArray.sort(blog.byReverseAuthor);
  blog.createDropdown(articlesArray, 'author', '#authorList');
  articlesArray.sort(blog.byCategory);
  blog.createDropdown(articlesArray, 'category', '#categoryList');
};

// Hides the first paragraph of every article when called
blog.hideFirstParagraph = function() {
  var $articleBody = $('.body');
  $articleBody.each(function() {
    $(this).children().filter(':gt(0)').hide();
  });
};

// Expand and Minimize the article when "more" or "less" is clicked
blog.addEventListernerMore = function() {
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
};

//Filter the articles based on user selected author
blog.addEventListernerAuthor = function() {
  $('#authorList').change(function() {
    blog.filter('#authorList', 'Sort by Author', '.author');
  });
};

//Filter the articles based on user selected category
blog.addEventListernerCategory = function() {
  $('#categoryList').change(function() {
    blog.filter('#categoryList', 'Sort by Category', '.category');
  });
};

// Function will fill out the dropdown box pre-created in the HTML
// The parameter byType accepts a string with an article object key. ex: 'author'
// The parameter listClass accepts a string that is the dropdown's id
// that begins with a '#'. ex: '#authorList'
blog.createDropdown = function(articlesArray, byType, listID) {
  var track = [];
  for (var i = 0; i < articlesArray.length; i++) {
    var type = articlesArray[i][byType];
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
