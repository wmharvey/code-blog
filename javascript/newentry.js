$(function(){
  var $title = $('#title');
  var $category = $('#category');
  var $author = $('#author');
  var $authorUrl = $('#authorUrl');
  var $pubDate = $('#pubDate');
  var $body = $('#body');
  var $jsonPrint = $('#JSON');
  var newArticle = {};


  function render (){

    $('#prevTitle').text($title.val());
    $('#prevCat').text($category.val());
    $('#prevAuth').text($author.val());
    $('#prevUrl').text($authorUrl.val());
    $('#prevDate').text($pubDate.val());
    $('#prevBody').text($body.val());

    var titleVal = marked($title.val());
    var catVal = marked($category.val());
    var authorVal = marked($author.val());
    var urlVal = marked($authorUrl.val());
    var dateVal = marked($pubDate.val());
    var bodyVal = marked($body.val());

    newArticle.title = titleVal;
    newArticle.category = catVal;
    newArticle.author = authorVal;
    newArticle.authorUrl = urlVal;
    newArticle.publishedOn =dateVal;
    newArticle.body = bodyVal;

    $jsonPrint.text(JSON.stringify(newArticle));



  }

  $title.on('input', render);
  $category.on('input', render);
  $author.on('input', render);
  $authorUrl.on('input', render);
  $pubDate.on('input', render);
  $body.on('input', render);

  render();

});
