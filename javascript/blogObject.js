var blog = {};
blog.articles = [];

//Send an ajax request to get an eTag to compare
blog.getData = function() {
  $.ajax({
    type: 'HEAD',
    url: 'data/blogArticles.json',
    success: blog.compareETags
  });
};

//Compare the eTag to an eTag in localStorage. If it matches, the
//data is the same and can be aquired from localStorage. If it
//doesn't match, we send a JSON request to get updated articles
blog.compareETags = function(data, status, xhr) {
  eTag = xhr.getResponseHeader('eTag');
  if (eTag === localStorage.getItem('eTag')) {
    console.log('cache hit');
    webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
    blog.fetchFromDB();
  } else {
    console.log('cache miss');
    webDB.init();
    //remove all articles from blog and DB
    //callback to move on to fetchJson
    blog.articles = [];
    webDB.execute(
      'DELETE FROM articles;',
      blog.fetchJSON(eTag));
  };
};

//Send JSON request, store the returned object in DB
//call a function to load data from the localStorage,
//save the new eTag to local storage
blog.fetchJSON = function(eTag) {
  $.getJSON('data/blogArticles.json', function(data) {
    blog.articles = blog.convertToHTML(data);
    webDB.insertAllRecords(blog.articles);
    blog.initArticles();
  })
  .done(function() {
    localStorage.setItem('eTag', eTag);
  });
};

//Receives an array to convert "markdown" key-value pairs to "body"
//key-value pairs. Returns the modified array.
  blog.convertToHTML = function(articlesArray) {
    articlesArray.forEach(function(item) {
      var body = item.markdown;
      if (body !== undefined) {
        var bodyHTML = marked(body);
        item.body = bodyHTML;
      }
    });
    return articlesArray;
  };

//Parse out an array from localStorage, sort to convert markdown
//and create two dropdown boxes
blog.fetchFromDB = function() {
  webDB.execute(
    'SELECT * FROM articles;'
    ,function(resultsArray) {
      resultsArray.forEach(function(item) {
        blog.articles.push(item);
      });
      blog.initArticles();
    }
  );
};

// Use Handlebars to fill in the article template
// Register a Handlebar helper to calculate publication date
// Append new template to the section with ID '#articleContainer'
// Hide the first paragraph and make "see more" responsive
blog.initArticles = function() {

  Handlebars.registerHelper('getDate', function(strDate){
    var strDate = strDate || '';
    var date = parseInt((new Date() - new Date(strDate))/60/60/24/1000);
    return date;
  });

  Handlebars.registerHelper('getWordCount', function(obj) {
    return wordCount(obj);
  });

//Asynchronous function. Get the template, then run through the
//callback function line by line
  $.get('templates/template.html', function(data) {
    var template = Handlebars.compile(data);
    blog.articles.sort(blog.byDate);
    blog.articles.forEach(function(item) {
      var compiledHtml = template(item);
      $('#articleContainer').append(compiledHtml);
      console.log('each');
    });

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
    blog.formatPage();
  });
};

blog.formatPage = function() {
  blog.loadDropDowns();
  blog.hideFirstParagraph();
  blog.addEventListernerMore();
  blog.addEventListernerAuthor();
  blog.addEventListernerCategory();
};

blog.loadDropDowns = function() {
  blog.articles.sort(blog.byReverseAuthor);
  blog.createDropdown('author', '#authorList');
  blog.articles.sort(blog.byCategory);
  blog.createDropdown('category', '#categoryList');
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
    var target = $('#authorList option:selected').val();
    blog.filter(target, '.author');
  });
};

//Filter the articles based on user selected category
blog.addEventListernerCategory = function() {
  $('#categoryList').change(function() {
    var target = $('#categoryList option:selected').val();
    blog.filter(target, '.category');
  });
};

// Function will fill out the dropdown box pre-created in the HTML
// The parameter byType accepts a string with an article object key. ex: 'author'
// The parameter listID accepts a string that is the dropdown's id
// that begins with a '#'. ex: '#authorList'
blog.createDropdown = function(byType, listID) {
  webDB.execute('SELECT DISTINCT "' + byType + '" FROM articles;',
    function(resultArray) {
      resultArray.forEach(function(item) {
        var string = '<option value="' + item[byType] + '">' + item[byType] + '</option>';
        $(listID).append($(string));
      });
    });
};

//Filter the data based on a value and a category.
//templateClass is the relevant class in arTemplate ex: '.author'
blog.filter = function(value, templateClass) {
  blog.hideAll();
  if (value === 'default') {
    blog.revealAll();
  } else {
    $(templateClass).each(function() {
      if ($(this).text() === value) {
        $(this).parents('.articleBundle').show();
      }
    });
  }
};

//Filter returns an array of relevant articles based
//on type and value
blog.databasefilter = function(keyType, value) {
  webDB.execute('SELECT * FROM articles WHERE "' + keyType + '" LIKE "' + value +'" ORDER BY publishedOn ASC;',
    function(resultArray) {
      return resultArray;
    });
};

//Reveal all articles
blog.revealAll = function() {
  $('.articleBundle').show();
};

blog.hideAll = function() {
  console.log('hide');
  $('.articleBundle').hide();
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
