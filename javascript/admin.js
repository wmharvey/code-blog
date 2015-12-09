$(function() {

  getData();

  function getData() {
    $.ajax({
      type: 'HEAD',
      url: 'javascript/blogArticles.json',
      success: compareETags
    });
  };

  function compareETags(data, status, xhr) {
    eTag = xhr.getResponseHeader('eTag');
    if (eTag === localStorage.getItem('eTag')) {
      console.log('cache hit');
      loadFromLocal();
    } else {
      console.log('cache miss');
      localStorage.setItem('eTag', eTag);
      blog.loadFromJSON();
    };
  } ;

  function loadFromJSON() {
    $.getJSON('javascript/blogArticles.json', function(data) {
      var stringArticles = JSON.stringify(data);
      localStorage.setItem('articles', stringArticles);
      blog.loadFromLocal();
    });
  };

  function loadFromLocal() {
    var stringArticles = localStorage.getItem('articles');
    var articlesArray = JSON.parse(stringArticles);
    var articlesArrayHTML = convertToHTML(articlesArray);
    fillTables(articlesArrayHTML);
  };

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

  function fillTables(array) {
    fillBlogStats(array);
    fillAuthorStats(array);
  };

  function fillBlogStats(arrayOfArticles) {
    var $blogStatsTable = $('#blog-stats');
    var numArticles = arrayOfArticles.length;
    var numUniqueAuthors = uniqueAuthors(arrayOfArticles).length;
    var totalWords = numWords(arrayOfArticles);
    var avgWordLength = averageWordLength(arrayOfArticles);
    $blogStatsTable.append('<tr><th scope="col">Total Number of Articles</th><td>' + numArticles + '</td></tr>');
    $blogStatsTable.append('<tr><th scope="col">Total Authors</th><td>' + numUniqueAuthors + '</td></tr>');
    $blogStatsTable.append('<tr><th scope="col">Total Number of Words</th><td>' + totalWords + '</td></tr>');
    $blogStatsTable.append('<tr><th scope="col">Average Word Length</th><td>' + avgWordLength + '</td></tr>');
  };

  function fillAuthorStats(arrayOfArticles) {
    var $blogStatsTable = $('#author-stats');
    var arrayOfAuthors = uniqueAuthors(arrayOfArticles);
    arrayOfAuthors.forEach(function(item) {
      var name = item;
      var totalArticles = articlesByType(arrayOfArticles, 'author', name);
      var avgWordCount = averageWordCount(arrayOfArticles, 'author', name);
      var avgWordLength = averageWordLength(arrayOfArticles, 'author', name);
      $blogStatsTable.append('<tr><th scope="row">' + name + '</th><td>' + totalArticles + '</td><td>' + avgWordCount + '</td><td>' + avgWordLength + '</td></tr>');
    //  $blogStatsTable.append('<td>' + totalArticles + '</td>');
    //  $blogStatsTable.append('<td>' + avgWordCount + '</td>');
    //  $blogStatsTable.append('<td>' + avgWordLength + '</td></tr>');
    });
  }

});
