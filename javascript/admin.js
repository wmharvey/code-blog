$(function() {

  getData();
  var articles = [];

  function getData() {
    $.ajax({
      type: 'HEAD',
      url: 'data/blogArticles.json',
      success: compareETags
    });
  };

  function compareETags(data, status, xhr) {
    eTag = xhr.getResponseHeader('eTag');
    if (eTag === localStorage.getItem('eTag')) {
      console.log('cache hit');
      webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
      fetchFromDB();
    } else {
      console.log('cache miss');
      webDB.init();
      articles = [];
      webDB.execute('DELETE FROM articles;', fetchJSON(eTag));
    };
  };

  function fetchFromDB() {
    webDB.execute('SELECT * FROM articles;', function(resultsArray) {
      resultsArray.forEach(function(item) {
        articles.push(item);
      });
      fillTables();
    });
  }

  function fetchJSON(eTag) {
    $.getJSON('data/blogArticles.json', function(data) {
      articles = convertToHTML(data);
      webDB.insertAllRecords(articles);
      fillTables();
    })
    .done(function() {
      localStorage.setItem('eTag', eTag);
    });
  };

  // function loadFromLocal() {
  //   var stringArticles = localStorage.getItem('articles');
  //   var articlesArray = JSON.parse(stringArticles);
  //   var articlesArrayHTML = convertToHTML(articlesArray);
  //   fillTables(articlesArrayHTML);
  // };

  function convertToHTML(articlesArray) {
    articlesArray.forEach(function(item) {
      var body = item.markdown;
      if (body !== undefined) {
        var bodyHTML = marked(body);
        item.body = bodyHTML;
      }
    });
    return articlesArray;
  };

  function fillTables() {
    fillBlogStats();
    fillAuthorStats();
  };

  function fillBlogStats() {
    var $blogStatsTable = $('#blog-stats');
    var numArticles = articles.length;
    var numUniqueAuthors = uniqueAuthors(articles).length;
    var totalWords = numWords(articles);
    var avgWordLength = averageWordLength(articles);
    $blogStatsTable.append('<tr><th scope="col">Total Number of Articles</th><td>'
     + numArticles + '</td></tr>');
    $blogStatsTable.append('<tr><th scope="col">Total Authors</th><td>'
     + numUniqueAuthors + '</td></tr>');
    $blogStatsTable.append('<tr><th scope="col">Total Number of Words</th><td>'
     + totalWords + '</td></tr>');
    $blogStatsTable.append('<tr><th scope="col">Average Word Length</th><td>'
     + avgWordLength + '</td></tr>');
  };

  function fillAuthorStats() {
    var $blogStatsTable = $('#author-stats');
    var arrayOfAuthors = uniqueAuthors(articles);
    arrayOfAuthors.forEach(function(item) {
      var name = item;
      var totalArticles = articlesByType(articles, 'author', name);
      var avgWordCount = averageWordCount(articles, 'author', name);
      var avgWordLength = averageWordLength(articles, 'author', name);
      $blogStatsTable.append('<tr><th scope="row">' + name + '</th><td>'
       + totalArticles + '</td><td>' + avgWordCount + '</td><td>'
        + avgWordLength + '</td></tr>');
    });
  }

});
