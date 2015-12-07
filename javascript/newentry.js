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

    var title = ($title.val());
    var category = ($category.val());
    var author = ($author.val());
    var authorUrl = ($authorUrl.val());
    var date = ($pubDate.val());
    var markedBody = marked($body.val());

    newArticle.title = title;
    newArticle.category = category;
    newArticle.author = author;
    newArticle.authorUrl = authorUrl;
    newArticle.publishedOn = date;
    newArticle.body = markedBody;

    $jsonPrint.text(JSON.stringify(newArticle));

//Fill out preview using Handlebars//

    Handlebars.registerHelper('getDate', function(strDate){
      var strDate = strDate || '';
      var date = parseInt((new Date() - new Date(strDate))/60/60/24/1000);
      return date;
    });

    var templateScript = $('#article-template').html();
    var template = Handlebars.compile(templateScript);
    var compiledArticleHtml = template(newArticle);
    $('#articleContainer').html(compiledArticleHtml);

    blog.hideFirstParagraph();
  };

  $title.on('input', render);
  $category.on('input', render);
  $author.on('input', render);
  $authorUrl.on('input', render);
  $pubDate.on('input', render);
  $body.on('input', render);

  $('.more').on('click', function() {
    console.log('help!')
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

  $('.more').on('click', function() {
    console.log('clicked');
  })

});
