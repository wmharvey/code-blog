$(function(){
  var $title = $('#title');
  var $category = $('#category');
  var $author = $('#author');
  var $authorUrl = $('#authorUrl');
  var $pubDate = $('#pubDate');
  var $body = $('#body');
  var $jsonPrint = $('#JSON');
  var newArticle = {};

  $title.attr('value', localStorage.getItem('title'));
  $category.attr('value', localStorage.getItem('category'));
  $author.attr('value', localStorage.getItem('author'));
  $authorUrl.attr('value', localStorage.getItem('authorUrl'));
  $pubDate.attr('value', localStorage.getItem('date'));
  $body.html(localStorage.getItem('body'));


  function render (){

    var title = ($title.val());
    var category = ($category.val());
    var author = ($author.val());
    var authorUrl = ($authorUrl.val());
    var date = ($pubDate.val());
    var markedBody = marked($body.val());

    newArticle.title = title;
    localStorage.setItem('title', title);
    newArticle.category = category;
    localStorage.setItem('category', category);
    newArticle.author = author;
    localStorage.setItem('author', author);
    newArticle.authorUrl = authorUrl;
    localStorage.setItem('authorUrl', authorUrl);
    newArticle.publishedOn = date;
    localStorage.setItem('date', date);
    newArticle.body = markedBody;
    localStorage.setItem('body', $body.val());

    $jsonPrint.text(JSON.stringify(newArticle));

//Fill out preview using Handlebars//

    Handlebars.registerHelper('getDate', function(strDate){
      var strDate = strDate || '';
      var date = parseInt((new Date() - new Date(strDate))/60/60/24/1000);
      return date;
    });

    $.get('templates/template.html', function(data) {
      var template = Handlebars.compile(data);
      var compiledArticleHtml = template(newArticle);
      $('#articleContainer').html(compiledArticleHtml);
//Use syntax highlighting on author written code
      $('#articleContainer').find('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
//Hide the first paragraph and enable 'See More' to drop down paragraphs
      blog.hideFirstParagraph();
      blog.addEventListernerMore();
    });

  };

  render();

  $title.on('input', render);
  $category.on('input', render);
  $author.on('input', render);
  $authorUrl.on('input', render);
  $pubDate.on('input', render);
  $body.on('input', render);

  $('#submit').on('click', function() {
    localStorage.clear();
    $title.removeAttr('value');
    $category.removeAttr('value');
    $author.removeAttr('value');
    $authorUrl.removeAttr('value');
    $pubDate.removeAttr('value');
    $body.html('');
    render();
  });
});
